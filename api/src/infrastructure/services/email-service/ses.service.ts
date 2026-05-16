import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import type {
  IEmailService,
  SendEmailParams,
} from "@/application/ports/email-service.port";

interface SESEmailServiceConfig {
  region: string;
  from: string;
}

export class SESEmailService implements IEmailService {
  private readonly client: SESClient;
  private readonly from: string;

  constructor(config: SESEmailServiceConfig) {
    this.client = new SESClient({ region: config.region });
    this.from = config.from;
  }

  async send({ to, subject, html, text }: SendEmailParams): Promise<void> {
    const command = new SendEmailCommand({
      Source: this.from,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: html, Charset: "UTF-8" },
          ...(text && { Text: { Data: text, Charset: "UTF-8" } }),
        },
      },
    });

    await this.client.send(command);
  }
}
