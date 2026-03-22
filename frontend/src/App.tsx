import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import "./index.css";
import { authClient } from "./lib/auth";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <NeonAuthUIProvider authClient={authClient} defaultTheme="dark">
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth/:pathname" element={<Auth />} />
              <Route path="/account/:pathname" element={<Account />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </NeonAuthUIProvider>
  );
}
