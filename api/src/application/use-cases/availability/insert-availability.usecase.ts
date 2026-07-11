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

      const membership = await client.userResourceMembership.findUnique({
        where: {
          userId_resourceId: {
            userId: dto.userId,
            resourceId: dto.clinicId,
          },
        },
      });

      if (!membership) throw new NotFound("User is not a doctor on the clinic");

      await client.availability.deleteMany({
        where: {
          membershipId: membership.id,
        },
      });

      await client.availability.createMany({
        data: dto.availabilities.map((availability) => ({
          membershipId: membership.id,
          ...availability,
        })),
      });
    });
  }
}
