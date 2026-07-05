import "server-only";

import { cookies } from "next/headers";
import { COOKIE_NAMES } from "./cookies";

export type ActiveResource = {
  resourceId: string | undefined;
  resourceType: string | undefined;
};

export async function getActiveResource(): Promise<ActiveResource> {
  const cookieStore = await cookies();
  return {
    resourceId: cookieStore.get(COOKIE_NAMES.resourceId)?.value,
    resourceType: cookieStore.get(COOKIE_NAMES.resourceType)?.value,
  };
}
