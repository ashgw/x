import { emailService } from ".";

await emailService.sendNotification({
  subject: "Deployment Notification",
  title: "Deployment Success",
  message:
    "The deployment has been successfully completed. It's deployed to production.",
  to: "oss@ashgw.me",
});
