import { createUser } from "@/lib/repository/user.repository";
import { UserCreateInput } from "../../../../prisma/generated/models";
import { User } from "../../../../prisma/generated/client";

export async function createDoctorUser({
  name,
  lastName,
  email,
  phone,
  authId,
}: {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  authId: string;
}): Promise<Pick<User, "id" | "email">> {
  const doctorUser: UserCreateInput = {
    name: name,
    last_name: lastName,
    email: email,
    phone: phone,
    auth_id: authId,
  };

  const res = await createUser({
    data: doctorUser,
    select: { id: true, email: true },
  });

  return res;
}
