"use server";

export type ActionResult = { ok: false; error: string } | null;

export async function updateClinic(data: FormData) {}
export async function getClinicCount(): Promise<
  { ok: false; error: string } | { ok: true; data: Record<string, unknown> }
> {
  // TODO: implement with backend API
  return { ok: false, error: "Not implemented" };
}
