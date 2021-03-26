import * as express from "express";
import { Application } from "express";
import { router } from "./routes";
import { notFound, errorHandlerMiddleware } from "./middlewares";

const app: Application = express.default();

// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", (req, res) => res.send("App is working"));
app.use("/", router);

// app.use("/api", routes);

app.use(notFound);
app.use(errorHandlerMiddleware);

app.use(express.static("public"));
app.use(express.static("views"));

app.set("view engine", "pug");

export { app };
