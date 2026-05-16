"use server";

import z, { treeifyError } from "zod";
import { AuthExpiredError } from "@/lib/api/errors";
import { redirect } from "next/navigation";
import { doFetch } from "@/lib/api/fetch";
import { getSession } from "@/lib/auth/session";

const createOrganizationSchema = z.object({
  name: z.string("Name is required"),
  userId: z.string().optional(),
});

export type CreateOrganizationState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<
        Record<
          keyof z.infer<typeof createOrganizationSchema>,
          { errors: string[] } | undefined
        >
      >;
    }
  | { status: "success"; redirectTo: string }
  | { status: "auth-expired"; redirectTo: string };

export const createOrganizationAction = async (
  _prevState: CreateOrganizationState,
  data: FormData,
): Promise<CreateOrganizationState> => {
  const parsed = createOrganizationSchema.safeParse({
    name: data.get("name"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Datos inválidos",
      fieldErrors: treeifyError(parsed.error).properties,
    };
  }

  const session = await getSession();

  try {
    const response = await doFetch("/organization", {
      method: "POST",
      body: JSON.stringify({
        ...parsed.data,
        userId: parsed.data.userId || session?.userId,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      return {
        status: "error",
        message:
          payload?.message ??
          "An unexpected response was received from the server.",
      };
    }
  } catch (error) {
    if (error instanceof AuthExpiredError) {
      return redirect("/login");
    }

    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "No se pudo crear la organización",
    };
  }

  console.log("ABOUT TO REDIRECT TO SELECT");
  redirect("/select");
};
