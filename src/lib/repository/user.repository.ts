import { Prisma } from "../../../prisma/generated/client";
import {
  UserCreateArgs,
  UserFindFirstOrThrowArgs,
} from "../../../prisma/generated/models";
import db, {
  RecordNotFoundError,
  UniqueConstraintValidationError,
} from "../db";

export async function createUser(args: UserCreateArgs) {
  try {
    return await db.user.create(args);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === UniqueConstraintValidationError) {
        throw new Error(
          "Ya existe un usuario con el correo o número de teléfono",
        );
      } else throw new Error("Ha ocurrido un error al guardar el usuario");
    } else throw new Error("Ha ocurrido un error en el servidor");
  }
}

export async function findUserByAuthId(args: UserFindFirstOrThrowArgs) {
  try {
    return await db.user.findFirstOrThrow(args);
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      if (error.code === RecordNotFoundError)
        throw new Error("No se ha encontrado el usuario");
      else throw new Error("Ha ocurrido un error al buscar usuario");
    else throw new Error("Ha ocurrido un error en el servidor");
  }
}
