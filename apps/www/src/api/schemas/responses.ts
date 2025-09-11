// TODO: add docs through schema description here
import { z } from "zod";
import { c } from "~/ts-rest/root";
import { createSchemaResponses, httpErrorSchema } from "~/@ashgw/ts-rest";
import type { InferResponses } from "~/@ashgw/ts-rest";

// ========== Schemas ==========

export const healthCheckSchemaResponses = createSchemaResponses({
  200: c.noBody(),
});

const fetchContentFromUpstreamSchemaResponses = createSchemaResponses({
  500: httpErrorSchema,
  424: httpErrorSchema,
});

export const fetchTextFromUpstreamSchemaResponses = createSchemaResponses({
  200: c.otherResponse({ contentType: "text/plain", body: z.string().min(1) }),
  ...fetchContentFromUpstreamSchemaResponses,
});

export const fetchGpgFromUpstreamSchemaResponses = createSchemaResponses({
  200: c.otherResponse({
    contentType: "application/pgp-keys",
    body: z.string().min(1),
  }),
  ...fetchContentFromUpstreamSchemaResponses,
});

export const purgeViewWindowSchemaResponses = createSchemaResponses({
  200: c.noBody(),
  401: httpErrorSchema, // TODO: here make to be createHttpErrorSchema.forbidden() or httpErrorSchema.unauthorized()
  // // so it doesnt pollute the generated openAPI schema, since

  /** 
   * rn it looks like this 
   * "403": {
            "description": "403",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "code": {
                      "type": "string",
                      "enum": [
                        "UPSTREAM_ERROR",
                        "INTERNAL_ERROR",
                        "BAD_REQUEST",
                        "NOT_FOUND",
                        "UNAUTHORIZED",
                        "FORBIDDEN"
                      ],
                      "description": "Stable, machine-parseable error code"
                    },
                    "message": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 1000,
                      "description": "Human readable"
                    },
                    "details": {
                      "type": "object",
                      "additionalProperties": {
                        "nullable": true
                      },
                      "description": "Optional extra context"
                    }
                  },
                  "required": [
                    "code",
                    "message"
                  ]
                }
              }
            }
          },


   * whoch os fickng annoying and big af, and the description doesnt make any sense really, like bro i should describe wtf 
          and why, like for exmaple, 'not authorized to perform this action' or forbidden or whatever, we defailt to those, but
          we let the user describe the schema too of the descripton, like httpErrorSchema.unauthorized().describe('blah blah...')
   * 
   */
  403: httpErrorSchema,
  500: httpErrorSchema,
});

// ========== Types ==========

export type HealthCheckResponses = InferResponses<
  typeof healthCheckSchemaResponses
>;

export type FetchTextFromUpstreamResponses = InferResponses<
  typeof fetchTextFromUpstreamSchemaResponses
>;

export type FetchGpgFromUpstreamResponses = InferResponses<
  typeof fetchGpgFromUpstreamSchemaResponses
>;

export type PurgeViewWindowResponses = InferResponses<
  typeof purgeViewWindowSchemaResponses
>;
