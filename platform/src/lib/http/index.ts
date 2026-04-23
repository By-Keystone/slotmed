import { cookies } from "next/headers";
import { COOKIE_NAMES } from "../cognito/cookies";
import { MissingAuthToken } from "../errors";

export class HttpService {
  protected async validateAuthToken() {
    const cookieStore = await cookies();
    const idToken = cookieStore.get(COOKIE_NAMES.idToken);

    if (!idToken) throw new MissingAuthToken("Missing authentication token");

    return idToken.value;
  }
}
