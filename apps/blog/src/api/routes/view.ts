import { publicProcedure, router } from "~/trpc/trpc";
import { trackViewResponseSchemaRo, trackViewSchemaDto } from "../models/view";
import { ViewService } from "../services/view";

export const viewRouter = router({
  trackView: publicProcedure
    .input(trackViewSchemaDto)
    .output(trackViewResponseSchemaRo)
    .mutation(async ({ input: { postSlug }, ctx: { db, req } }) => {
      const viewService = new ViewService({ db });
      const headersList = req.headers;
      const ipAddress =
        headersList.get("x-forwarded-for") ??
        headersList.get("x-real-ip") ??
        "127.0.0.1";
      const userAgent = headersList.get("user-agent") ?? "unknown";
      return await viewService.trackView({
        postSlug,
        ipAddress,
        userAgent,
      });
    }),
});
