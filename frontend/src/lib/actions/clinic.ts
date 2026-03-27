"use server";

import { createClient } from "@/lib/supabase/server";
import { OnboardingStatus } from "../utils";

export type ActionResult =
  | { ok: true; data: { clinicId: string } }
  | { ok: false; error: string };

export async function createClinic(
  userId: string,
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const body = {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    createdBy: userId,
  };

  if (!body.name)
    return { ok: false, error: "El nombre del consultorio es obligatorio" };

  const res = await fetch(`${process.env.API_URL}/api/v1/clinics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error ?? "Error al crear el consultorio" };
  }

  const clinic = await res.json();

  await supabase.auth.updateUser({
    data: {
      onboarding_completed: false,
      onboarding_step: OnboardingStatus.ClinicCreated,
    },
  });

  return { ok: true, data: { clinicId: clinic.id } };
}

export async function getClinicByUserId(
  userId: string,
): Promise<{ error?: any; data?: any }> {
  const res = await fetch(`${process.env.API_URL}/${userId}/clinic`, {
    method: "GET",
  });

  let json;
  try {
    json = await res.json();
  } catch (err) {
    console.error("Error getting clinic by user auth id");
    return { error: err };
  }

  return { data: json };
}
