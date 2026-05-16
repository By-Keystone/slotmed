"use server";

import z from "zod";

const registerSchema = z.object({
  name: z.string("Name is required"),
  lastName: z.string("Last name is required"),
  email: z.email("Email is required and has to be a valid email"),
  phone: z.string("Phone is required"),
  password: z.string("Password is required"),
});

export type RegisterState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<
        Record<
          keyof z.infer<typeof registerSchema>,
          { errors: string[] } | undefined
        >
      >;
    }
  | {
      status: "success";
    };

export async function registerAction(
  _prevState: any,
  data: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: data.get("name"),
    lastName: data.get("lastName"),
    email: data.get("email"),
    phone: data.get("phone"),
    password: data.get("password"),
  });

  if (!parsed.success)
    return {
      status: "error",
      message: "Datos inválidos",
      fieldErrors: z.treeifyError(parsed.error).properties,
    };

  const response = await fetch(`${process.env.API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsed.data),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => {});

    return {
      status: "error",
      message: data.message ?? "Datos inválidos",
    };
  }

  return {
    status: "success",
  };
}
