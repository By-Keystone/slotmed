"use client";

import { createContext, useContext, ReactNode } from "react";
import type { JWTPayload } from "jose";
import { UserRole } from "@/lib/utils";

export type CognitoUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
};

type AuthContextType = {
  user: CognitoUser;
  isDoctor: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

function buildUser(session: JWTPayload): CognitoUser {
  return {
    id: (session["dynamo_id"] as string) ?? (session.sub as string),
    name: (session["name"] as string) ?? "",
    email: (session["email"] as string) ?? "",
    phone: (session["phone_number"] as string) ?? "",
    role: (session["custom:role"] as UserRole) ?? UserRole.ADMIN,
  };
}

export function AuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: JWTPayload;
}) {
  const user = buildUser(session);
  const isDoctor = user.role === UserRole.DOCTOR;

  return (
    <AuthContext.Provider value={{ user, isDoctor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
