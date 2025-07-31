import { z } from "zod";

import type { TrpcContext } from "~/trpc/context";
import { publicProcedure } from "~/trpc/procedures";
import { router } from "~/trpc/root";
import {
  userLoginSchemaDto,
  userRegisterSchemaDto,
  userSchemaRo,
} from "../models";
import { AuthService } from "../services";

const auth = (ctx: TrpcContext) =>
  new AuthService({
    db: ctx.db,
    req: ctx.req,
    res: ctx.res,
  });

export const userRouter = router({
  me: publicProcedure
    .input(z.void())
    .output(userSchemaRo.nullable()) // null if user not found
    .query(async ({ ctx }) => {
      return await auth(ctx).me();
    }),

  register: publicProcedure
    .input(userRegisterSchemaDto)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      return await auth(ctx).register(input);
    }),

  login: publicProcedure
    .input(userLoginSchemaDto)
    .output(userSchemaRo)
    .mutation(async ({ input, ctx }) => {
      return await auth(ctx).login(input);
    }),

  logout: publicProcedure
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      return await auth(ctx).logout();
    }),
});
