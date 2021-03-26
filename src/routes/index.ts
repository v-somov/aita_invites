import { Router } from "express";
import { home } from "../controllers";

const router = Router();

router.get("/", home.indexHome);

export { router };
