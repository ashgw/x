import { z } from "zod";
import { c } from "../root";
import { restSchemaResponse } from "../extended";
import { withStdErrors } from "./std";

export const healthCheckSchemaResponses = restSchemaResponse(
  withStdErrors({
    200: c.noBody(),
  }),
);

export const fetchTextFromUpstreamSchemaResponses = restSchemaResponse(
  withStdErrors({
    200: c.otherResponse({
      contentType: "text/plain",
      body: z.string().min(1),
    }),
  }),
);

export const fetchGpgFromUpstreamSchemaResponses = restSchemaResponse(
  withStdErrors({
    200: c.otherResponse({
      contentType: "application/pgp-keys",
      body: z.string().min(1),
    }),
  }),
);

export const purgeViewWindowSchemaResponses = restSchemaResponse(
  withStdErrors({
    200: c.noBody(),
  }),
);
