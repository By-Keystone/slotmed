"use server";

import { redirect } from "next/navigation";
import {
  createAdminClient,
  createClient,
  getUser,
} from "@/lib/supabase/server";
import { OnboardingStep, UserRole } from "../../utils";
import {
  DoctorCreateInput,
  UserCreateInput,
} from "../../../../prisma/generated/models";
import {
  getDoctorByUserId,
  insertDoctor,
  insertDoctorForExistingUser,
} from "@/lib/repository/doctor.repository";
import db from "@/lib/db";
import { getUserByAuthId } from "../user";
import { findUserByAuthId } from "@/lib/repository/user.repository";

export type ActionResult =
  | { ok: false; error: string }
  | {
      ok: true;
      data?: {
        [key: string]: any;
      };
    };

export async function createDoctor(
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabaseAdmin = await createAdminClient();

  const supabase = await createClient();
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();
  if (getUserError || !user) {
    console.error(getUserError);
    redirect("/login");
  }

  // Creates user for doctor
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    formData.get("email") as string,
    {
      redirectTo: `${process.env.SITE_URL}/set-password`,
      data: {
        role: UserRole.USER,
        onboarding_completed: true,
        onboarding_step: OnboardingStep.Registered,
        is_doctor: true,
      },
    },
  );

  if (error) {
    console.log("Error al crear entidad auth del doctor: ", error);
    return { ok: false, error: error.message };
  }

  const { id } = data.user;

  // Creates user entity for doctor
  const doctorEntity: Omit<DoctorCreateInput, "user"> & UserCreateInput = {
    name: formData.get("name") as string,
    last_name: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    auth_id: id,
    specialty: formData.get("specialty") as string,
    sede: { connect: { id: Number(formData.get("sedeId") as string) } },
  };

  await insertDoctor(doctorEntity);

  const { error: updateUserError } = await supabase.auth.updateUser({
    data: {
      onboarding_completed: true,
      onboarding_step: OnboardingStep.Completed,
    },
  });

  if (updateUserError) {
    console.error(
      "Hubo un error actualizando el usuario:",
      updateUserError.message,
    );

    return { ok: false, error: "Ha ocurrido un error actualizando el usuario" };
  } else redirect("/");
}

export async function createDoctorSelf(
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();
  if (getUserError || !user) redirect("/login");

  const specialty = formData.get("specialty") as string;
  const sedeId = Number(formData.get("sedeId"));

  if (!specialty) return { ok: false, error: "La especialidad es obligatoria" };

  const dbUser = await findUserByAuthId({
    where: { auth_id: user.id, active: true },
  });

  await insertDoctorForExistingUser({ userId: dbUser.id, specialty, sedeId });

  await supabase.auth.updateUser({
    data: {
      onboarding_completed: true,
      onboarding_step: OnboardingStep.Completed,
    },
  });

  return { ok: true };
}

export async function skipCreateDoctor() {
  const supabase = await createClient();

  supabase.auth.updateUser({
    data: {
      onboarding_completed: true,
      onboarding_step: OnboardingStep.Completed,
    },
  });

  redirect("/");
}

export async function addDoctor(
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabaseAdmin = await createAdminClient();

  const supabase = await createClient();
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();
  if (getUserError || !user) redirect("/login");

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    formData.get("email") as string,
    {
      redirectTo: `${process.env.SITE_URL}/set-password`,
      data: {
        role: UserRole.USER,
        onboarding_completed: true,
        onboarding_step: OnboardingStep.Registered,
        is_doctor: true,
      },
    },
  );

  if (error) {
    console.log("Error al crear entidad auth del doctor: ", error);
    return { ok: false, error: error.message };
  }

  const { id } = data.user;

  const doctorEntity: Omit<DoctorCreateInput, "user"> & UserCreateInput = {
    name: formData.get("name") as string,
    last_name: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    auth_id: id,
    specialty: formData.get("specialty") as string,
    sede: { connect: { id: Number(formData.get("sedeId") as string) } },
  };

  await insertDoctor(doctorEntity);

  return { ok: true };
}

export async function getDoctorCount(): Promise<ActionResult> {
  try {
    const supabaseUser = await getUser();

    if (!supabaseUser) redirect("/login");

    if (supabaseUser?.user_metadata?.role !== UserRole.ADMIN)
      return { ok: false, error: "No tiene los permisos necesarios" };
    const userByAuthIdResult = await getUserByAuthId(supabaseUser?.id);

    if (!userByAuthIdResult.ok) {
      console.log("Error obteniendo usuario: ", userByAuthIdResult.error);
      return { ok: false, error: userByAuthIdResult.error };
    }

    const { user } = userByAuthIdResult.data;

    const count = await db.doctor.count({
      where: { sede: { contacts: { some: { user_id: user.id } } } },
    });

    return { ok: true, data: { count } };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Ha ocurrido un error al obtener los doctores" };
  }
}

export async function findDoctorByUserId(): Promise<ActionResult> {
  try {
    const supabaseUser = await getUser();
    if (!supabaseUser) redirect("/login");

    const dbUser = await findUserByAuthId({
      where: { auth_id: supabaseUser.id, active: true },
    });

    const doctor = await getDoctorByUserId(dbUser.id);

    return { ok: true, data: { doctor } };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Ha ocurrido un error en el servidor" };
  }
}
