"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingStatus, UserRole } from "../utils";
import type { UserCreateInput } from "../../../prisma/generated/models";
import { createUser } from "../repository/user.repository";

export type ActionResult = { ok: false; error: string };

export async function register(
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const lastName = formData.get("lastname") as string;
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

  const {
    error,
    data: { user },
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        lastname: lastName,
        phone,
        onboarding_completed: false,
        onboarding_step: OnboardingStatus.RegistrationCompleted,
        role: UserRole.ADMIN,
      },
    },
  });

  if (error) return { ok: false, error: error.message };

  if (!user)
    return {
      ok: false,
      error:
        "Ha ocurrido un error y no se pudo completar el registro. Por favor inténtelo nuevamente",
    };

  const userEntity: UserCreateInput = {
    email,
    last_name: lastName,
    name,
    phone,
    active: true,
    auth_id: user.id,
  };
  try {
    const user = await createUser({ data: userEntity, select: { id: true } });
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    } else return { ok: false, error: "Ha ocurrido un error en el servidor" };
  }
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
