import { Request, Response } from "express";
import { createTrainingPlan, fetchCurrentPlan } from "../services/plan.service";

export const generatePlan = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const result = await createTrainingPlan(userId);

    return res.json(result);
  } catch (error: any) {
    console.error("Error generating plan:", error);

    return res.status(500).json({
      error: error.message || "Failed to generate plan",
    });
  }
};

export const getCurrentPlan = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const plan = await fetchCurrentPlan(userId);

    if (!plan) {
      return res.status(404).json({ error: "No plan found" }); // ✅ correct
    }

    return res.json(plan);
  } catch (error: any) {
    console.error("Error fetching plan:", error);

    return res.status(500).json({
      error: error.message || "Failed to fetch plan",
    });
  }
};
