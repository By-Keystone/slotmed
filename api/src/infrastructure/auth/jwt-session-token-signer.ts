import { SignJWT, jwtVerify } from "jose";
import type {
  ISessionTokenSigner,
  SessionTokenPayload,
} from "@/domain/services/session-token-signer";

const SESSION_TOKEN_AUDIENCE = "auth-step";
const SESSION_TOKEN_EXPIRY = "10m";

export class JwtSessionTokenSigner implements ISessionTokenSigner {
  constructor(private readonly secret: Uint8Array) {}

  async sign(payload: SessionTokenPayload): Promise<string> {
    return new SignJWT({ step: payload.step })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.sub)
      .setAudience(SESSION_TOKEN_AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(SESSION_TOKEN_EXPIRY)
      .sign(this.secret);
  }

  async verify(token: string): Promise<SessionTokenPayload> {
    const { payload } = await jwtVerify(token, this.secret, {
      audience: SESSION_TOKEN_AUDIENCE,
    });

    if (typeof payload.sub !== "string" || typeof payload.step !== "string") {
      throw new Error("Malformed session token");
    }

    return {
      sub: payload.sub,
      step: payload.step as SessionTokenPayload["step"],
    };
  }
}
