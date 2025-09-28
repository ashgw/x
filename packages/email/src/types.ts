export type OneOrMany<T> = T | T[];

export enum NotificationType {
  PERSONAL = "PERSONAL",
  SERVICE = "SERVICE",
  REMINDER = "REMINDER",
}

export interface SendParams {
  from?: string;
  to: OneOrMany<string>;
  subject: string;
  html: string;
  cc?: OneOrMany<string>;
  bcc?: OneOrMany<string>;
}

export interface SendResult {
  id: string;
}

export interface SendNotificationParams {
  to: OneOrMany<string>;
  title: string;
  message: string;
  type: NotificationType;
  subject?: string;
}

export type Recipient = OneOrMany<string>;
