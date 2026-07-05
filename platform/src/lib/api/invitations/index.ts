import "server-only";

const API_URL = process.env.API_URL;

/** Paso que el usuario debe seguir tras aceptar la invitación. */
export type InvitationStep = "set_password" | "login";

export interface InvitationDetails {
  name: string;
  resourceName: string;
}

/**
 * Obtiene los detalles de una invitación por su token. No requiere sesión: el
 * token es la credencial. Devuelve `null` si el token es inválido o expiró.
 */
export async function getInvitation(
  token: string,
): Promise<InvitationDetails | null> {
  try {
    const res = await fetch(`${API_URL}/invitations/${token}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as InvitationDetails;
  } catch {
    return null;
  }
}
