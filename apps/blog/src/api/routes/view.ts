import { publicProcedure } from "~/trpc/procedures";
import { router } from "~/trpc/root";
import { trackViewRoSchema, trackViewSchemaDto } from "../models/view";
import { ViewService } from "../services/view";

export const viewRouter = router({
  trackView: publicProcedure()
    .input(trackViewSchemaDto)
    .output(trackViewRoSchema)
    .mutation(async ({ input: { slug }, ctx: { db, req } }) => {
      return await new ViewService({
        db,
        req,
      }).trackView({ slug });
    }),
});
