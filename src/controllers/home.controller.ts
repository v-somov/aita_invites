import { Request, Response } from "express";
import { userService } from "../services";
import { ArrivedUser } from "../models";

const indexHome = async (_: Request, res: Response): Promise<void> => {
  res.render("home/index", {});
};

const showBoarding = async (_: Request, res: Response): Promise<void> => {
  userService
    .latestArrivedUser()
    .then((result: ArrivedUser) => {
      res.render("home/boarding", result);
    })
    .catch((_) => {
      res.render("home/boarding", {
        name: "No one yet arrived",
        distance: 0,
        hours: 0,
      });
    });
};

const showSseMap = async (_: Request, res: Response): Promise<void> => {
  res.render("home/map", {});
};

const sseMap = async (_: Request, res: Response): Promise<void> => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  let lastUpdatedAt = new Date(0);
  const sendArrivedUsers = () => {
    console.log("map data updated");
    console.log(lastUpdatedAt);
    userService.arrivedUsers(lastUpdatedAt).then((result: ArrivedUser[]) => {
      if (result.length) {
        lastUpdatedAt = new Date(result[0].boarding_pass_updated_at);
        res.write(`data: ${JSON.stringify(result)}\n\n`);
      }
    });
  };
  sendArrivedUsers();
  const intervalId = setInterval(sendArrivedUsers, 10000);

  res.on("close", () => {
    console.log("client dropped connection");
    clearInterval(intervalId);
    res.end();
  });
};

export { indexHome, showBoarding, showSseMap, sseMap };
