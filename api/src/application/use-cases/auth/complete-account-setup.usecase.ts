import { z } from "zod";
import type { IAccountRepository } from "@/domain/repositories/account.repository";
import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { ITransactionManager } from "@/domain/services/transaction-manager";
import type { ISessionTokenSigner } from "@/domain/services/session-token-signer";
import { BadRequest } from "@/application/errors/bad-request.errors";
import { NotFound } from "@/application/errors/not-found.error";
import { FinalizeAuth } from "./_shared/finalize-auth";
import type { LoginResult } from "./_shared/login-result";

export const completeAccountSetupSchema = z.object({
  sessionToken: z.string().min(1),
  accountName: z.string().min(1),
});

export type CompleteAccountSetupDto = z.infer<
  typeof completeAccountSetupSchema
>;

export class CompleteAccountSetupUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly accounts: IAccountRepository,
    private readonly subscriptions: ISubscriptionRepository,
    private readonly sessionToken: ISessionTokenSigner,
    private readonly finalize: FinalizeAuth,
    private readonly tx: ITransactionManager,
  ) {}

  async execute(dto: CompleteAccountSetupDto): Promise<LoginResult> {
    let payload;
    try {
      payload = await this.sessionToken.verify(dto.sessionToken);
    } catch {
      throw new BadRequest("Session token inválido o expirado");
    }

    if (payload.step !== "needs_account") {
      throw new BadRequest("El session token no corresponde a este paso");
    }

    await this.tx.runInTransaction(async () => {
      const account = await this.accounts.save({
        name: dto.accountName,
        ownerId: payload.sub,
      });

      await Promise.all([
        this.users.update(payload.sub, {
          onboardingCompleted: true,
          accountId: account.id,
        }),
        this.subscriptions.save({
          accountId: account.id,
          plan: "BASIC",
          status: "ACTIVE",
        }),
      ]);
    });

    const user = await this.users.findById(payload.sub);
    if (!user) throw new NotFound("Usuario no encontrado");

    return this.finalize.forUser(user);
  }
}
