
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface PastDecision {
  amount: number;
  description: string;
  date: Date;
  regretted: boolean;
}

export default function MindfulSpendingMode() {
  const [mindfulModeEnabled, setMindfulModeEnabled] = useState(true);
  const [threshold, setThreshold] = useState(1000);
  
  const [pastDecisions, _] = useState<PastDecision[]>([
    { 
      amount: 2500, 
      description: "New headphones", 
      date: new Date(2023, 4, 15), 
      regretted: false 
    },
    { 
      amount: 1500, 
      description: "Dining out", 
      date: new Date(2023, 4, 10), 
      regretted: true 
    },
    { 
      amount: 3000, 
      description: "Concert tickets", 
      date: new Date(2023, 4, 5), 
      regretted: false 
    }
  ]);
  
  // Calculate regret percentage
  const regrettedCount = pastDecisions.filter(d => d.regretted).length;
  const regretPercentage = Math.round((regrettedCount / pastDecisions.length) * 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Brain className="mr-2 h-5 w-5 text-purple-500" />
          Mindful Spending Mode
        </CardTitle>
        <CardDescription>
          Be more intentional with your spending
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Mindful Prompts</span>
          <div className="flex items-center">
            <div 
              className={`relative h-6 w-12 rounded-full transition-colors ${mindfulModeEnabled ? 'bg-purple-600' : 'bg-gray-200'}`}
              onClick={() => setMindfulModeEnabled(!mindfulModeEnabled)}
            >
              <div 
                className={`absolute h-5 w-5 rounded-full bg-white top-0.5 transition-transform ${mindfulModeEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} 
                style={{ marginLeft: mindfulModeEnabled ? '0' : '0' }}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt for purchases above</label>
          <div className="flex items-center space-x-2">
            <span className="text-xl">₱</span>
            <input 
              type="number" 
              className="border rounded px-3 py-1 w-24 text-lg" 
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="mb-2 font-medium">Your Spending Reflection</h3>
          
          <div className="bg-muted/30 p-3 rounded-md mb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Regret Rate</p>
                <p className="text-2xl font-bold">{regretPercentage}%</p>
              </div>
              <div className="text-4xl">
                {regretPercentage > 30 ? "😬" : "😊"}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {regretPercentage > 30 
                ? "Try spending more mindfully to reduce this rate" 
                : "Great job making intentional purchases!"}
            </p>
          </div>
          
          <h4 className="text-sm font-medium mb-2">Recent Purchase Reflections</h4>
          <div className="space-y-3">
            {pastDecisions.map((decision, index) => (
              <div key={index} className="flex justify-between text-sm border-b pb-2">
                <div>
                  <p className="font-medium">{decision.description}</p>
                  <p className="text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {decision.date.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">₱{decision.amount}</span>
                  {decision.regretted ? (
                    <ThumbsDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Button variant="outline" className="w-full">
          View All Reflections
        </Button>
      </CardContent>
    </Card>
  );
}
