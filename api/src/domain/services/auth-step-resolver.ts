import type { User } from "@/domain/entities/user/entity";
import type { AuthStep } from "@/domain/auth/auth-step";

export interface IAuthStepResolver {
  resolve(user: User): AuthStep;
}
