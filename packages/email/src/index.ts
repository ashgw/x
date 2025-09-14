import * as React from "react";
import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import { render } from "@react-email/render";
// import { InternalError } from "@ashgw/observability";
import { notifyEmail } from "@ashgw/constants";
import PersonalNotification from "./templates/Notify";
import { env } from "@ashgw/env";
import type { SendParams, SendResult, SendNotificationParams } from "./types";

export class EmailService {
  private readonly from = notifyEmail;

  public async send({
    from,
    to,
    subject,
    html,
    cc,
    bcc,
  }: SendParams): Promise<SendResult> {
    const client = this._client();
    const options: CreateEmailOptions = {
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    };
    if (cc) options.cc = Array.isArray(cc) ? cc : [cc];
    if (bcc) options.bcc = Array.isArray(bcc) ? bcc : [bcc];

    const { data, error } = await client.emails.send(options);

    if (error) {
      const msg = EmailService._isResendErr(error)
        ? `[${error.statusCode ?? "?"}] ${error.name}: ${error.message}`
        : "Resend failed";
      throw new Error(msg);
    }
    if (!data.id) throw new Error("Resend returned no id.");
    return { id: data.id };
  }

  async sendNotification({
    to,
    title,
    message,
    subject,
  }: SendNotificationParams): Promise<SendResult> {
    const element = React.createElement(PersonalNotification, {
      title,
      message,
    });

    const html = await render(element, { pretty: true });

    return this.send({
      from: this.from,
      to,
      subject: subject ?? title,
      html,
    });
  }

  private _client(): Resend {
    return new Resend(env.RESEND_API_KEY);
  }

  private static _isResendErr(
    x: unknown,
  ): x is { message: string; name?: string; statusCode?: number } {
    if (typeof x !== "object" || x === null) return false;
    const rec = x as Record<string, unknown>;
    return typeof rec.message === "string";
  }
}

export const emailService = new EmailService();
