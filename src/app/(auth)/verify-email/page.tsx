import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md text-center">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <MailCheck className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Revisa tu correo</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Te enviamos un enlace de confirmación. Ábrelo para activar tu cuenta y
          comenzar a usar SlotMed.
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Si no lo ves, revisa tu carpeta de spam.
        </p>
        <Button variant="outline" className="mt-8 w-full" asChild>
          <Link href="/login">Volver a iniciar sesión</Link>
        </Button>
      </div>
    </div>
  );
}
