import type { User } from "@prisma/client";

export interface CreateUserData {
  email: string;
  name: string;
  lastName: string;
  phone: string;
  passwordHash: string;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User>;
}
