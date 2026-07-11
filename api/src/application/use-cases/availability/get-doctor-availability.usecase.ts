import { NotFound } from "@/application/errors/not-found.error";
import { getClient } from "@/infrastructure/postgres/transaction-context";
import z from "zod";

export const getDoctorAvailabilityParamsSchema = z.object({
  clinicId: z.string({ error: "Clinic ID must be defined" }),
});

export type GetDoctorAvailabilityDto = z.infer<
  typeof getDoctorAvailabilityParamsSchema
> & { userId: string };

export class GetDoctorAvailabilityUseCase {
  constructor() {}

  async execute(dto: GetDoctorAvailabilityDto) {
    const client = getClient();

    const membership = await client.userResourceMembership.findUnique({
      where: {
        userId_resourceId: { resourceId: dto.clinicId, userId: dto.userId },
        role: "DOCTOR",
      },
    });

    if (!membership) throw new NotFound("User is not a doctor on this clinic");

    const availabilities = await client.availability.findMany({
      where: {
        membershipId: membership.id,
      },
    });

    return { availabilities };
  }
}
