import type { Optional } from "ts-roids";

import type { DatabaseClient } from "@ashgw/db";
import { AppError } from "@ashgw/error";
import { auth } from "@ashgw/auth";
import type { SessionRo, UserLoginDto, UserRo } from "~/api/models";
import { SessionMapper, UserMapper } from "~/api/mappers";
import { headers } from "next/headers";

export class AuthService {
  private readonly db: DatabaseClient;
  constructor({ db }: { db: DatabaseClient }) {
    this.db = db;
  }
  public async login({ email, password }: UserLoginDto): Promise<void> {
    await auth.signInEmail({
      body: {
        email,
        password,
      },
      headers: headers(),
    });
  }

  public async logout(): Promise<void> {
    await auth.signOut({
      headers: headers(), // TODO: make sure headers work with tRPC
    });
  }

  public async terminateAllActiveSessions(): Promise<void> {
    await auth.revokeSessions({
      headers: headers(),
    });
  }

  public async listSessions(): Promise<SessionRo[]> {
    const sessions = await auth.listSessions({
      headers: headers(),
    });
    return sessions.map((s) => SessionMapper.toRo({ session: s }));
  }

  public async terminateSpecificSession({
    token,
  }: {
    token: string;
  }): Promise<void> {
    await auth.revokeSession({
      body: {
        token,
      },
      headers: headers(),
    });
  }

  public async changePassword({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await auth.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
      headers: headers(),
    });
  }

  public async me(): Promise<Optional<UserRo>> {
    try {
      return await this._getUser();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  private async _getUser() {
    const response = await auth.getSession({
      headers: headers(),
    });
    if (!response?.user) {
      throw new AppError({
        code: "UNAUTHORIZED",
      });
    }
    return UserMapper.toUserRo({ user: response.user });
  }
}
