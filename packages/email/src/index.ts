import * as React from "react";
import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import { render } from "@react-email/render";
import { InternalError } from "@ashgw/observability";
import { notifyEmail } from "@ashgw/constants";
import PersonalNotification from "./templates/Notify";
import { env } from "@ashgw/env";
import type { SendParams, SendResult, SendNotificationParams } from "./types";
export class EmailService {
  public readonly from = notifyEmail;
  public async send({
    from,
    to,
    subject,
    html,
    cc,
    bcc,
  }: SendParams): Promise<SendResult> {
    const client = this._client();

    const toList = Array.isArray(to) ? to : [to];
    const options: CreateEmailOptions = {
      from,
      to: toList,
      subject,
      html,
    };

    if (cc) options.cc = Array.isArray(cc) ? cc : [cc];
    if (bcc) options.bcc = Array.isArray(bcc) ? bcc : [bcc];

    const { data, error } = await client.emails.send(options);

    if (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send email",
        cause: error,
      });
    }

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
}

export const emailService = new EmailService();
