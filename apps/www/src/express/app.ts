import express from "express";
import bodyParser from "body-parser";
import { logger } from "@ashgw/logger";
import { v1RestRouter } from "./rest";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/v1", v1RestRouter);

app.get("/", (req, res) => {
  logger.info(String(req.app.locals));
  res.send("Hiii 😎🔥🚀✨");
});

app.listen(3000, () => {
  logger.info("Express server running on :3000");
});
