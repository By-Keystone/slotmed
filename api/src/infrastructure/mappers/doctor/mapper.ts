import { Doctor } from "@/domain/entities/doctor/entity";
import { Doctor as PrismaDoctor } from "@prisma/client";

export function toDomain(doctor: PrismaDoctor): Doctor { 
    return doctor;
}