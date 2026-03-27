"use server";

import { cookies } from "next/headers";
import { User } from "../../../prisma/generated/client";
import { findUserByAuthId } from "../repository/user.repository";
import { createClient } from "../supabase/server";

type ActionResult =
  | { ok: true; data: { user: User } }
  | { ok: false; error: string };

export async function getUserByAuthId(authId: string): Promise<ActionResult> {
  try {
    const user = await findUserByAuthId({
      where: { auth_id: authId, active: true },
      omit: {
        auth_id: true,
        created_at: true,
        deleted_at: true,
        updated_at: true,
      },
    });

    return { ok: true, data: { user } };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    } else {
      return { ok: false, error: "Ha ocurrido un error el servidor" };
    }
  }
}
