"use server";

import { tags } from "@/lib/api/clinic";
import { doFetch } from "@/lib/api/fetch";
import { getSession } from "@/lib/auth/session";
import { revalidateTag } from "next/cache";
import z, { treeifyError } from "zod";

const inviteUserSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  role: z.enum(["DOCTOR", "USER"]),
});

export type InviteUserState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<
        Record<
          keyof z.infer<typeof inviteUserSchema>,
          { errors: string[] } | undefined
        >
      >;
    }
  | { status: "success" }
  | { status: "auth-expired" };

export async function inviteUserAction(
  clinicId: string,
  _prevState: InviteUserState,
  data: FormData,
): Promise<InviteUserState> {
  const session = await getSession();
  if (!session) return { status: "auth-expired" };

  const parsed = inviteUserSchema.safeParse({
    name: data.get("name"),
    lastName: data.get("lastName"),
    email: data.get("email"),
    phone: data.get("phone"),
    role: data.get("role"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Datos inválidos",
      fieldErrors: treeifyError(parsed.error).properties,
    };
  }

  try {
    const response = await doFetch("/user/invite", {
      method: "POST",
      body: JSON.stringify({ ...parsed.data, resourceId: clinicId }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      // El backend a veces devuelve un objeto de error (Prisma) en `message`;
      // aseguramos que siempre sea un string para poder renderizarlo.
      const message =
        typeof payload?.message === "string"
          ? payload.message
          : "No se pudo invitar al usuario";
      return { status: "error", message };
    }

    revalidateTag(tags.clinicUsers(clinicId));
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Ha ocurrido un error",
    };
  }
}
