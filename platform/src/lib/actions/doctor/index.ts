"use server";

export type ActionResult = { ok: false; error: string } | null;

export async function addDoctor(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  // TODO: implement with backend API
  void formData;
  return { ok: false, error: "Not implemented" };
}

export async function getDoctorCount(): Promise<
  { ok: false; error: string } | { ok: true; data: Record<string, unknown> }
> {
  // TODO: implement with backend API
  return { ok: false, error: "Not implemented" };
}

export async function findDoctorByUserId(): Promise<
  { ok: false; error: string } | { ok: true; data: Record<string, unknown> }
> {
  // TODO: implement with backend API
  return { ok: false, error: "Not implemented" };
}
