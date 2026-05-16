import { IClinicRepository } from "@/domain/repositories/clinic.repository";
import z from "zod";

export const createClinicSchema = z.object({
  name: z.string("Name is required"),
  phone: z.string(),
  address: z.string(),
  organizationId: z.string(),
});

export type CreateClinicDto = z.infer<typeof createClinicSchema> & {
  accountId: string;
  createdBy: string;
};

export class CreateClinicUseCase {
  constructor(private readonly clinicRepository: IClinicRepository) {}

  async execute(dto: CreateClinicDto) {
    await this.clinicRepository.save(dto);
  }
}
