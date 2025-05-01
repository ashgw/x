import { env } from "@ashgw/env";
import { InternalError, logger } from "@ashgw/observability";

interface KitAPIResponse {
  errors?: string[];
  message?: string;
}

export class NewsletterService {
  private static readonly API_BASE = "https://api.kit.com/v4"; // Updated to v4 API

  /** idempotent: creates or updates a subscriber */
  public static async subscribe(email: string): Promise<void> {
    try {
      // Fix: The email parameter is being received as an object instead of string
      const emailAddress =
        typeof email === "object" && email.email ? email.email : email;

      logger.info("Creating/updating subscriber", {
        email: emailAddress,
      });

      // Use the subscribers endpoint directly in V4
      const res = await fetch(`${this.API_BASE}/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Kit-Api-Key": env.KIT_API_KEY,
        },
        body: JSON.stringify({
          email_address: emailAddress,
          // Optional fields if needed:
          // first_name: undefined,
          // fields: {},
          // tags: [],
          // state: "active", // Can be active or inactive
        }),
      });

      const data = (await res.json().catch(() => ({
        errors: ["Failed to parse response"],
      }))) as KitAPIResponse;

      logger.info("Kit API response", {
        status: res.status,
        data,
        headers: Object.fromEntries(res.headers.entries()),
      });

      // V4 specific error handling
      if (!res.ok) {
        const errorMessage =
          (data.errors ? data.errors.join(", ") : data.message) ??
          "Unknown error";
        throw new Error(`Kit API error (${res.status}): ${errorMessage}`);
      }
    } catch (error) {
      logger.error("Newsletter subscription failed", { error, email });

      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to subscribe to newsletter",
        cause: error,
      });
    }
  }
}
