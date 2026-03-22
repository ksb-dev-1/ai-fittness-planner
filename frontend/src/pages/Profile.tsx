import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const plan = false;

  // Redirect authenticated users to profile
  if (!isLoading && user) {
    return <Navigate to="/profile" replace />;
  }

  if (!plan) {
    return <Navigate to="/onboarding" replace />;
  }

  return <div>Profile</div>;
}
