import { IClinicRepository } from "@/domain/repositories/clinic.repository";

export class GetClinicsUseCase {
  constructor(private readonly clinicRepository: IClinicRepository) {}

  async execute() {
    return await this.clinicRepository.get();
  }
}
