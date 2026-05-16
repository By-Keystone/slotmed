import { ApplicationError } from "@/application/errors/application.errors";
import { BadRequest } from "@/application/errors/bad-request.errors";
import { NotFound } from "@/application/errors/not-found.error";
import { UnauthorizedError } from "@/application/errors/unauthorized.error";
import { UnknownError } from "@/application/errors/unknown";
import { IUserRepository } from "@/domain/repositories/user.repository";
import { errors, jwtVerify } from "jose";
import z from "zod";

export const confirmUserSchema = z.object({
  token: z.string({ error: "Confirm token is required" }),
});

export type ConfirmUserDto = z.infer<typeof confirmUserSchema>;

interface ConfirmUserCaseConfig {
  jwtSecret: string;
}

export class ConfirmUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly config: ConfirmUserCaseConfig,
  ) {}

  async execute(dto: ConfirmUserDto) {
    try {
      const secret = new TextEncoder().encode(this.config.jwtSecret);

      const { payload } = await jwtVerify(dto.token, secret);

      if (
        payload.type !== "confirm-email" ||
        typeof payload.userId !== "string"
      ) {
        throw new UnauthorizedError("User not authorized");
      }

      const userId = payload.userId;

      const user = await this.userRepository.findById(userId);

      if (!user) throw new NotFound("User does not exist");

      if (user.confirmed) return true;

      await this.userRepository.update(userId, { confirmed: true });

      return true;
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      else if (error instanceof errors.JWTInvalid)
        throw new BadRequest("Invalid JWT");
      else if (error instanceof errors.JWTExpired)
        throw new UnauthorizedError("JWT expired");

      console.info("Error confirming user:", error);
      throw new UnknownError("An error occurred while confirming user");
    }
  }
}
