import { z } from "zod";

import { publicProcedure } from "~/trpc/procedures";
import { router } from "~/trpc/root";
import { trackViewSchemaDto } from "../models/view";
import { ViewService } from "../services/view";

export const viewRouter = router({
  trackView: publicProcedure
    .input(trackViewSchemaDto)
    .output(z.void())
    .mutation(async ({ input: { postSlug }, ctx: { db, req } }) => {
      const headersList = req.headers;
      const ipAddress =
        headersList.get("x-forwarded-for") ??
        headersList.get("x-real-ip") ??
        "127.0.0.1";
      const userAgent = headersList.get("user-agent") ?? "unknown";
      const viewService = new ViewService({ db });

      await viewService.trackView({
        postSlug,
        ipAddress,
        userAgent,
      });
    }),
});
