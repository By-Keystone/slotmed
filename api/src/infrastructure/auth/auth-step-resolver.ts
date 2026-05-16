import type { User } from "@/domain/entities/user/entity";
import type { AuthStep } from "@/domain/auth/auth-step";
import type { IAuthStepResolver } from "@/domain/services/auth-step-resolver";

type StepCheck = (user: User) => AuthStep | null;

const STEP_ORDER: StepCheck[] = [
  (user) => (!user.onboardingCompleted ? { kind: "needs_account" } : null),
];

export class AuthStepResolver implements IAuthStepResolver {
  resolve(user: User): AuthStep {
    for (const check of STEP_ORDER) {
      const step = check(user);
      if (step) return step;
    }
    return { kind: "ready" };
  }
}
