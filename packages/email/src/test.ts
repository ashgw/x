import { emailService } from ".";
import { env } from "@ashgw/env";

await emailService.sendNotification({
  subject: "Deployment Complete",
  title: "All Systems Go",
  message:
    "Your latest build was deployed successfully at 2025-09-15 01:00 UTC. No errors were detected and the service is healthy.",
  to: env.PERSONAL_EMAIL,
});
