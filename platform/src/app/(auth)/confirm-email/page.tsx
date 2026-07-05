import { MailCheck } from "lucide-react";
import Link from "next/link";

export default function ConfirmEmailPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <MailCheck className="h-7 w-7 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Revisa tu correo</h1>
        <p className="mt-2 text-sm text-gray-500">
          Te enviamos un enlace de confirmación. Haz clic en él para activar tu
          cuenta y continuar con la configuración.
        </p>
        <p className="mt-6 text-sm text-gray-500">
          ¿No lo recibiste? Revisa tu carpeta de spam, o{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            inicia sesión
          </Link>{" "}
          si ya confirmaste.
        </p>
      </div>
    </div>
  );
}
