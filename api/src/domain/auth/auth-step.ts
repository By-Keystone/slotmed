export type AuthStep =
  | { kind: "ready" }
  | { kind: "needs_account" };

export type PendingAuthStep = Exclude<AuthStep, { kind: "ready" }>["kind"];
