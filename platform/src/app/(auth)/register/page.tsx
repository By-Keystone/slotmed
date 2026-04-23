"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { register } from "@/lib/actions/auth";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(register, null);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok !== true) return;

    if (countdown <= 0) {
      router.replace("/login");
      return;
    }

    const timeout = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [state?.ok, countdown, router]);

  if (state?.ok === true)
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-7 w-7 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Revisa tu correo</h2>
          <p className="mt-2 text-sm text-gray-500">
            Te enviamos un enlace de confirmación a tu correo electrónico. Haz
            click en el enlace para activar tu cuenta.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            Serás redirigido a{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              iniciar sesión
            </Link>{" "}
            en {countdown} segundos.
          </p>
        </div>
      </div>
    );
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-gray-500">
            Empieza gratis, sin tarjeta de crédito
          </p>
        </div>

        <form className="flex flex-col gap-4" action={action}>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="given-name"
                placeholder="Ana"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="lastname"
                className="text-sm font-medium text-gray-700"
              >
                Apellido
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                autoComplete="family-name"
                placeholder="García"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ana@consultorio.com"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Celular
            </label>
            <PhoneInput
              id="phone"
              name="phone"
              required
              placeholder="999 888 777"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {state?.ok === false && state?.message && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {state.message}
            </p>
          )}

          <Button type="submit" className="mt-2 w-full">
            {isPending ? "Creando cuenta" : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
