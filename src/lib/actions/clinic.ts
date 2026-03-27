"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { OnboardingStatus, UserRole } from "../utils";
import {
  findClinicByUserId,
  createClinic as repositoryCreateClinic,
} from "../repository/clinic.repository";
import { ClinicCreateInput } from "../../../prisma/generated/models";
import { redirect } from "next/navigation";
import { getUserByAuthId } from "./user";
import db from "../db";

export type ActionResult =
  | { ok: true; data: { [key: string]: any } }
  | { ok: false; error: string };

export async function createClinic(
  userId: number,
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const body = {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    phone: formData.get("phone") as string,
    createdBy: userId,
  };

  if (!body.name)
    return { ok: false, error: "El nombre del consultorio es obligatorio" };

  try {
    const clinic: ClinicCreateInput = {
      name: body.name,
      address: body.address,
      contacts: {
        create: {
          user_id: userId,
          assigned_by_id: userId,
        },
      },
    };
    const clinicId = await repositoryCreateClinic({
      data: clinic,
    });
    await supabase.auth.updateUser({
      data: {
        onboarding_completed: false,
        onboarding_step: OnboardingStatus.ClinicCreated,
      },
    });

    return { ok: true, data: { clinicId } };
  } catch (error) {
    console.error("Ha ocurrido un error en el servidor: ", error);
    return { ok: false, error: "Ha ocurrido un error en el servidor" };
  }
}

export async function getClinicByUserId(userId: number): Promise<ActionResult> {
  try {
    const clinic = await findClinicByUserId({
      where: {
        contacts: { some: { user_id: userId, assigned_by_id: userId } },
      },
    });

    if (!clinic) return { ok: true, data: {} };

    return { ok: true, data: { clinicId: clinic.id } };
  } catch (error) {
    console.log(error);
    return { ok: false, error: "Ha ocurrido un error en el servidor" };
  }
}

export async function getClinicCount(): Promise<ActionResult> {
  try {
    const supabaseUser = await getUser();

    if (!supabaseUser) redirect("/login");

    if (supabaseUser?.user_metadata?.role !== UserRole.ADMIN)
      return { ok: false, error: "No tiene los permisos necesario" };

    const userByAuthIdResult = await getUserByAuthId(supabaseUser.id);

    if (!userByAuthIdResult.ok) {
      console.error("Error obteniendo usuario:", userByAuthIdResult.error);
      return { ok: false, error: userByAuthIdResult.error };
    }

    const { user } = userByAuthIdResult.data;

    const count = await db.clinic.count({
      where: { contacts: { some: { user_id: user.id } } },
    });

    return { ok: true, data: { count } };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: "Ha ocurrido un error al obtener el número de clínicas",
    };
  }
}
