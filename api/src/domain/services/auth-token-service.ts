import type { User } from "@/domain/entities/user/entity";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthTokenService {
  issue(user: User): Promise<AuthTokens>;
}
