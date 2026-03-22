import { createContext, useContext, useEffect, useRef, useState } from "react";

import { authClient } from "../lib/auth";
import type { TrainingPlan, User, UserProfile } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  //   plan: TrainingPlan | null;
  //   saveProfile: (
  //     profile: Omit<UserProfile, "userId" | "updatedAt">,
  //   ) => Promise<void>;
  //   generatePlan: () => Promise<void>;
  //   refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [neonUser, setNeonUser] = useState<any>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRefreshingRef = useRef(false);

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

  <AuthContext.Provider
    value={{
      user: neonUser,
      isLoading,
      //   plan,
      //   isLoading,
      //   saveProfile,
      //   generatePlan,
      //   refreshData,
    }}
  >
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
