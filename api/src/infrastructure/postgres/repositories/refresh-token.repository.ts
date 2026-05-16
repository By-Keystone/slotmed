import type { RefreshToken } from "@prisma/client";
import type { IRefreshTokenRepository } from "../../../domain/repositories/refresh-token.repository.js";
import { getClient } from "../transaction-context.js";

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  async create(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    return getClient().refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return getClient().refreshToken.findUnique({ where: { token } });
  }

  async deleteByToken(token: string): Promise<void> {
    await getClient().refreshToken.delete({ where: { token } });
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await getClient().refreshToken.deleteMany({ where: { userId } });
  }
}
