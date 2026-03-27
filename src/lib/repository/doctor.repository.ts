import {
  DoctorCreateInput,
  UserCreateInput,
} from "../../../prisma/generated/models";
import db, { RecordNotFoundError } from "../db";
import { PrismaClientKnownRequestError } from "../../../prisma/generated/internal/prismaNamespace";
import { Prisma } from "../../../prisma/generated/client";

export async function insertDoctor(
  args: Omit<DoctorCreateInput, "user"> & UserCreateInput,
) {
  try {
    const { specialty, clinic, ...rest } = args;

    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: rest,
        select: { id: true, email: true },
      });

      await tx.doctor.create({
        data: {
          specialty,
          user: { connect: { id: user.id } },
          clinic,
        },
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDoctorByUserId(
  userId: number,
): Promise<Prisma.DoctorGetPayload<{ include: { schedules: true } }>> {
  try {
    const doctor = await db.doctor.findFirstOrThrow({
      where: { user_id: userId },
      include: { schedules: true },
    });

    return doctor;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === RecordNotFoundError)
        throw Error("No se ha encontrado el doctor");
      else {
        console.error("Ha ocurrido un error al buscar al doctor", error);
        throw new Error("Ha ocurrido un error al buscar al doctor");
      }
    }
    console.error("Ha ocurrido un error en el servidor: ", error);
    throw new Error("Ha ocurrido un error en el servidor");
  }
}
