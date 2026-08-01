/**
 * Punto único de acceso al sistema de toasts.
 *
 * Importa siempre desde aquí (`import { toast } from "@/lib/toast"`) en lugar de
 * hacerlo directamente de "sonner". Así podemos ajustar o reemplazar la librería
 * en un solo sitio sin tocar el resto del frontend.
 */
export { toast } from "sonner";
