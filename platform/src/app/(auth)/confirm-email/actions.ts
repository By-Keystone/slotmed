import z from "zod";

export type ConfirmUserAccountState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export type ConfirmUserAccountData = { token: string };

const confirmUserAccountSchema = z.object({
  token: z.string(),
});

export async function confirmAccountAction(
  data: ConfirmUserAccountData,
): Promise<ConfirmUserAccountState> {
  const parsed = confirmUserAccountSchema.safeParse({
    token: data.token,
  });

  if (!parsed.success)
    return {
      status: "error",
      message: "Token inválido",
    };

  const response = await fetch(`${process.env.API_URL}/auth/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: data.token }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => {});

    return {
      status: "error",
      message: data.message ?? "Token inválido",
    };
  }

  return { status: "success" };
}
