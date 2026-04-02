import { prisma } from "../lib/prisma";
import { generateTrainingPlan } from "../lib/ai";

export const createTrainingPlan = async (userId: string) => {
  // 1. Get profile
  const profile = await prisma.user_profiles.findUnique({
    where: { user_id: userId },
  });

  if (!profile) {
    throw new Error("User profile not found. Complete onboarding first.");
  }

  // 2. Get latest version
  const latestPlan = await prisma.training_plans.findFirst({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    select: { version: true },
  });

  const nextVersion = latestPlan ? latestPlan.version + 1 : 1;

  // 3. Generate AI plan
  let planJson;
  try {
    planJson = await generateTrainingPlan(profile);
  } catch (error: any) {
    console.error("AI generation failed:", error);
    throw new Error("Failed to generate training plan. Please try again.");
  }

  // 4. Save
  const newPlan = await prisma.training_plans.create({
    data: {
      user_id: userId,
      plan_json: planJson as any,
      plan_text: JSON.stringify(planJson, null, 2),
      version: nextVersion,
    },
  });

  return {
    id: newPlan.id,
    version: newPlan.version,
    createdAt: newPlan.created_at,
  };
};

export const fetchCurrentPlan = async (userId: string) => {
  const plan = await prisma.training_plans.findFirst({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });

  if (!plan) {
    throw new Error("No plan found");
  }

  return {
    id: plan.id,
    userId: plan.user_id,
    planJson: plan.plan_json,
    planText: plan.plan_text,
    version: plan.version,
    createdAt: plan.created_at,
  };
};
