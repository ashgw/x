import { z } from "zod";

import type { TrpcContext } from "~/trpc/context";
import { authenticatedProcedure, publicProcedure } from "~/trpc/procedures";
import { router } from "~/trpc/root";
import {
  userChangePasswordSchemaDto,
  userLoginSchemaDto,
  userSchemaRo,
  userTerminateSpecificSessionSchemaDto,
} from "~/api/models";
import { AuthService } from "~/api/services";

const userAuthService = (ctx: TrpcContext) =>
  new AuthService({
    db: ctx.db,
    req: ctx.req,
    res: ctx.res,
  });

export const userRouter = router({
  me: publicProcedure()
    .input(z.void())
    .output(userSchemaRo.nullable())
    .query(async ({ ctx }) => {
      return await userAuthService(ctx).me();
    }),

  login: publicProcedure({
    limit: {
      every: "3s",
    },
  })
    .input(userLoginSchemaDto)
    .output(userSchemaRo)
    .mutation(async ({ input, ctx }) => {
      return await userAuthService(ctx).login(input);
    }),

  logout: publicProcedure({
    limit: {
      every: "2s",
    },
  })
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      return await userAuthService(ctx).logout();
    }),

  changePassword: authenticatedProcedure({
    limit: {
      every: "2s",
    },
  })
    .input(userChangePasswordSchemaDto)
    .output(z.void())
    .mutation(async ({ ctx, input: { currentPassword, newPassword } }) => {
      await userAuthService(ctx).changePassword({
        userId: ctx.user.id,
        currentPassword,
        newPassword,
      });
    }),

  terminateAllActiveSessions: authenticatedProcedure({
    limit: {
      every: "2s",
    },
  })
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      await userAuthService(ctx).terminateAllActiveSessions({
        userId: ctx.user.id,
      });
    }),

  terminateSpecificSession: authenticatedProcedure({
    limit: {
      every: "2s",
    },
  })
    .input(userTerminateSpecificSessionSchemaDto)
    .output(z.void())
    .mutation(async ({ ctx, input: { sessionId } }) => {
      await userAuthService(ctx).terminateSpecificSession({
        sessionId,
        userId: ctx.user.id,
      });
    }),
});
