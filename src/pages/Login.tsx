
import { Sun } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={hasCompletedOnboarding ? '/' : '/onboarding'} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-primary rounded-full p-3 mb-4 shadow-lg">
          <Sun className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-center tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Trakr
        </h1>
        <p className="text-muted-foreground text-center mt-2 max-w-md">
          Take control of your finances with the app that makes money management enjoyable
        </p>
      </div>
      
      <LoginForm />
      
      <div className="mt-12 text-center max-w-md text-sm text-gray-500">
        <p>By using Trakr, you gain insights into your spending habits, set financial goals, and make better money decisions.</p>
        <p className="mt-2">Your data is securely stored and never shared with third parties.</p>
      </div>
    </div>
  );
}
