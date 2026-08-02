"use server";

import { tags } from "@/lib/api/specialty";
import { doFetchJson } from "@/lib/api/fetch";
import { toActionState } from "@/lib/actions/to-action-state";
import { getSession } from "@/lib/auth/session";
import { revalidateTag } from "next/cache";
import z, { treeifyError } from "zod";

const updateSpecialtySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

export type UpdateSpecialtyState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<
        Record<
          keyof z.infer<typeof updateSpecialtySchema>,
          { errors: string[] } | undefined
        >
      >;
    }
  | { status: "success" }
  | { status: "auth-expired" };

export async function updateSpecialtyAction(
  organizationId: string,
  specialtyId: string,
  _prevState: UpdateSpecialtyState,
  data: FormData,
): Promise<UpdateSpecialtyState> {
  const session = await getSession();
  if (!session) return { status: "auth-expired" };

  const parsed = updateSpecialtySchema.safeParse({
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
    await doFetchJson(`/${organizationId}/specialty/${specialtyId}`, {
      method: "PUT",
      body: JSON.stringify(parsed.data),
    });

    revalidateTag(tags.organizationSpecialties(organizationId));
    return { status: "success" };
  } catch (error) {
    return toActionState(error);
  }
}
