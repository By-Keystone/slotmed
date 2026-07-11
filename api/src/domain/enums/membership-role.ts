export const MembershipRole = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  USER: "USER",
} as const;

export type MembershipRole =
  (typeof MembershipRole)[keyof typeof MembershipRole];
