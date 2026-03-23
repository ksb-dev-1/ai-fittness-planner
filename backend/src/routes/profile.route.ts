import { Router } from "express";
import { saveProfile } from "../controllers/profile.controller";

export const profileRouter = Router();

profileRouter.post("/", saveProfile);
