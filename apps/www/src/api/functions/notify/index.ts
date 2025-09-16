import { logger, monitor } from "@ashgw/observability";
import type { NotifyResponses } from "~/api/models";
import { email } from "@ashgw/email";
import type { NotifyBodyDto } from "~/api/models/notify";
import { env } from "@ashgw/env";

export async function notify(input: {
  body: NotifyBodyDto;
}): Promise<NotifyResponses> {
  logger.info("Sending email notification...");

  try {
    await email.sendNotification({
      to: input.body.to ?? env.PERSONAL_EMAIL,
      title: input.body.title,
      subject: input.body.subject,
      type: input.body.type,
      message: input.body.message,
    });

    logger.info("Email notification sent successfully");
    return { status: 200, body: undefined };
  } catch (error) {
    monitor.next.captureException({ error });
    logger.error("Failed to send notification", { error });
    return {
      status: 500,
      body: {
        code: "INTERNAL_ERROR",
        message: "Oops! Looks like it's on me this time",
      },
    };
  }
}
