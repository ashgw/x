import { createExpressEndpoints, initServer } from "@ts-rest/express";
import express from "express";
import bodyParser from "body-parser";
import { contract } from "./contract";
import { db } from "@ashgw/db";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const s = initServer();
const router = s.router(contract, {
  getPokemon: async ({ params: { id } }) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      status: 200,
      body: {
        id,
        name: "Pokemon",
      },
    };
  },
});

createExpressEndpoints(contract, router, app, {
  responseValidation: true,
  globalMiddleware: [
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
