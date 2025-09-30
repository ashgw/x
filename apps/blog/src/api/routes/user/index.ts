import { z } from "zod";

import type { TrpcContext } from "~/trpc/context";
import { authenticatedProcedure, publicProcedure } from "~/trpc/procedures";
import { router } from "~/trpc/root";
import {
  sessionSchemaRo,
  userChangePasswordSchemaDto,
  userLoginSchemaDto,
  userRegisterSchemaDto,
  userTerminateSpecificSessionSchemaDto,
  userSchemaRo,
  twoFactorEnableDtoSchema,
  twoFactorGetTotpUriDtoSchema,
  twoFactorVerifyTotpDtoSchema,
  twoFactorDisableDtoSchema,
  twoFactorGenerateBackupCodesDtoSchema,
  twoFactorVerifyBackupCodeDtoSchema,
  twoFactorEnableRoSchema,
  twoFactorGetTotpUriRoSchema,
  twoFactorGenerateBackupCodesRoSchema,
} from "~/api/models";

import { UserService } from "~/api/services";

const userService = (ctx: TrpcContext) =>
  new UserService({
    ctx,
  });

export const userRouter = router({
  me: publicProcedure()
    .input(z.void())
    .output(userSchemaRo.nullable())
    .query(async ({ ctx }) => {
      return await userService(ctx).me();
    }),

  login: publicProcedure({
    limiter: {
      every: "1m",
      hits: 2,
    },
  })
    .input(userLoginSchemaDto)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      return await userService(ctx).login(input);
    }),

  signUp: publicProcedure({
    limiter: {
      every: "1m",
      hits: 2,
    },
  })
    .input(userRegisterSchemaDto)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      return await userService(ctx).signUp(input);
    }),

  logout: publicProcedure({
    limiter: {
      every: "1m",
      hits: 10,
    },
  })
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      return await userService(ctx).logout();
    }),

  changePassword: authenticatedProcedure({
    limiter: {
      every: "2h",
      hits: 1,
    },
  })
    .input(userChangePasswordSchemaDto)
    .output(z.void())
    .mutation(async ({ ctx, input: { currentPassword, newPassword } }) => {
      await userService(ctx).changePassword({
        currentPassword,
        newPassword,
      });
    }),

  listAllSessions: authenticatedProcedure({
    limiter: {
      every: "1m",
      hits: 5,
    },
  })
    .input(z.void())
    .output(z.array(sessionSchemaRo))
    .query(async ({ ctx }) => {
      return await userService(ctx).listSessions();
    }),

  terminateAllActiveSessions: authenticatedProcedure({
    limiter: {
      every: "1m",
      hits: 5,
    },
  })
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      await userService(ctx).terminateAllActiveSessions();
    }),

  terminateSpecificSession: authenticatedProcedure({
    limiter: {
      every: "1m",
      hits: 4,
    },
  })
    .input(userTerminateSpecificSessionSchemaDto)
    .output(z.void())
    .mutation(async ({ ctx, input: { token } }) => {
      await userService(ctx).terminateSpecificSession({
        token,
      });
    }),
  enableTwoFactor: authenticatedProcedure({
    limiter: {
      every: "1m",
      hits: 2,
    },
  })
    .input(twoFactorEnableDtoSchema)
    .output(twoFactorEnableRoSchema)
    .mutation(async ({ ctx, input }) => {
      return await userService(ctx).enableTwoFactor(input);
    }),

  getTwoFactorTotpUri: authenticatedProcedure({
    limiter: {
      every: "1m",
      hits: 10,
    },
  })
    .input(twoFactorGetTotpUriDtoSchema)
    .output(twoFactorGetTotpUriRoSchema)
    .query(async ({ ctx, input }) => {
      return await userService(ctx).getTwoFactorTotpUri(input);
    }),

  verifyTwoFactorTotp: publicProcedure({
    limiter: {
      every: "1m",
      hits: 10,
    },
  })
    .input(twoFactorVerifyTotpDtoSchema)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      await userService(ctx).verifyTwoFactorTotp(input);
    }),

  disableTwoFactor: authenticatedProcedure({
    limiter: {
      every: "1m",
      hits: 10,
    },
  })
    .input(twoFactorDisableDtoSchema)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      await userService(ctx).disableTwoFactor(input);
    }),

  generateTwoFactorBackupCodes: authenticatedProcedure({
    limiter: {
      every: "1m",
      hits: 10,
    },
  })
    .input(twoFactorGenerateBackupCodesDtoSchema)
    .output(twoFactorGenerateBackupCodesRoSchema)
    .mutation(async ({ ctx, input }) => {
      return await userService(ctx).generateTwoFactorBackupCodes(input);
    }),

  verifyTwoFactorBackupCode: publicProcedure({
    limiter: {
      every: "1m",
      hits: 10,
    },
  })
    .input(twoFactorVerifyBackupCodeDtoSchema)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      await userService(ctx).verifyTwoFactorBackupCode(input);
    }),
});
