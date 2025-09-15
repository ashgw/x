import { env } from "@ashgw/env";
import { NotificationType } from "./types";
import { emailService } from "./Email.service";

await emailService.sendNotification({
  subject: "Deployment Complete",
  title: "All Systems Go",
  type: NotificationType.SERVICE,
  message:
    "Your latest build was deployed successfully at 2025-09-15 01:00 UTC. No errors were detected and the service is healthy.",
  to: env.PERSONAL_EMAIL,
});
