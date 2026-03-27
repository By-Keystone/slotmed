import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/generated/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") globalForPrisma.prisma = db;

export default db;

export const UniqueConstraintValidationError = "P2002" as const;
export const RecordNotFoundError = "P2025" as const;
