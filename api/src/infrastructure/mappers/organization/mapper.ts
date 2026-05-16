import { Organization } from "@/domain/entities/organization/entity";
import { Organization as PrismaOrganization } from "@prisma/client";

export function toDomain(organization: PrismaOrganization): Organization { 
    return organization;
}