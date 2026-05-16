import { SignJWT } from "jose";
import { randomBytes } from "node:crypto";
import type { IUserRepository } from "@/domain/repositories/user.repository.js";
import type { IRefreshTokenRepository } from "@/domain/repositories/refresh-token.repository.js";
import { UnauthorizedError } from "./login.usecase.js";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production",
);

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_DAYS = 30;

export class RefreshTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(token: string) {
    const stored = await this.refreshTokenRepository.findByToken(token);

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await this.refreshTokenRepository.deleteByToken(token);
      throw new UnauthorizedError("Refresh token inválido o expirado");
    }

    const user = await this.userRepository.findById(stored.userId);
    if (!user) {
      throw new UnauthorizedError("Usuario no encontrado");
    }

    // Rotate refresh token
    await this.refreshTokenRepository.deleteByToken(token);

    const newRefreshToken = randomBytes(40).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

    await this.refreshTokenRepository.create(
      user.id,
      newRefreshToken,
      expiresAt,
    );

    const accessToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted,
      accountId: user.accountId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(ACCESS_TOKEN_EXPIRY)
      .setIssuedAt()
      .sign(JWT_SECRET);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
