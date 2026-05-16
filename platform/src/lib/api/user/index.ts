import { Me } from "@/lib/auth/me";
import { AuthExpiredError } from "../errors";
import { doFetch } from "../fetch";

export const usersApi = {
  getMe: async () => {
    const res = await doFetch("/user/me");

    if (!res.ok && res.status === 401)
      throw new AuthExpiredError("Su sesión ha expirado");
    else if (!res.ok)
      throw new Error("Ocurrió un error al obtener el perfil del usuario");

    const me: Me = await res.json();

    return me;
  },
  getProfile: async () => doFetch("/user/me/profile"),
};
