import { env } from "@ashgw/env";
import { InternalError } from "@ashgw/observability";

export class NewsletterService {
  public static async subscribe({ email }: { email: string }): Promise<void> {
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
    } catch (error) {
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to subscribe to newsletter",
        cause: error,
      });
    }
  }
}
