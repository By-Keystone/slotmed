import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "WizyDoc — Gestión de citas médicas",
  description:
    "WizyDoc ayuda a sedes médicas a gestionar citas, definir horarios y confirmar asistencias por WhatsApp. Sin complicaciones.",
  keywords: ["citas médicas", "sede médica", "agenda médica", "WhatsApp", "gestión de citas"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
