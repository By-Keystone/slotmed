import { Unauthorized } from "@/lib/errors";
import { HttpService } from "..";

export class ClinicHttpService extends HttpService {
  constructor() {
    super();
  }

  async getClinicsByUserId() {
    const token = await this.validateAuthToken();

    const response = await fetch(`${process.env.API_URL}/clinic`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403)
      throw new Unauthorized("Unauthorized to make request");

    if (!response.ok) throw new Error("An error has occurred");

    const json = await response.json();

    return { response, json };
  }
}
