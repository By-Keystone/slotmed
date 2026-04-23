import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-500">Página no encontrada</p>
      <Link href="/" className="mt-4 text-blue-600 hover:text-blue-700">
        Volver al inicio
      </Link>
    </div>
  );
}
