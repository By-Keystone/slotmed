"use server";

import { createClient } from "@/lib/supabase/server";
import { OnboardingStep } from "@/lib/utils";

export type ActionResult =
  | { ok: true; data: { [key: string]: any } }
  | { ok: false; error: string };

export async function selectRole(
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const isDoctor = formData.get("is_doctor") === "true";

  const { error } = await supabase.auth.updateUser({
    data: {
      is_doctor: isDoctor,
      onboarding_step: OnboardingStep.RoleSelected,
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { isDoctor } };
}
