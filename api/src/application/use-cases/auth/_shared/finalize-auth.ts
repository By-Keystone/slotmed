import type { User } from "@/domain/entities/user/entity";
import type { IAuthStepResolver } from "@/domain/services/auth-step-resolver";
import type { IAuthTokenService } from "@/domain/services/auth-token-service";
import type { ISessionTokenSigner } from "@/domain/services/session-token-signer";
import type { LoginResult } from "./login-result";

export class FinalizeAuth {
  constructor(
    private readonly stepResolver: IAuthStepResolver,
    private readonly tokens: IAuthTokenService,
    private readonly sessionToken: ISessionTokenSigner,
  ) {}

  async forUser(user: User): Promise<LoginResult> {
    const step = this.stepResolver.resolve(user);

    if (step.kind === "ready") {
      const tokens = await this.tokens.issue(user);
      return { status: "authenticated", ...tokens };
    }

    const sessionToken = await this.sessionToken.sign({
      sub: user.id,
      step: step.kind,
    });

    return { status: step.kind, sessionToken };
  }
}
