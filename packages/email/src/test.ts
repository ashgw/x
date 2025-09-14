import { emailService } from ".";
import { env } from "@ashgw/env";

await emailService.sendNotification({
  subject: "Service Confirmation",
  title: "Request Completed",
  message:
    "Your recent request has been completed successfully. This is an automated notification — please do not reply.",
  to: env.PERSONAL_EMAIL,
});
