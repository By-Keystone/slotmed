import { Clinic } from "@/domain/entities/clinic/entity";
import { Clinic as PrismaClinic } from "@prisma/client";

export function toDomain(clinic: PrismaClinic): Clinic {
  return clinic;
}
