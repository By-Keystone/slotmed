import { NotFound } from "@/application/errors/not-found.error";
import {
  getClient,
  inTransaction,
} from "@/infrastructure/postgres/transaction-context";
import z from "zod";

export const insertAvailabilityParamsSchema = z.object({
  clinicId: z.string({ error: "Clinic ID must be defined" }),
});

export const insertAvailabilityBodySchema = z.object({
  availabilities: z.array(
    z.object({
      dayOfWeek: z
        .number()
        .min(0, { error: "dayOfWeek must be greater than 0" })
        .max(6, { error: "dayOfWeek must be less than 7" }),
      startTime: z.string({ error: "startTime must be a string" }),
      endTime: z.string({ error: "endTime must be a string" }),
    }),
  ),
});

export type InsertAvailabilityDto = z.infer<
  typeof insertAvailabilityParamsSchema
> & {
  userId: string;
} & z.infer<typeof insertAvailabilityBodySchema>;

export class InsertAvailabilityUseCase {
  constructor() {}

  async execute(dto: InsertAvailabilityDto) {
    await inTransaction(async () => {
      const client = getClient();

      const doctorProfile = await client.doctorProfile.findUnique({
        where: {
          userId_clinicId: {
            userId: dto.userId,
            clinicId: dto.clinicId,
          },
        },
      });

      if (!doctorProfile)
        throw new NotFound("User is not a doctor on the clinic");

      await client.availability.deleteMany({
        where: {
          doctorProfileId: doctorProfile.id,
        },
      });

      await client.availability.createMany({
        data: dto.availabilities.map((availability) => ({
          doctorProfileId: doctorProfile.id,
          ...availability,
        })),
      });
    });
  }
}
