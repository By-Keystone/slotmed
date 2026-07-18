import z from "zod";
import { getClient } from "@/infrastructure/postgres/transaction-context";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { UnprocessableEntity } from "@/application/errors/unprocessable-entity.errors";

export const createSpecialtyBodySchema = z.object({
  name: z.string({ error: "Specialty name is required" }),
});

export const createSpecialtyParamsSchema = z.object({
  organizationId: z.string(),
});

export type CreateSpecialtyDto = z.infer<typeof createSpecialtyBodySchema> &
  z.infer<typeof createSpecialtyParamsSchema>;

export class CreateSpecialtyUseCase {
  constructor() { }

  async execute(dto: CreateSpecialtyDto) {
    try {
      const client = getClient();

      await client.specialty.create({ data: dto });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new UnprocessableEntity("Ya existe esa especialidad");
      }

      throw error;
    }
  }
}
