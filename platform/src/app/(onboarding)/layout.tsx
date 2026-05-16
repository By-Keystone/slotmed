import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { getMe } from "@/lib/auth/me";
import { getActiveResource } from "@/lib/auth/guards";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAMES.sessionToken)?.value;

  if (sessionToken) return <>{children}</>;

  const me = await getMe();
  if (!me) redirect("/login");

  if (!me.onboardingCompleted) return <>{children}</>;

  const { resourceId, resourceType } = await getActiveResource();
  if (!resourceId || !resourceType) {
    redirect(`/account/${me.accountId}/select`);
  }

  redirect(
    `/account/${me.accountId}/${resourceType.toLowerCase()}/${resourceId}`,
  );
}
