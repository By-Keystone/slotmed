import bcrypt from "bcrypt";
import { z } from "zod";

import type { IUserRepository } from "../../domain/repositories/user.repository.js";

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  password: z.string().min(8),
});

export type RegisterUserDto = z.infer<typeof registerSchema>;

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: RegisterUserDto) {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError("El email ya está registrado");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.create({
      email: dto.email,
      name: dto.name,
      lastName: dto.lastName,
      phone: dto.phone,
      passwordHash,
    });

    // TODO: send confirmation email

    return { id: user.id, email: user.email };
  }
}

export class ConflictError extends Error {
  readonly statusCode = 409;
  constructor(message: string) {
    super(message);
  }
}
