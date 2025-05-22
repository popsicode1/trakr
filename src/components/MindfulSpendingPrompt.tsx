
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Brain, ThumbsUp, ThumbsDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface MindfulSpendingPromptProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  onConfirm: (reflection: string) => void;
}

export default function MindfulSpendingPrompt({
  isOpen,
  onClose,
  amount,
  description,
  onConfirm,
}: MindfulSpendingPromptProps) {
  const [reflection, setReflection] = useState("");
  const [needScore, setNeedScore] = useState<number | null>(null);

  // Funny quotes about spending money
  const mindfulQuotes = [
    "Is this a want or a need? Or just a 'I saw it and now I can't live without it'?",
    "Your future self called. They're either thanking you or asking 'WHY?!'",
    "Remember: Money can't buy happiness... but it can buy tacos, which is basically the same thing.",
    "Ask yourself: Will this bring me more joy than the joy of seeing my bank account grow?",
    "Would you still want this if nobody knew you bought it?",
  ];

  const getRandomQuote = () => {
    return mindfulQuotes[Math.floor(Math.random() * mindfulQuotes.length)];
  };

  const handleSubmit = () => {
    onConfirm(reflection);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-purple-500" />
            Mindful Spending Moment
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-3">
          <div className="mb-4 p-3 bg-muted rounded-md">
            <p className="text-sm italic">{getRandomQuote()}</p>
          </div>
          
          <div className="mb-6">
            <p className="text-sm mb-2">
              You're about to spend <span className="font-bold">₱{amount.toLocaleString()}</span> on{" "}
              <span className="font-semibold">{description}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Take a moment to reflect on this purchase.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  How much do you need this purchase?
                </label>
                <div className="flex justify-between mt-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        needScore === score
                          ? "bg-primary text-white"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => setNeedScore(score)}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Not needed</span>
                  <span>Must have</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Why are you making this purchase?
                </label>
                <Textarea
                  placeholder="This will help you reflect on your spending decisions..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-center space-x-8 pt-2">
                <Button
                  variant="outline"
                  className="flex flex-col items-center w-28"
                  onClick={onClose}
                >
                  <ThumbsDown className="h-5 w-5 mb-1 text-red-500" />
                  <span>Skip This</span>
                </Button>
                <Button
                  className="flex flex-col items-center w-28"
                  onClick={handleSubmit}
                  disabled={!reflection}
                >
                  <ThumbsUp className="h-5 w-5 mb-1" />
                  <span>Continue</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
