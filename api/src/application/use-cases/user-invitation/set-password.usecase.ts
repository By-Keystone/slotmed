import {
  getClient,
  inTransaction,
} from "@/infrastructure/postgres/transaction-context";
import z from "zod";
import { UnprocessableEntity } from "@/application/errors/unprocessable-entity.errors";
import auth from "@/infrastructure/vendors/auth/better-auth/auth";

export const setPasswordSchema = z.object({
  userId: z.string("User ID is required"),
  password: z.string("Password is required"),
});

type SetPasswordDTO = z.infer<typeof setPasswordSchema>;

export class SetPasswordUseCase {
  constructor() {}

  async execute(data: SetPasswordDTO) {
    const client = getClient();

    const existingAuthAccount = await client.authAccount.findFirst({
      where: { userId: data.userId, providerId: "credential" },
    });

    if (existingAuthAccount) {
      console.log(
        `[set-password]: User ${data.userId} already has an account with email/password`,
      );

      throw new UnprocessableEntity("El usuario ya tiene una contraseña");
    }

    const ctx = await auth.$context;
    const hash = await ctx.password.hash(data.password);

    return await inTransaction(async () => {
      const txClient = getClient();
      await txClient.authAccount.create({
        data: {
          providerId: "credential",
          userId: data.userId,
          accountId: data.userId,
          password: hash,
        },
      });

      const user = await txClient.user.update({
        data: { confirmed: true, onboardingCompleted: true },
        where: { id: data.userId },
      });

      return { accountId: user.accountId, email: user.email };
    });
  }
}
