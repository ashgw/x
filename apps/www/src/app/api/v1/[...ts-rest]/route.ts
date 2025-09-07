import { createNextHandler, tsr } from "@ts-rest/serverless/next";
import { contract } from "~/api/contract";
import { endPoint } from "~/api/endpoint";
import { router } from "~/api/router";
import { logger, monitor } from "@ashgw/observability";
export const runtime = "edge";

// TODO: add actual middlewares seperately

// const fakeAuthenticate = (str: string | null): string => str ?? "";

const handler = createNextHandler(contract, router, {
  basePath: endPoint,
  handlerType: "app-router",
  responseValidation: true,
  jsonQuery: false,
  requestMiddleware: [
    // tsr.middleware<{ userId: string }>((request) => {
    //   if (request.headers.get("Authorization")) {
    //     const userId = fakeAuthenticate(request.headers.get("Authorization"));
    //     if (!userId) {
    //       return TsRestResponse.fromJson(
    //         { message: "Unauthorized" },
    //         { status: 401 },
    //       );
    //     }
    //     request.userId = userId;
    //   }
    // }),
    tsr.middleware<{ time: Date }>((request) => {
      request.time = new Date();
    }),
  ],
  responseHandlers: [
    (_response, request) => {
      logger.log(
        "[REST] took",
        new Date().getTime() - request.time.getTime(),
        "ms",
      );
    },
  ],
  errorHandler: (error, { route }) => {
    logger.error(`>>> REST Error on ${route}`, error);
    monitor.next.captureException({
      error,
      hint: {
        extra: {
          route,
        },
      },
    });
  },
});

export { handler as GET, handler as DELETE };
