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
    limit: {
      every: "3s",
    },
  })
    .input(userLoginSchemaDto)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      return await userService(ctx).login(input);
    }),

  signUp: publicProcedure({
    limit: {
      every: "5s",
    },
  })
    .input(userRegisterSchemaDto)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      return await userService(ctx).signUp(input);
    }),

  logout: publicProcedure({
    limit: {
      every: "2s",
    },
  })
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      return await userService(ctx).logout();
    }),

  changePassword: authenticatedProcedure({
    limit: {
      every: "2s",
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
    limit: {
      every: "2s",
    },
  })
    .input(z.void())
    .output(z.array(sessionSchemaRo))
    .query(async ({ ctx }) => {
      return await userService(ctx).listSessions();
    }),

  terminateAllActiveSessions: authenticatedProcedure({
    limit: {
      every: "2s",
    },
  })
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      await userService(ctx).terminateAllActiveSessions();
    }),

  terminateSpecificSession: authenticatedProcedure({
    limit: {
      every: "2s",
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
    limit: { every: "2s" },
  })
    .input(twoFactorEnableDtoSchema)
    .output(twoFactorEnableRoSchema)
    .mutation(async ({ ctx, input }) => {
      return await userService(ctx).enableTwoFactor(input);
    }),

  getTwoFactorTotpUri: authenticatedProcedure({
    limit: { every: "2s" },
  })
    .input(twoFactorGetTotpUriDtoSchema)
    .output(twoFactorGetTotpUriRoSchema)
    .query(async ({ ctx, input }) => {
      return await userService(ctx).getTwoFactorTotpUri(input);
    }),

  verifyTwoFactorTotp: publicProcedure({
    limit: { every: "2s" },
  })
    .input(twoFactorVerifyTotpDtoSchema)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      await userService(ctx).verifyTwoFactorTotp(input);
    }),

  disableTwoFactor: authenticatedProcedure({
    limit: { every: "2s" },
  })
    .input(twoFactorDisableDtoSchema)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      await userService(ctx).disableTwoFactor(input);
    }),

  generateTwoFactorBackupCodes: authenticatedProcedure({
    limit: { every: "2s" },
  })
    .input(twoFactorGenerateBackupCodesDtoSchema)
    .output(twoFactorGenerateBackupCodesRoSchema)
    .mutation(async ({ ctx, input }) => {
      return await userService(ctx).generateTwoFactorBackupCodes(input);
    }),

  verifyTwoFactorBackupCode: publicProcedure({
    limit: { every: "2s" },
  })
    .input(twoFactorVerifyBackupCodeDtoSchema)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      await userService(ctx).verifyTwoFactorBackupCode(input);
    }),
});
