
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HabitLinker from '@/components/HabitLinker';
import { Habit } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ChevronRightIcon, CheckCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

const HabitsTab: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  const handleHabitCreated = (habit: Habit) => {
    setHabits([...habits, habit]);
    setHabitLogs({...habitLogs, [habit.id]: 0});
  };
  
  const logHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    setHabitLogs({
      ...habitLogs,
      [habitId]: (habitLogs[habitId] || 0) + 1
    });
    
    toast({
      title: "Habit logged!",
      description: `You saved $${habit.savingsAmount.toFixed(2)} by sticking to your habit!`,
    });
  };
  
  const calculateTotalSaved = () => {
    return habits.reduce((total, habit) => {
      return total + (habitLogs[habit.id] || 0) * habit.savingsAmount;
    }, 0);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Habit-Linked Savings</CardTitle>
          <CardDescription>
            Connect your lifestyle habits with financial goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HabitLinker onHabitCreated={handleHabitCreated} habits={habits} />
        </CardContent>
      </Card>
      
      {habits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Habit Tracker</CardTitle>
            <CardDescription>
              Track your progress and savings from lifestyle changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-2xl font-bold">${calculateTotalSaved().toFixed(2)}</div>
              <div className="text-sm text-gray-500">Total saved through habits</div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              {habits.map(habit => {
                const logCount = habitLogs[habit.id] || 0;
                const totalSaved = logCount * habit.savingsAmount;
                
                return (
                  <div key={habit.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{habit.name}</h4>
                        {habit.description && (
                          <p className="text-sm text-gray-500">{habit.description}</p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => logHabit(habit.id)}>
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Log
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div>
                        <div className="text-gray-500">Times logged</div>
                        <div className="font-medium">{logCount} times</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total saved</div>
                        <div className="font-medium">${totalSaved.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    {habit.linkedAction && (
                      <div className="mt-2 bg-slate-50 text-xs p-2 rounded">
                        <span className="text-gray-500">Alternative: </span> 
                        {habit.linkedAction}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HabitsTab;
