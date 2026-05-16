import { Doctor } from "@/domain/entities/doctor/entity";
import { IDoctorRepository } from "@/domain/repositories/doctor.repository";
import { getClient } from "../transaction-context";
import { toDomain } from "../../mappers/doctor/mapper";

export class DoctorRepository implements IDoctorRepository {
  async getByUserId(userId: string): Promise<Doctor | null> {
    const doctor = await getClient().doctor.findFirst({ where: { userId } });

    if (!doctor) return null;

    return toDomain(doctor);
  }
}
