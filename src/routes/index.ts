import { Router, json } from "express";
import { home } from "../controllers";
import { boardingPass, users } from "../controllers/api";

const router = Router();

router.get("/", home.indexHome);
router.get("/boarding", home.showBoarding);
router.get("/map", home.showSseMap);
router.get("/map_streaming", home.sseMap);

router.post(
  "/api/users",
  json(),
  users.validate("createUser"),
  users.createUser
);
router.post(
  "/api/users/:id/boarding_passes.:ext?",
  boardingPass.createBoardingPass
);
router.put(
  "/api/boarding_passes/:invite_code",
  boardingPass.updateBoardingPass
);

export { router };
