import { z } from "zod";

import { publicProcedure } from "~/trpc/procedures";
import { router } from "~/trpc/root";
import {
  userLoginSchemaDto,
  userRegisterSchemaDto,
  userSchemaRo,
} from "../models";
import { AuthService } from "../services";

export const userRouter = router({
  me: publicProcedure
    .input(z.void())
    .output(userSchemaRo.nullable())
    .query(async ({ ctx }) => {
      return await new AuthService({
        db: ctx.db,
        req: ctx.req,
        res: ctx.res,
      }).me();
    }),

  register: publicProcedure
    .input(userRegisterSchemaDto)
    .output(userSchemaRo)
    .mutation(async ({ input, ctx }) => {
      return await new AuthService({
        db: ctx.db,
        req: ctx.req,
        res: ctx.res,
      }).register(input);
    }),

  login: publicProcedure
    .input(userLoginSchemaDto)
    .output(userSchemaRo)
    .mutation(async ({ input, ctx }) => {
      return await new AuthService({
        db: ctx.db,
        req: ctx.req,
        res: ctx.res,
      }).login(input);
    }),

  logout: publicProcedure
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      return await new AuthService({
        db: ctx.db,
        req: ctx.req,
        res: ctx.res,
      }).logout();
    }),
});
