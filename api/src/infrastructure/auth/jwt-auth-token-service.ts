import { SignJWT } from "jose";
import { randomBytes } from "node:crypto";
import type { User } from "@/domain/entities/user/entity";
import type {
  AuthTokens,
  IAuthTokenService,
} from "@/domain/services/auth-token-service";
import type { IRefreshTokenRepository } from "@/domain/repositories/refresh-token.repository";
import type { IAccountRepository } from "@/domain/repositories/account.repository";

const ACCESS_TOKEN_EXPIRY = "30m";
const REFRESH_TOKEN_DAYS = 30;

export class JwtAuthTokenService implements IAuthTokenService {
  constructor(
    private readonly secret: Uint8Array,
    private readonly refreshTokens: IRefreshTokenRepository,
    private readonly accounts: IAccountRepository,
  ) {}

  async issue(user: User): Promise<AuthTokens> {
    const account = await this.accounts.findByOwnerId(user.id);

    const accessToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      accountId: account?.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(ACCESS_TOKEN_EXPIRY)
      .setIssuedAt()
      .sign(this.secret);

    const refreshToken = randomBytes(40).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

    await this.refreshTokens.create(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }
}
