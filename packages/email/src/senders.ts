import * as React from "react";
import { render } from "@react-email/render";
import { emailService } from "./email.service";
import type { Recipient } from "./types";

import VerifyEmailTemplate from "./templates/auth/VerifyEmail";
import ResetPasswordTemplate from "./templates/auth/ResetPassword";
import EmailIsVerifiedTemplate from "./templates/auth/EmailIsVerified";
import AccountDeletedTemplate from "./templates/auth/AccountDeleted";

export interface VerifyEmailParams {
  readonly to: Recipient;
  readonly verifyUrl: string;
  readonly userName?: string;
}
export interface EmailIsVerifiedParams {
  readonly to: Recipient;
  readonly userName?: string;
}
export interface ResetPasswordParams {
  readonly to: Recipient;
  readonly resetUrl: string;
  readonly userName?: string;
}
export interface AccountDeletedParams {
  readonly to: Recipient;
  readonly userName?: string;
  readonly time?: string;
}

/** Minimal senders for the exact flows you wired in BetterAuth */
export class EmailSenders {
  public readonly auth = {
    verifyEmail: async (params: VerifyEmailParams) => {
      const html = await render(
        React.createElement(VerifyEmailTemplate, params),
        { pretty: true },
      );
      return emailService.sendHtml({
        to: params.to,
        subject: "Verify your email",
        html,
      });
    },

    afterVerification: async (params: EmailIsVerifiedParams) => {
      const html = await render(
        React.createElement(EmailIsVerifiedTemplate, params),
        { pretty: true },
      );
      return emailService.sendHtml({
        to: params.to,
        subject: "Email verified",
        html,
      });
    },

    resetPassword: async (params: ResetPasswordParams) => {
      const html = await render(
        React.createElement(ResetPasswordTemplate, params),
        { pretty: true },
      );
      return emailService.sendHtml({
        to: params.to,
        subject: "Reset your password",
        html,
      });
    },

    accountDeleted: async (params: AccountDeletedParams) => {
      const html = await render(
        React.createElement(AccountDeletedTemplate, params),
        { pretty: true },
      );
      return emailService.sendHtml({
        to: params.to,
        subject: "Your account has been deleted",
        html,
      });
    },
  };

  // Flat methods that your BetterAuth config calls
  public sendVerifyEmail = (p: VerifyEmailParams) => this.auth.verifyEmail(p);
  public sendEmailIsVerified = (p: EmailIsVerifiedParams) =>
    this.auth.afterVerification(p);
  public sendResetPassword = (p: ResetPasswordParams) =>
    this.auth.resetPassword(p);
  public sendAccountDeleted = (p: AccountDeletedParams) =>
    this.auth.accountDeleted(p);
}

export const email = new EmailSenders();

export const sendVerifyEmail = (p: VerifyEmailParams) =>
  email.sendVerifyEmail(p);
export const sendEmailIsVerified = (p: EmailIsVerifiedParams) =>
  email.sendEmailIsVerified(p);
export const sendResetPassword = (p: ResetPasswordParams) =>
  email.sendResetPassword(p);
export const sendAccountDeleted = (p: AccountDeletedParams) =>
  email.sendAccountDeleted(p);
