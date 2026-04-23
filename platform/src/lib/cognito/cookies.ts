export const COOKIE_NAMES = {
  accessToken: "cognito_access_token",
  idToken: "cognito_id_token",
  refreshToken: "cognito_refresh_token",
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 1, // 1 minute
};

export const REFRESH_TOKEN_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 60 * 60 * 24 * 30, // 30 days
};
