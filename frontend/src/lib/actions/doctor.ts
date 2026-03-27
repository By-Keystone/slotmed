"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingStatus } from "../utils";

export type ActionResult = { ok: false; error: string } | { ok: true };
export async function createDoctor(
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const body = {
    name: formData.get("name") as string,
    specialty: formData.get("specialty") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    clinicId: formData.get("clinicId") as string,
  };

  if (!body.name)
    return { ok: false, error: "El nombre del doctor es obligatorio" };

  const res = await fetch(`${process.env.API_URL}/api/v1/doctors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error ?? "Error al crear el doctor" };
  }

  await supabase.auth.updateUser({
    data: {
      onboarding_completed: true,
      onboarding_step: OnboardingStatus.DoctorCreated,
    },
  });

  redirect("/dashboard");
}
