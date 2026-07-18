import { getClient } from "@/infrastructure/postgres/transaction-context";
import z from "zod";

export const getSpecialtiesParamSchema = z.object({
    organizationId: z.string({ error: "Organization ID is required" })
})

export type GetSpecialtiesDto = z.infer<typeof getSpecialtiesParamSchema>;

export class GetSpecialtiesUseCase {
    constructor() { }

    async execute(dto: GetSpecialtiesDto) {
        const client = getClient()

        const specialties = await client.specialty.findMany({ where: { organizationId: dto.organizationId } })

        return specialties;
    }
}