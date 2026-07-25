import { getClient } from "@/infrastructure/postgres/transaction-context";
import z, { ZodLazy } from "zod";

export const getUserByEmailQueryParamsSchema = z.object({
    email: z.string()
})

export type GetUserByEmailDto = z.infer<typeof getUserByEmailQueryParamsSchema>;

export class GetUserByEmailQuery {
    constructor() { }

    async execute(dto: GetUserByEmailDto) {
        const client = getClient();

        return await client.user.findUnique({ where: { email: dto.email } })
    }
}