"use server";

import { tags } from "@/lib/api/specialty";
import { doFetch } from "@/lib/api/fetch";
import { getSession } from "@/lib/auth/session";
import { revalidateTag } from "next/cache";
import z, { treeifyError } from "zod";

const createSpecialtySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

export type CreateSpecialtyState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<
        Record<
          keyof z.infer<typeof createSpecialtySchema>,
          { errors: string[] } | undefined
        >
      >;
    }
  | { status: "success" }
  | { status: "auth-expired" };

export async function createSpecialtyAction(
  organizationId: string,
  _prevState: CreateSpecialtyState,
  data: FormData,
): Promise<CreateSpecialtyState> {
  const session = await getSession();
  if (!session) return { status: "auth-expired" };

  const parsed = createSpecialtySchema.safeParse({
    name: data.get("name"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Datos inválidos",
      fieldErrors: treeifyError(parsed.error).properties,
    };
  }

  try {
    const response = await doFetch(`/${organizationId}/specialty`, {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return {
        status: "error",
        message: payload?.message ?? "No se pudo crear la especialidad",
      };
    }

    revalidateTag(tags.organizationSpecialties(organizationId));
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Ha ocurrido un error",
    };
  }
}
