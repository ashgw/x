import * as React from "react";
import { render } from "@react-email/render";
import { emailService } from "./email.service";
import type { Recipient, NotificationType } from "./types";

import VerifyEmailTemplate from "./templates/auth/VerifyEmail";
import ResetPasswordTemplate from "./templates/auth/ResetPassword";
import WelcomeTemplate from "./templates/auth/EmailIsVerified";
import ChangeEmailConfirmTemplate from "./templates/auth/ChangeEmailConfirm";
import SignInAlertTemplate from "./templates/auth/SignInAlert";

export async function sendVerifyEmail(params: {
  readonly to: Recipient;
  readonly verifyUrl: string;
  readonly userName?: string;
}) {
  const html = await render(React.createElement(VerifyEmailTemplate, params), {
    pretty: true,
  });
  return emailService.sendHtml({
    to: params.to,
    subject: "Verify your email",
    html,
  });
}

export async function sendAfterVerification(params: {
  readonly to: Recipient;
  readonly userName?: string;
}) {
  const html = await render(React.createElement(WelcomeTemplate, params), {
    pretty: true,
  });
  return emailService.sendHtml({ to: params.to, subject: "Welcome", html });
}

export async function sendResetPassword(params: {
  readonly to: Recipient;
  readonly resetUrl: string;
  readonly userName?: string;
}) {
  const html = await render(
    React.createElement(ResetPasswordTemplate, params),
    { pretty: true },
  );
  return emailService.sendHtml({
    to: params.to,
    subject: "Reset your password",
    html,
  });
}

export async function sendChangeEmailConfirm(params: {
  readonly to: Recipient;
  readonly confirmUrl: string;
}) {
  const html = await render(
    React.createElement(ChangeEmailConfirmTemplate, params),
    { pretty: true },
  );
  return emailService.sendHtml({
    to: params.to,
    subject: "Confirm email change",
    html,
  });
}

export async function sendSignInAlert(params: {
  readonly to: Recipient;
  readonly userName?: string;
  readonly ip?: string;
  readonly ua?: string;
  readonly time?: string;
}) {
  const html = await render(React.createElement(SignInAlertTemplate, params), {
    pretty: true,
  });
  return emailService.sendHtml({ to: params.to, subject: "New sign in", html });
}

export async function sendNotification(params: {
  readonly to: Recipient;
  readonly title: string;
  readonly messageMd: string;
  readonly type: NotificationType;
  readonly subject?: string;
}) {
  const html = await render(
    React.createElement(
      (await import("./templates/notification/Notify")).default,
      {
        messageMd: params.messageMd,
        type: params.type,
      },
    ),
    { pretty: true },
  );
  return emailService.sendHtml({
    to: params.to,
    subject: params.subject ?? params.title,
    html,
  });
}
