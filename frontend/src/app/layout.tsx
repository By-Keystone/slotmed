import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "SlotMed — Gestión de citas médicas",
  description:
    "SlotMed ayuda a consultorios y clínicas a gestionar citas, definir horarios y confirmar asistencias por WhatsApp. Sin complicaciones.",
  keywords: ["citas médicas", "consultorio", "agenda médica", "WhatsApp", "gestión de citas"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
