
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Streak = {
  id: string;
  name: string;
  currentStreak: number;
  lastCheckedDate: string; // ISO date string
  targetDays: number;
  history: string[]; // Array of ISO date strings
};

export const BehavioralStreaks = () => {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStreakName, setNewStreakName] = useState('');
  const [newStreakTarget, setNewStreakTarget] = useState(7);
  const { toast } = useToast();

  // Load streaks from localStorage on component mount
  useEffect(() => {
    const savedStreaks = localStorage.getItem('behavioralStreaks');
    if (savedStreaks) {
      setStreaks(JSON.parse(savedStreaks));
    } else {
      // Default streaks if none exist
      const defaultStreaks: Streak[] = [
        {
          id: '1',
          name: 'No Impulse Spending',
          currentStreak: 5,
          lastCheckedDate: new Date().toISOString().split('T')[0],
          targetDays: 7,
          history: Array(5).fill(0).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
          })
        },
        {
          id: '2',
          name: 'Daily Budget Check',
          currentStreak: 12,
          lastCheckedDate: new Date().toISOString().split('T')[0],
          targetDays: 14,
          history: Array(12).fill(0).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
          })
        }
      ];
      setStreaks(defaultStreaks);
      localStorage.setItem('behavioralStreaks', JSON.stringify(defaultStreaks));
    }
  }, []);

  // Save streaks to localStorage whenever they change
  useEffect(() => {
    if (streaks.length > 0) {
      localStorage.setItem('behavioralStreaks', JSON.stringify(streaks));
    }
  }, [streaks]);

  const handleAddStreak = () => {
    if (!newStreakName.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your streak.",
        variant: "destructive"
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newStreak: Streak = {
      id: Date.now().toString(),
      name: newStreakName,
      currentStreak: 1, // Start with 1 for today
      lastCheckedDate: today,
      targetDays: newStreakTarget,
      history: [today]
    };

    setStreaks(prev => [...prev, newStreak]);
    setIsAddDialogOpen(false);
    setNewStreakName('');
    setNewStreakTarget(7);
    
    toast({
      title: "Streak Started!",
      description: `You've started tracking "${newStreakName}". Keep it going!`,
    });
  };

  const checkStreak = (streakId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setStreaks(prev => prev.map(streak => {
      if (streak.id === streakId) {
        // Check if already checked today
        if (streak.lastCheckedDate === today) {
          toast({
            title: "Already Checked",
            description: "You've already checked in for today!",
          });
          return streak;
        }

        // Check if there's been a break in the streak (more than 1 day since last check)
        const lastDate = new Date(streak.lastCheckedDate);
        const currentDate = new Date(today);
        const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let newCurrentStreak = streak.currentStreak;
        let message = "Streak continued!";
        
        if (diffDays > 1) {
          // Streak broken
          newCurrentStreak = 1;
          message = "Streak reset. Starting fresh!";
        } else {
          // Streak continues
          newCurrentStreak = streak.currentStreak + 1;
          
          // Check if reached target
          if (newCurrentStreak === streak.targetDays) {
            toast({
              title: "🎉 Target Reached!",
              description: `Congratulations! You've reached your target of ${streak.targetDays} days!`,
            });
          }
        }
        
        toast({
          title: "Checked In",
          description: message,
        });
        
        return {
          ...streak,
          currentStreak: newCurrentStreak,
          lastCheckedDate: today,
          history: [...streak.history, today]
        };
      }
      return streak;
    }));
  };

  const deleteStreak = (streakId: string) => {
    setStreaks(prev => prev.filter(streak => streak.id !== streakId));
    toast({
      title: "Streak Deleted",
      description: "Your streak has been removed.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Behavioral Streaks Tracker</h2>
          <p>Build long-term positive financial habits</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> New Streak
        </Button>
      </div>
      
      <div className="mt-6 space-y-4">
        {streaks.map((streak) => (
          <div key={streak.id} className="bg-background border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{streak.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Current streak: {streak.currentStreak} days {streak.currentStreak >= 5 ? '🔥' : ''}
                </p>
              </div>
              <div className="bg-primary/10 text-primary p-2 rounded-full">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            
            <div className="mt-4 flex space-x-1">
              {Array(streak.targetDays).fill(null).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-full ${i < streak.currentStreak ? 'bg-primary' : 'bg-muted'}`} 
                />
              ))}
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => checkStreak(streak.id)}>
                <Check className="h-4 w-4 mr-1" /> Check In
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteStreak(streak.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        
        {streaks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No streaks yet. Create your first streak to get started!</p>
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Streak</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Streak Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., No Impulse Spending" 
                value={newStreakName}
                onChange={(e) => setNewStreakName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Days</Label>
              <Input 
                id="target" 
                type="number" 
                min={1}
                max={365}
                value={newStreakTarget}
                onChange={(e) => setNewStreakTarget(parseInt(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStreak}>Create Streak</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
