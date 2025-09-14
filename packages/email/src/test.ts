import { emailService } from ".";
import { env } from "@ashgw/env";

await emailService.sendNotification({
  subject: "Just a Quick Note",
  title: "Hey, it worked",
  message:
    "This is just a test message to confirm things are running fine on my end. No reply is needed, it's only for me.",
  to: env.PERSONAL_EMAIL,
});
