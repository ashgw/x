import * as React from "react";
import { render } from "@react-email/render";
import { emailService } from "./email.service";
import type { Recipient, NotificationType } from "./types";

import VerifyEmailTemplate from "./templates/VerifyEmail";
import ResetPasswordTemplate from "./templates/ResetPassword";
import WelcomeTemplate from "./templates/Welcome";
import MagicLinkTemplate from "./templates/MagicLink";
import ChangeEmailConfirmTemplate from "./templates/ChangeEmailConfirm";
import SignInAlertTemplate from "./templates/SignInAlert";
import DigestTemplate from "./templates/Digest";
import type { DigestItem } from "./templates/Digest";

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

export async function sendMagicLink(params: {
  readonly to: Recipient;
  readonly magicUrl: string;
  readonly userName?: string;
}) {
  const html = await render(React.createElement(MagicLinkTemplate, params), {
    pretty: true,
  });
  return emailService.sendHtml({
    to: params.to,
    subject: "Sign in link",
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

export async function sendDigest(params: {
  readonly to: Recipient;
  readonly title: string;
  readonly intro?: string;
  readonly items: readonly DigestItem[];
}) {
  const tmplProps: {
    title: string;
    intro?: string;
    items: readonly DigestItem[];
  } = {
    title: params.title,
    intro: params.intro,
    items: params.items,
  };
  const html = await render(React.createElement(DigestTemplate, tmplProps), {
    pretty: true,
  });
  return emailService.sendHtml({ to: params.to, subject: params.title, html });
}

export async function sendNotification(params: {
  readonly to: Recipient;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationType;
  readonly subject?: string;
}) {
  const html = await render(
    React.createElement((await import("./templates/Notify")).default, {
      message: params.message,
      type: params.type,
    }),
    { pretty: true },
  );
  return emailService.sendHtml({
    to: params.to,
    subject: params.subject ?? params.title,
    html,
  });
}
