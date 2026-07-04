import type { UserRole } from "@/domain/enums/user-role";

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  confirmed: boolean;
  onboardingCompleted: boolean;
  accountId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
