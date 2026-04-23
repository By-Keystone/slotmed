import type { User } from "@prisma/client";
import type {
  CreateUserData,
  IUserRepository,
} from "../../domain/repositories/user.repository.js";
import { prisma } from "./client.js";

export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }
}
