import { z } from "zod";

import { getBlogDtoSchema } from "../models";
import { publicProcedure, router } from "../trpc";

export const postRouter = router({
  get: publicProcedure.input(getBlogDtoSchema).query(async ({ input }) => {
    return 
  }),
});
