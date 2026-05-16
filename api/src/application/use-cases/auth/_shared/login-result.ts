import type { PendingAuthStep } from "@/domain/auth/auth-step";

export type LoginResult =
  | { status: "authenticated"; accessToken: string; refreshToken: string }
  | { status: PendingAuthStep; sessionToken: string };
