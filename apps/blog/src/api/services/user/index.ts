import { AppError } from "@ashgw/error";
import { auth } from "@ashgw/auth";
import type {
  SessionRo,
  TwoFactorEnableDto,
  TwoFactorEnableRo,
  TwoFactorGenerateBackupCodesRo,
  TwoFactorGetTotpUriDto,
  TwoFactorGetTotpUriRo,
  TwoFactorGenerateBackupCodesDto,
  TwoFactorVerifyBackupCodeDto,
  TwoFactorDisableDto,
  TwoFactorVerifyTotpDto,
  UserLoginDto,
  UserRegisterDto,
  UserRo,
} from "~/api/models";
import { SessionMapper, UserMapper } from "~/api/mappers";
import type { Optional } from "ts-roids";
import type { TrpcContext } from "~/trpc/context";

// TODO: add logging to the unlogged
export class UserService {
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
  public async enableTwoFactor(
    input: TwoFactorEnableDto,
  ): Promise<TwoFactorEnableRo> {
    return await auth.enableTwoFactor({
      body: {
        ...input,
      },
    });
  }
  public async getTwoFactorTotpUri(
    input: TwoFactorGetTotpUriDto,
  ): Promise<TwoFactorGetTotpUriRo> {
    return await auth.getTOTPURI({
      body: input,
    });
  }
  public async verifyTwoFactorTotp(
    input: TwoFactorVerifyTotpDto,
  ): Promise<void> {
    return await auth.verifyTOTP({
      body: input,
    });
  }
  public async disableTwoFactor(input: TwoFactorDisableDto): Promise<void> {
    return await auth.disableTwoFactor({
      body: input,
    });
  }
  public async generateTwoFactorBackupCodes(
    input: TwoFactorGenerateBackupCodesDto,
  ): Promise<TwoFactorGenerateBackupCodesRo> {
    return await auth.generateBackupCodes({
      body: input,
    });
  }

  public async verifyTwoFactorBackupCode(
    input: TwoFactorVerifyBackupCodeDto,
  ): Promise<void> {
    return await auth.verifyBackupCode({
      body: input,
    });
  }
}
