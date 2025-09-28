import { AppError } from "@ashgw/error";
import { auth } from "@ashgw/auth";
import type {
  SessionRo,
  UserLoginDto,
  UserRegisterDto,
  UserRo,
} from "~/api/models";
import { SessionMapper, UserMapper } from "~/api/mappers";
import type { Optional } from "ts-roids";
import type { TrpcContext } from "~/trpc/context";

export class AuthService {
  private readonly ctx: TrpcContext;
  constructor({ ctx }: { ctx: TrpcContext }) {
    this.ctx = ctx;
  }
  public async login({ email, password }: UserLoginDto): Promise<void> {
    await auth.signInEmail({
      body: {
        email,
        password,
      },
      headers: this.ctx.req.headers,
    });
  }

  public async signUp({
    email,
    password,
    name,
  }: UserRegisterDto): Promise<void> {
    await auth.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: this.ctx.req.headers,
    });
  }

  public async signInWithGoogle({
    callbackURL,
  }: {
    callbackURL?: string;
  }): Promise<{ url: string }> {
    const response = await auth.signInSocial({
      body: {
        provider: "google",
        callbackURL: callbackURL ?? "/editor",
      },
      headers: this.ctx.req.headers,
    });

    if (!response.url) {
      throw new AppError({
        code: "INTERNAL",
        message: "Failed to get Google OAuth URL",
      });
    }

    return { url: response.url };
  }

  public async logout(): Promise<void> {
    await auth.signOut({
      headers: this.ctx.req.headers,
    });
  }

  public async terminateAllActiveSessions(): Promise<void> {
    await auth.revokeSessions({
      headers: this.ctx.req.headers,
    });
  }

  public async listSessions(): Promise<SessionRo[]> {
    const sessions = await auth.listSessions({
      headers: this.ctx.req.headers,
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
      headers: this.ctx.req.headers,
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
      headers: this.ctx.req.headers,
    });
  }

  public async me(): Promise<Optional<UserRo>> {
    try {
      return await this._getUserWithSession();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  private async _getUserWithSession(): Promise<UserRo> {
    const response = await auth.getSession({
      headers: this.ctx.req.headers,
    });
    if (!response?.user) {
      throw new AppError({
        code: "UNAUTHORIZED",
      });
    }
    return UserMapper.toUserRo({
      user: response.user,
      session: response.session,
    });
  }
}
