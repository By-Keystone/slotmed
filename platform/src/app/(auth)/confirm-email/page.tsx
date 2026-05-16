import { redirect } from "next/navigation";
import { ConfirmRedirect } from "./confirm-redirect";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { confirmAccountAction } from "./actions";

export default async function ConfirmAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) redirect("/login");

  const result = await confirmAccountAction({ token });

  if (result.status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ConfirmRedirect message="¡Tu cuenta ha sido confirmada exitosamente!" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <XCircle className="h-12 w-12 text-red-500" />
      <p className="text-gray-800 font-medium">Token inválido o expirado.</p>
      <Link
        href="/register"
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        Volver al registro
      </Link>
    </div>
  );
}
