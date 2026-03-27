"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingStatus } from "../utils";

export type ActionResult = { ok: false; error: string };

export async function register(
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const lastname = formData.get("lastname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;

  if (!name || !email || !password || !phone) {
    return { ok: false, error: "Todos los campos son obligatorios" };
  }
  if (password.length < 8) {
    return {
      ok: false,
      error: "La contraseña debe tener al menos 8 caracteres",
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        lastname,
        phone,
        onboarding_completed: false,
        onboarding_step: OnboardingStatus.RegistrationCompleted,
      },
    },
  });

  if (error) return { ok: false, error: error.message };

  redirect("/verify-email");
}

export async function login(_: unknown, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email y contraseña son obligatorios" };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error({ error: error.code });
    let message;

    if (error.code === "email_not_confirmed")
      message = "El correo no está confirmado";
    else message = "Ha ocurrido un error";

    return { ok: false, error: message };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
