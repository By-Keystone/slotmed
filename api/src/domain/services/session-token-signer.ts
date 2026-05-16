import type { PendingAuthStep } from "@/domain/auth/auth-step";

export interface SessionTokenPayload {
  sub: string;
  step: PendingAuthStep;
}

export interface ISessionTokenSigner {
  sign(payload: SessionTokenPayload): Promise<string>;
  verify(token: string): Promise<SessionTokenPayload>;
}
