import { redirect } from "next/navigation";
import { Unauthorized } from "../errors";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "../cognito/cookies";

const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.accessToken);
  cookieStore.delete(COOKIE_NAMES.idToken);
  cookieStore.delete(COOKIE_NAMES.refreshToken);
};

export async function withAuth<T>(
  action: () => Promise<T>,
): Promise<T | { unauthorized: true }> {
  try {
    return await action();
  } catch (error) {
    if (error instanceof Unauthorized) {
      await clearAuthCookies();
      return { unauthorized: true };
    }
    throw error;
  }
}
