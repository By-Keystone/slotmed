"use client";

import { useAuth } from "@/context/auth/auth.context";

export function Welcome() {
  const { user } = useAuth();

  const name = user.name ?? user.email;

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Hola, {name} 👋</h1>
      <p className="mt-1 text-sm text-gray-500">
        Bienvenido a tu panel de SlotMed
      </p>
    </div>
  );
}
