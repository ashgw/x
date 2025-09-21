import * as React from "react";
import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import { render } from "@react-email/render";
import { AppError } from "@ashgw/error";
import { logger } from "@ashgw/logger";
import NotificationTemplate from "./templates/Notify";
import { env } from "@ashgw/env";
import type { SendParams, SendResult, SendNotificationParams } from "./types";

class EmailService {
  private _notifyEmail = "no-reply@notify.ashgw.me";
  private _cached?: Resend;
  public get notifyEmail(): string {
    return this._notifyEmail;
  }

  public set notifyEmail(value: string) {
    this._notifyEmail = value;
  }

  private get from(): string {
    return `ashgw[bot] <${this._notifyEmail}>`;
  }

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
      logger.error("Failed to send email", error);
      throw new AppError({
        code: "INTERNAL",
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
    type,
    subject,
  }: SendNotificationParams): Promise<SendResult> {
    const element = React.createElement(NotificationTemplate, {
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
    if (!this._cached) this._cached = new Resend(env.RESEND_API_KEY);
    return this._cached;
  }
}

export const email = new EmailService();
