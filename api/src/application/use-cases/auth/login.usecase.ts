import bcrypt from "bcrypt";
import { z } from "zod";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import { FinalizeAuth } from "./_shared/finalize-auth";
import type { LoginResult } from "./_shared/login-result";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginDto = z.infer<typeof loginSchema>;

export class LoginUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly finalize: FinalizeAuth,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError("Email o contraseña incorrectos");
    }

    if (!user.confirmed) {
      throw new ForbiddenError("El correo no está confirmado");
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Email o contraseña incorrectos");
    }

    return this.finalize.forUser(user);
  }
}

export class UnauthorizedError extends Error {
  readonly statusCode = 401;
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  readonly statusCode = 403;
  constructor(message: string) {
    super(message);
  }
}
