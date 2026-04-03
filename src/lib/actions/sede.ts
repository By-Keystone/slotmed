"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { OnboardingStep, UserRole } from "../utils";
import {
  findSedeByUserId,
  createSede as repositoryCreateSede,
  updateSede as repositoryUpdateSede,
} from "../repository/sede.repository";
import { SedeCreateInput } from "../../../prisma/generated/models";
import { redirect } from "next/navigation";
import { getUserByAuthId } from "./user";
import db from "../db";

export type ActionResult =
  | { ok: true; data: { [key: string]: any } }
  | { ok: false; error: string };

export async function createSede(
  userId: number,
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const body = {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    phone: formData.get("phone") as string,
  };

  if (!body.name)
    return { ok: false, error: "El nombre de la sede es obligatorio" };

  try {
    const sede: SedeCreateInput = {
      name: body.name,
      address: body.address,
      contacts: {
        create: {
          user_id: userId,
          assigned_by_id: userId,
        },
      },
    };
    const sedeId = await repositoryCreateSede({ data: sede });
    await supabase.auth.updateUser({
      data: {
        onboarding_completed: false,
        onboarding_step: OnboardingStep.SedeCreated,
      },
    });

    return { ok: true, data: { sedeId } };
  } catch (error) {
    console.error("Ha ocurrido un error en el servidor: ", error);
    return { ok: false, error: "Ha ocurrido un error en el servidor" };
  }
}

export async function getSedeByUserId(userId: number): Promise<ActionResult> {
  try {
    const sede = await findSedeByUserId({
      where: {
        contacts: { some: { user_id: userId, assigned_by_id: userId } },
      },
    });

    if (!sede) return { ok: true, data: {} };

    return { ok: true, data: { sedeId: sede.id } };
  } catch (error) {
    console.log(error);
    return { ok: false, error: "Ha ocurrido un error en el servidor" };
  }
}

export async function updateSede(
  sedeId: number,
  _: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;

  if (!name) return { ok: false, error: "El nombre de la sede es obligatorio" };

  try {
    await repositoryUpdateSede(sedeId, { name, address });
    return { ok: true, data: {} };
  } catch (error) {
    return { ok: false, error: "Ha ocurrido un error al actualizar la sede" };
  }
}

export async function getSedeCount(): Promise<ActionResult> {
  try {
    const supabaseUser = await getUser();

    if (!supabaseUser) redirect("/login");

    if (supabaseUser?.user_metadata?.role !== UserRole.ADMIN)
      return { ok: false, error: "No tiene los permisos necesarios" };

    const userByAuthIdResult = await getUserByAuthId(supabaseUser.id);

    if (!userByAuthIdResult.ok) {
      console.error("Error obteniendo usuario:", userByAuthIdResult.error);
      return { ok: false, error: userByAuthIdResult.error };
    }

    const { user } = userByAuthIdResult.data;

    const count = await db.sede.count({
      where: { contacts: { some: { user_id: user.id } } },
    });

    return { ok: true, data: { count } };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: "Ha ocurrido un error al obtener el número de sedes",
    };
  }
}
