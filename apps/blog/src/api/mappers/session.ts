import type { SessionRo } from "../models";
import type { SessionAuthQuery } from "../query-helpers/session";

export class SessionMapper {
  public static toRo({ session }: { session: SessionAuthQuery }): SessionRo {
    return {
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      isExpired: new Date(session.expiresAt) < new Date(),
      token: session.token,
      userAgent: session.userAgent ? session.userAgent : undefined,
    };
  }
}
