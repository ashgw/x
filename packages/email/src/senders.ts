import * as React from "react";
import { render } from "@react-email/render";
import { emailService } from "./email.service";
import type { Recipient, NotificationType } from "./types";

// Templates
import VerifyEmailTemplate from "./templates/auth/VerifyEmail";
import ResetPasswordTemplate from "./templates/auth/ResetPassword";
import EmailIsVerifiedTemplate from "./templates/auth/EmailIsVerified";
import ChangeEmailConfirmTemplate from "./templates/auth/ChangeEmailConfirm";
import SignInAlertTemplate from "./templates/auth/SignInAlert";
import PasswordChangedTemplate from "./templates/auth/PasswordChanged.tsx";
import AccountDeletionRequestedTemplate from "./templates/auth/AccountDeletionRequested";
import AccountDeletedTemplate from "./templates/auth/AccountDeleted";
import NotifyTemplate from "./templates/notification/Notify";
import type { EmailService } from "./email.service";

// ===== Param types (exported for app code) =====
export interface VerifyEmailParams {
  readonly to: Recipient;
  readonly verifyUrl: string;
  readonly userName?: string;
}

export interface AfterVerificationParams {
  readonly to: Recipient;
  readonly userName?: string;
}

export interface ResetPasswordParams {
  readonly to: Recipient;
  readonly resetUrl: string;
  readonly userName?: string;
}

export interface ChangeEmailConfirmParams {
  readonly to: Recipient;
  readonly confirmUrl: string;
}

export interface SignInAlertParams {
  readonly to: Recipient;
  readonly userName?: string;
  readonly ip?: string;
  readonly ua?: string;
  readonly time?: string;
}

export interface PasswordChangedParams {
  readonly to: Recipient;
  readonly userName?: string;
  readonly time?: string;
}

export interface AccountDeletionRequestedParams {
  readonly to: Recipient;
  readonly userName?: string;
  readonly confirmUrl: string;
  readonly cancelUrl: string;
}

export interface AccountDeletedParams {
  readonly to: Recipient;
  readonly userName?: string;
  readonly time?: string;
}

export interface NotificationParams {
  readonly to: Recipient;
  readonly title: string;
  readonly messageMd: string;
  readonly type: NotificationType;
  readonly subject?: string;
}

// ===== EmailSenders with grouped namespaces =====
export class EmailSenders {
  constructor(private readonly svc: EmailService) {}

  public readonly auth = {
    verifyEmail: async (params: VerifyEmailParams) => {
      const html = await render(
        React.createElement(VerifyEmailTemplate, params),
        { pretty: true },
      );
      return this.svc.sendHtml({
        to: params.to,
        subject: "Verify your email",
        html,
      });
    },

    afterVerification: async (params: AfterVerificationParams) => {
      const html = await render(
        React.createElement(EmailIsVerifiedTemplate, params),
        { pretty: true },
      );
      return this.svc.sendHtml({ to: params.to, subject: "Welcome", html });
    },

    resetPassword: async (params: ResetPasswordParams) => {
      const html = await render(
        React.createElement(ResetPasswordTemplate, params),
        { pretty: true },
      );
      return this.svc.sendHtml({
        to: params.to,
        subject: "Reset your password",
        html,
      });
    },

    changeEmailConfirm: async (params: ChangeEmailConfirmParams) => {
      const html = await render(
        React.createElement(ChangeEmailConfirmTemplate, params),
        { pretty: true },
      );
      return this.svc.sendHtml({
        to: params.to,
        subject: "Confirm email change",
        html,
      });
    },

    signInAlert: async (params: SignInAlertParams) => {
      const html = await render(
        React.createElement(SignInAlertTemplate, params),
        { pretty: true },
      );
      return this.svc.sendHtml({ to: params.to, subject: "New sign in", html });
    },

    passwordChanged: async (params: PasswordChangedParams) => {
      const html = await render(
        React.createElement(PasswordChangedTemplate, params),
        { pretty: true },
      );
      return this.svc.sendHtml({
        to: params.to,
        subject: "Your password was changed",
        html,
      });
    },

    accountDeletionRequested: async (
      params: AccountDeletionRequestedParams,
    ) => {
      const html = await render(
        React.createElement(AccountDeletionRequestedTemplate, params),
        { pretty: true },
      );
      return this.svc.sendHtml({
        to: params.to,
        subject: "Confirm account deletion",
        html,
      });
    },

    accountDeleted: async (params: AccountDeletedParams) => {
      const html = await render(
        React.createElement(AccountDeletedTemplate, params),
        { pretty: true },
      );
      return this.svc.sendHtml({
        to: params.to,
        subject: "Your account has been deleted",
        html,
      });
    },
  };

  public readonly notify = {
    notification: async (params: NotificationParams) => {
      const html = await render(
        React.createElement(NotifyTemplate, {
          messageMd: params.messageMd,
          type: params.type,
        }),
        { pretty: true },
      );
      return this.svc.sendHtml({
        to: params.to,
        subject: params.subject ?? params.title,
        html,
      });
    },
  };
}

// Instance plus ergonomic alias
export const email = new EmailSenders(emailService);
export const send = email; // usage: send.auth.verifyEmail(...)
export const emailInstance = email; // optional alias
