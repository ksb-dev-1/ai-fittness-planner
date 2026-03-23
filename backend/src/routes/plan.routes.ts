import { Router } from "express";
import { generatePlan, getCurrentPlan } from "../controllers/plan.controller";

export const planRouter = Router();

planRouter.post("/generate", generatePlan);
planRouter.get("/current", getCurrentPlan);
