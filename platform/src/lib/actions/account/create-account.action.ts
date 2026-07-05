"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const completeAccountSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

export type CreateAccountState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<
        Record<keyof z.infer<typeof completeAccountSchema>, string[]>
      >;
    };

export async function createAccountAction(
  _prevState: CreateAccountState,
  data: FormData,
): Promise<CreateAccountState> {
  const parsed = completeAccountSchema.safeParse({ name: data.get("name") });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Datos inválidos",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Reenvía la cookie de sesión de Better Auth al api para autenticar.
  const cookieHeader = (await headers()).get("cookie") ?? "";

  const response = await fetch(`${process.env.API_URL}/account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify({ accountName: parsed.data.name }),
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return {
      status: "error",
      message: payload?.message ?? "No se pudo crear la cuenta",
    };
  }

  const { accountId } = await response.json();

  redirect(`/account/${accountId}/select`);
}
