import { env } from "@ashgw/env";
import { sentry } from "@ashgw/observability";

import { CustomTRPCError } from "~/trpc/error";

export class NewsletterService {
  public static async subscribe({ email }: { email: string }) {
    try {
      const response = await fetch("https://api.kit.com/v4/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.KIT_API_KEY}`,
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      return { success: true };
    } catch (error) {
      sentry.next.captureException({
        error,
        withErrorLogging: {
          message: "Failed to subscribe to newsletter",
        },
      });
      throw new CustomTRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to subscribe to newsletter",
      });
    }
  }
}
