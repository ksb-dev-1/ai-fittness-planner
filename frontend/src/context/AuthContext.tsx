import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { api } from "../lib/api";
import { authClient } from "../lib/auth";
import type { TrainingPlan, User, UserProfile } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  saveProfile: (
    profile: Omit<UserProfile, "userId" | "updatedAt">,
  ) => Promise<void>;
  generatePlan: () => Promise<void>;
  refreshData: () => Promise<void>;
  plan: TrainingPlan | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [neonUser, setNeonUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const isRefreshingRef = useRef(false);

  console.log(plan);

  useEffect(() => {
    async function loadUser() {
      try {
        const result = await authClient.getSession();

        if (result && result.data?.user) {
          setNeonUser(result.data.user);
        } else {
          setNeonUser(null);
        }
      } catch (err) {
        setNeonUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (neonUser?.id) {
        refreshData();
      } else {
        setPlan(null);
      }
      setIsLoading(false);
    }
  }, [neonUser?.id, isLoading]);

  const refreshData = useCallback(async () => {
    if (!neonUser || isRefreshingRef.current) return;

    isRefreshingRef.current = true;

    try {
      // Fetch Plan
      const planData = await api.getCurrentPlan(neonUser.id);

      if (planData) {
        setPlan({
          id: planData.id,
          userId: planData.userId,
          overview: planData.planJson.overview,
          weeklySchedule: planData.planJson.weeklySchedule,
          progression: planData.planJson.progression,
          version: planData.version,
          createdAt: planData.createdAt,
        });
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [neonUser?.id]);

  async function saveProfile(
    profileData: Omit<UserProfile, "userId" | "updatedAt">,
  ) {
    if (!neonUser) {
      throw new Error("User must be authenticated to save profile");
    }

    await api.saveProfile(neonUser.id, profileData);
    await refreshData();
  }

  async function generatePlan() {
    if (!neonUser) {
      throw new Error("User must be authenticated to generate plan");
    }

    await api.generatePlan(neonUser.id);
    await refreshData();
  }

  return (
    <AuthContext.Provider
      value={{
        user: neonUser,
        isLoading,
        saveProfile,
        generatePlan,
        refreshData,
        plan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
