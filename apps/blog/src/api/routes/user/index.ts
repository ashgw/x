import { z } from "zod";

import type { TrpcContext } from "~/trpc/context";
import { authenticatedProcedure, publicProcedure } from "~/trpc/procedures";
import { router } from "~/trpc/root";
import {
  sessionSchemaRo,
  userChangePasswordSchemaDto,
  userGoogleSignInSchemaDto,
  userLoginSchemaDto,
  userRegisterSchemaDto,
  userTerminateSpecificSessionSchemaDto,
  userSchemaRo,
} from "~/api/models";
import { AuthService } from "~/api/services";

const authService = (ctx: TrpcContext) =>
  new AuthService({
    ctx,
  });

export const userRouter = router({
  me: publicProcedure()
    .input(z.void())
    .output(userSchemaRo.nullable())
    .query(async ({ ctx }) => {
      return await authService(ctx).me();
    }),

  login: publicProcedure({
    limit: {
      every: "3s",
    },
  })
    .input(userLoginSchemaDto)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      return await authService(ctx).login(input);
    }),

  signUp: publicProcedure({
    limit: {
      every: "5s",
    },
  })
    .input(userRegisterSchemaDto)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      return await authService(ctx).signUp(input);
    }),

  signInWithGoogle: publicProcedure({
    limit: {
      every: "3s",
    },
  })
    .input(userGoogleSignInSchemaDto)
    .output(z.object({ url: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await authService(ctx).signInWithGoogle(input);
    }),

  logout: publicProcedure({
    limit: {
      every: "2s",
    },
  })
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      return await authService(ctx).logout();
    }),

  changePassword: authenticatedProcedure({
    limit: {
      every: "2s",
    },
  })
    .input(userChangePasswordSchemaDto)
    .output(z.void())
    .mutation(async ({ ctx, input: { currentPassword, newPassword } }) => {
      await authService(ctx).changePassword({
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
      return await authService(ctx).listSessions();
    }),

  terminateAllActiveSessions: authenticatedProcedure({
    limit: {
      every: "2s",
    },
  })
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      await authService(ctx).terminateAllActiveSessions();
    }),

  terminateSpecificSession: authenticatedProcedure({
    limit: {
      every: "2s",
    },
  })
    .input(userTerminateSpecificSessionSchemaDto)
    .output(z.void())
    .mutation(async ({ ctx, input: { token } }) => {
      await authService(ctx).terminateSpecificSession({
        token,
      });
    }),
});
