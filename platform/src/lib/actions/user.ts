"use server";

export type ActionResult =
  | { ok: true; data: { user: any } }
  | { ok: false; error: string };

export async function getUserByAuthId(authId: string): Promise<ActionResult> {
  // TODO: implement with Cognito/DynamoDB
  return { ok: false, error: "Not implemented" };
}
