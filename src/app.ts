import * as express from "express";
import { Application } from "express";
import { router } from "./routes";
import { notFound, errorHandlerMiddleware, logger } from "./middlewares";
import asyncHandler from "express-async-handler";

const app: Application = express.default();

app.use(logger);
app.use("/", asyncHandler(router));

app.use(asyncHandler(notFound));

app.use(errorHandlerMiddleware);

app.use(express.static("public"));

app.set("views", "views");
app.set("view engine", "pug");

export { app };
