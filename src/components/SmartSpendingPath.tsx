
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Edit, Plus, Target } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  amount: number;
  completed: boolean;
}

export default function SmartSpendingPath() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Pay off credit card debt', amount: 5000, completed: false },
    { id: '2', title: 'Build emergency fund', amount: 20000, completed: false },
    { id: '3', title: 'Save for laptop', amount: 35000, completed: false }
  ]);
  
  // Just for demo
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  
  const addNewGoal = () => {
    if (newGoalTitle && newGoalAmount) {
      const newGoal = {
        id: Date.now().toString(),
        title: newGoalTitle,
        amount: Number(newGoalAmount),
        completed: false
      };
      
      setGoals([...goals, newGoal]);
      setNewGoalTitle('');
      setNewGoalAmount('');
      setShowAddGoal(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Smart Spending Path</CardTitle>
            <CardDescription>Your financial roadmap to success</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAddGoal(!showAddGoal)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddGoal && (
          <div className="mb-4 p-3 border rounded-md bg-muted/30">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Goal Title</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g., New Laptop"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Amount (₱)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  placeholder="15000"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={addNewGoal}>
                  Add Goal
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="relative">
          {/* Path backbone */}
          <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-200"></div>
          
          {/* Goal steps */}
          <div className="space-y-6 py-2">
            {goals.map((goal, index) => (
              <div key={goal.id} className="flex items-start">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center ${goal.completed ? 'bg-green-100 border-green-500 text-green-500' : 'bg-white border-gray-300'}`}>
                  {index + 1}
                </div>
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{goal.title}</h4>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ₱{goal.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Target className="h-4 w-4 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Your future goals</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button className="w-full" variant="outline">
            Update Your Financial Path <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
