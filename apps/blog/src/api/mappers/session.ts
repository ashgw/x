import type { SessionRo } from "../models";
import type { SessionAuthQuery } from "../query-helpers/session";

export class SessionMapper {
  public static toRo({ session }: { session: SessionAuthQuery }): SessionRo {
    return {
      createdAt: session.createdAt,
      isExpired: new Date(session.expiresAt) < new Date(),
      updatedAt: session.updatedAt,
      token: session.token,
      userAgent: session.userAgent ? session.userAgent : undefined,
      userId: session.userId,
    };
  }
}
