import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Trophy, Heart, Coins, BookOpen } from 'lucide-react';

type PersonalityType = 'saver' | 'spender' | 'avoider' | 'monk' | null;

type Question = {
  id: number;
  text: string;
  options: {
    value: PersonalityType;
    text: string;
  }[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "When you receive extra money unexpectedly, what do you typically do?",
    options: [
      { value: 'saver', text: 'Save most or all of it' },
      { value: 'spender', text: 'Treat yourself to something nice' },
      { value: 'avoider', text: "You're not sure where it went" },
      { value: 'monk', text: 'Donate it or use it minimally' }
    ]
  },
  {
    id: 2,
    text: "How often do you check your bank account?",
    options: [
      { value: 'saver', text: 'Daily or multiple times per week' },
      { value: 'spender', text: 'When making purchase decisions' },
      { value: 'avoider', text: 'Rarely, it causes anxiety' },
      { value: 'monk', text: 'Only when necessary, money is not a focus' }
    ]
  },
  {
    id: 3,
    text: "What's your approach to budgeting?",
    options: [
      { value: 'saver', text: 'Detailed budgets with specific categories' },
      { value: 'spender', text: 'Loose guidelines that still allow for fun' },
      { value: 'avoider', text: 'You try but often abandon budgets' },
      { value: 'monk', text: 'Minimal spending by default, no budget needed' }
    ]
  }
];

const personalityDescriptions = {
  saver: {
    title: 'The Saver',
    description: 'You prioritize financial security and future goals. You derive satisfaction from watching your savings grow.',
    icon: Trophy,
    tips: 'Remember to occasionally enjoy the present while building for the future.'
  },
  spender: {
    title: 'The Spender',
    description: 'You appreciate the joy that experiences and purchases can bring. You live in the moment and enjoy what money can do.',
    icon: Heart,
    tips: 'Try setting aside a small percentage for savings before spending on enjoyment.'
  },
  avoider: {
    title: 'The Avoider',
    description: "You tend to keep financial matters at arm's length, preferring not to think about money details too often.",
    icon: BookOpen,
    tips: 'Start with small, manageable financial tasks before tackling bigger issues.'
  },
  monk: {
    title: 'The Monk',
    description: 'You have a minimalist relationship with money, seeing it as a tool rather than a goal. Material possessions matter little to you.',
    icon: Coins,
    tips: "Your mindful approach is powerful, but ensure you're planning adequately for future needs."
  }
};

export const PersonalityQuiz = () => {
  const [answers, setAnswers] = useState<Record<number, PersonalityType>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState<PersonalityType>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();

  const handleAnswerSelect = (questionId: number, answer: PersonalityType) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResult = () => {
    const counts: Record<string, number> = {
      saver: 0,
      spender: 0,
      avoider: 0,
      monk: 0
    };
    
    Object.values(answers).forEach(answer => {
      if (answer) counts[answer]++;
    });
    
    let maxCount = 0;
    let personalityResult: PersonalityType = null;
    
    (Object.keys(counts) as Array<Exclude<PersonalityType, null>>).forEach(personality => {
      if (counts[personality] > maxCount) {
        maxCount = counts[personality];
        personalityResult = personality;
      }
    });
    
    setResult(personalityResult);
    setQuizCompleted(true);
    
    // Store personality type in localStorage for app-wide use
    if (personalityResult) {
      localStorage.setItem('financialPersonality', personalityResult);
      toast({
        title: "Personality Quiz Completed!",
        description: `You are ${personalityDescriptions[personalityResult].title}. The app will now adapt to your style.`,
      });
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setQuizCompleted(false);
  };

  const currentQuestionData = questions[currentQuestion];
  const selectedAnswer = currentQuestionData ? answers[currentQuestionData.id] : null;
  
  if (quizCompleted && result) {
    const personality = personalityDescriptions[result];
    
    return (
      <div className="space-y-6">
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <personality.icon className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{personality.title}</h2>
          <p className="mb-6">{personality.description}</p>
          
          <div className="bg-muted p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">Personalized Tip:</h3>
            <p>{personality.tips}</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Your financial app experience will now be tailored to your personality type.</p>
            <Button onClick={resetQuiz}>Retake Quiz</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Financial Personality Quiz</h2>
      <p>Discover if you're a Saver, Spender, Avoider, or Monk</p>
      
      <div className="space-y-6 mt-4">
        {currentQuestionData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
            </div>
            
            <h3 className="font-medium">{currentQuestionData.text}</h3>
            <div className="space-y-3">
              {currentQuestionData.options.map((option) => (
                <div 
                  key={option.value} 
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAnswer === option.value ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestionData.id, option.value)}
                >
                  <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
                    selectedAnswer === option.value ? 'bg-primary' : 'border border-gray-400'
                  }`} />
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            {currentQuestion < questions.length - 1 ? 'Next' : 'See Results'}
          </Button>
        </div>
      </div>
    </div>
  );
};
