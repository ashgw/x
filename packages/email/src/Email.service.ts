import * as React from "react";
import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import { render } from "@react-email/render";
import { notifyEmail } from "@ashgw/constants";
import NotificationTemplate from "./templates/Notify";
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
      // eslint-disable-next-line no-restricted-syntax
      console.debug(error);
      throw new Error(error.message); // TODO: use internal error here, matter of fact, refactor sentry & logger & InternalError
    }

    return { id: data.id };
  }

  async sendNotification({
    to,
    title,
    message,
    type,
    subject,
  }: SendNotificationParams): Promise<SendResult> {
    const element = React.createElement(NotificationTemplate, {
      title,
      type,
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
