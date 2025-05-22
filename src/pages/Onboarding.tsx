
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, ArrowRight, Coins, Wallet, LeafyGreen, 
  MessageSquare, LineChart, Hourglass, Clock,
  Lock, Book, Target, Brain, Cloud, School 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

const features = [
  {
    title: "Smart Spending Path",
    description: "Visual roadmap of your ideal financial future based on your income, behavior, and goals.",
    icon: LineChart,
    color: "bg-blue-100 text-blue-700"
  },
  {
    title: "Wallet Management",
    description: "Keep track of different accounts and see your total balance.",
    icon: Wallet,
    color: "bg-green-100 text-green-700"
  },
  {
    title: "Carbon Footprint Tracking",
    description: "Understand the environmental impact of your spending habits.",
    icon: LeafyGreen,
    color: "bg-emerald-100 text-emerald-700"
  },
  {
    title: "Mindful Spending Mode",
    description: "Get helpful prompts before making large purchases.",
    icon: MessageSquare, 
    color: "bg-purple-100 text-purple-700"
  },
  {
    title: "Hourly Budget Tracking",
    description: "See where your money flows hour by hour and spot your spending patterns.",
    icon: Clock,
    color: "bg-amber-100 text-amber-700"
  },
  {
    title: "Stealth Mode & Privacy",
    description: "Hide sensitive financial information when in public with just one tap.",
    icon: Lock,
    color: "bg-slate-100 text-slate-700"
  },
  {
    title: "Financial Storytelling",
    description: "Journal your financial journey and reflect on spending decisions.",
    icon: Book,
    color: "bg-pink-100 text-pink-700"
  },
  {
    title: "Ultra-Precise Goals",
    description: "Break down financial goals into manageable sub-goals for better tracking.",
    icon: Target,
    color: "bg-red-100 text-red-700"
  }
];

// Fun tips for each screen
const funnyTips = [
  "Pro tip: Money can't buy happiness, but it can buy tacos... which is kind of the same thing.",
  "Remember: If you save enough money, you can pretend to be rich once a year!",
  "Fun fact: The average person spends 84,000 hours earning money and 15 minutes tracking it.",
  "Wallet pro tip: Put a picture of your ex where your money should be to remind you not to spend it.",
  "Financial wisdom: Always save money for a rainy day, especially if you've been meaning to buy an umbrella.",
  "Secret tip: The best time to start saving was yesterday. The second best time is after you finish that coffee.",
  "Budget hack: Classify your monthly shopping spree as 'professional development' in your expense tracker.",
  "Money management tip: If you can't afford it twice, you can't afford it once. Unless it's rent. Or food. Or..."
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { setHasCompletedOnboarding } = useAuth();
  
  const nextStep = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setHasCompletedOnboarding(true);
      navigate('/');
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    setHasCompletedOnboarding(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-primary rounded-full p-3 mb-4">
          <Sun className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-center">
          Welcome to Trakr
        </h1>
        <p className="text-muted-foreground text-center mt-2">
          Your personal finance companion that's actually enjoyable
        </p>
      </div>
      
      <Card className="w-full max-w-md relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / features.length) * 100}%` }}
          />
        </div>
        
        <CardContent className="pt-8 pb-6 px-6">
          <div className="flex justify-center mb-6">
            <div className={`rounded-full p-4 ${features[currentStep].color}`}>
              {(() => {
                const Icon = features[currentStep].icon;
                return <Icon className="h-8 w-8" />;
              })()}
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-3">
            {features[currentStep].title}
          </h2>
          
          <p className="text-center text-gray-600 mb-6">
            {features[currentStep].description}
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm italic text-gray-500">
              "{funnyTips[currentStep % funnyTips.length]}"
            </p>
          </div>
          
          <div className="flex justify-between">
            {currentStep > 0 ? (
              <Button 
                variant="outline"
                onClick={previousStep}
              >
                Back
              </Button>
            ) : (
              <Button 
                variant="ghost"
                onClick={skipOnboarding}
              >
                Skip Tour
              </Button>
            )}
            
            <Button 
              onClick={nextStep} 
            >
              {currentStep < features.length - 1 ? (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
          
          <div className="flex justify-center mt-6">
            {features.map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentStep ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
