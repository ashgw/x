type OneOrMany<T> = T | T[];

export interface SendParams {
  from: string;
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
  subject?: string;
}
