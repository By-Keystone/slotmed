import {
  SedeCreateArgs,
  SedeFindManyArgs,
} from "../../../prisma/generated/models";
import db from "../db";
import { Prisma } from "../../../prisma/generated/client";

export async function createSede(args: SedeCreateArgs) {
  try {
    const res = await db.sede.create(args);
    return res.id;
  } catch (error) {
    throw error;
  }
}

export async function findSedeWithDetailsByUserId(userId: number) {
  return db.sede.findFirst({
    where: { contacts: { some: { user_id: userId } } },
  });
}

export async function updateSede(
  sedeId: number,
  data: { name: string; address?: string },
) {
  return db.sede.update({ where: { id: sedeId }, data });
}

export async function findSedeByUserId(args: SedeFindManyArgs) {
  try {
    const res = await db.sede.findMany(args);
    if (res.length > 0) return res[0];
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Ha ocurrido un error al intentar obtener una sede", error);
      throw new Error("Ha ocurrido un error al intentar obtener una sede");
    } else {
      console.error("Ha ocurrido un error en el servidor: ", error);
      throw new Error("Ha ocurrido un error en el servidor");
    }
  }
}
