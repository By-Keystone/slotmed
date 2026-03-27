import {
  ClinicCreateArgs,
  ClinicFindManyArgs,
} from "../../../prisma/generated/models";
import db, { UniqueConstraintValidationError } from "../db";
import { PrismaClientKnownRequestError } from "../../../prisma/generated/internal/prismaNamespace";
import { Prisma } from "../../../prisma/generated/client";

export async function createClinic(args: ClinicCreateArgs) {
  try {
    const res = await db.clinic.create(args);

    return res.id;
  } catch (error) {
    // No unique constraints for clinic table for the moment
    throw error;
  }
}

export async function findClinicByUserId(args: ClinicFindManyArgs) {
  try {
    const res = await db.clinic.findMany(args);

    if (res.length > 0) return res[0];
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(
        "Ha ocurrido un error al intentar obtener una clínica",
        error,
      );
      throw new Error("Ha ocurrido un error al intentar obtener una clínica");
    } else {
      console.error("Ha ocurrido un error en el servidor: ", error);
      throw new Error("Ha ocurrido un error en el servidor");
    }
  }
}
