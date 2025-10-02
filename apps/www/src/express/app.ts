import { createExpressEndpoints, initServer } from "@ts-rest/express";
import express from "express";
import bodyParser from "body-parser";
import { contract } from "./contract";
import { db } from "@ashgw/db";
import { logger } from "@ashgw/logger";
import type { GlobalContext } from "~/ts-rest/context";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const s = initServer();

const router = s.router(contract, {
  getPokemon: {
    middleware: [
      (req, _res, next) => {
        req.ctx = {
          db,
        };
        next();
      },
    ],
    handler: async ({ params: { id } }) => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return {
        status: 200,
        body: { id, name: "Pokemon" },
      };
    },
  },
});

createExpressEndpoints(contract, router, app, {
  responseValidation: true,
  jsonQuery: true,
  logInitialization: true,
  globalMiddleware: [
    (req, _res, next) => {
      createGlobalContext(req, _res);
      next();
    },
    (req, _res, next) => {
      req.ctx = {
        db,
      };
      next();
    },
  ],
  requestValidationErrorHandler: (err, req, res, next) => {
    //             err is typed as ^ RequestValidationError
    res.status(400).json({
      message: "Validation failed",
    });
    next();
  },
});

app.listen(3000, () => {
  logger.info("Express server running on :3000");
});

export const createGlobalContext = (
  _req: express.Request,
  _res: express.Response,
): GlobalContext => {
  return {
    ctx: {
      db,
      requestedAt: new Date(),
    },
  };
};
