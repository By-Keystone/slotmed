import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { z } from "zod";

import type { IEmailService } from "@/application/ports/email-service.port";
import { UserRole } from "@/domain/enums/user-role";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import { renderTemplate } from "@/infrastructure/services/email-service/template-renderer";

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  password: z.string().min(8),
});

export type RegisterUserDto = z.infer<typeof registerSchema>;

interface RegisterUseCaseConfig {
  jwtSecret: string;
  frontendUrl: string;
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private config: RegisterUseCaseConfig,
  ) {}

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

    const confirmationToken = await new SignJWT({
      userId: user.id,
      type: "confirm-email",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(this.config.jwtSecret));

    const confirmUrl = `${this.config.frontendUrl}/confirm-email?token=${confirmationToken}`;

    const html = await renderTemplate("confirm-email", {
      name: user.name,
      confirmUrl,
    });

    await this.emailService.send({
      to: user.email,
      subject: "Confirma tu correo en WizyDoc",
      html,
    });

    return { id: user.id, email: user.email };
  }
}

export class ConflictError extends Error {
  readonly statusCode = 409;
  constructor(message: string) {
    super(message);
  }
}
