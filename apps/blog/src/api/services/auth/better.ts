import argon2 from "argon2";
import type { NextRequest, NextResponse } from "next/server";
import type { Optional } from "ts-roids";

import type { DatabaseClient } from "@ashgw/db";
import { env } from "@ashgw/env";
import { AppError } from "@ashgw/error";
import { logger } from "@ashgw/logger";
import { auth } from "@ashgw/auth";
import type { UserLoginDto, UserRo } from "~/api/models";
import { UserMapper } from "~/api/mappers";
import { UserQueryHelper } from "~/api/query-helpers";
import { headers } from "next/headers";

export class BetterAuthService {
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
}
