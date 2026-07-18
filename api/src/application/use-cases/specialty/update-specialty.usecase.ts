import { NotFound } from "@/application/errors/not-found.error";
import { getClient } from "@/infrastructure/postgres/transaction-context";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import z from "zod";

export const updateSpecialtyBodySchema = z.object({
    name: z.string().optional()
})

export const updateSpecialtyParamsSchema = z.object({
    organizationId: z.string(),
    specialtyId: z.string()
})

export type UpdateSpecialtyDto = z.infer<typeof updateSpecialtyBodySchema> & Pick<z.infer<typeof updateSpecialtyParamsSchema>, 'specialtyId'>;

export class UpdateSpecialtyUseCase {
    constructor() { };

    async execute(dto: UpdateSpecialtyDto) {
        try {
            const client = getClient();

            const { specialtyId: id, ...updateData } = dto;

            await client.specialty.update({ where: { id }, data: updateData })

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
                throw new NotFound("Specialty not found");
            }
            throw error;
        }
    }
}