
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, isOnboardingCompleted } from "@/lib/auth";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}

const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  requireOnboarding = false 
}: AuthGuardProps) => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const onboardingComplete = isOnboardingCompleted();

  useEffect(() => {
    // Logic for auth and onboarding redirection
    if (requireAuth && !loggedIn) {
      navigate("/login");
      return;
    }

    if (requireOnboarding && !onboardingComplete && loggedIn) {
      navigate("/onboarding");
      return;
    }

    if (loggedIn && onboardingComplete && window.location.pathname === "/login") {
      navigate("/");
      return;
    }

  }, [loggedIn, onboardingComplete, navigate, requireAuth, requireOnboarding]);

  // If we're on a protected route and not logged in, don't render anything
  if (requireAuth && !loggedIn) {
    return null;
  }

  // Render children if auth requirements are met
  return <>{children}</>;
};

export default AuthGuard;
