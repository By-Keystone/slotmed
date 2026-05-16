import { IOrganizationRepository } from "@/domain/repositories/organization.repository";
import { IUserRepository } from "@/domain/repositories/user.repository";
import z from "zod";

export const createOrganizationSchema = z.object({
  name: z.string("Name is required"),
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema> & {
  userId: string;
  accountId: string;
};

export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: CreateOrganizationDto, isOnboarding: boolean = false) {
    const organization = await this.organizationRepository.save(data);

    if (organization && isOnboarding) {
      await this.userRepository.update(data.userId, {
        onboardingCompleted: true,
      });
    }
  }
}
