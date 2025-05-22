
import React, { useState } from 'react';
import { PlusIcon, SaveIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { defaultCategories } from '@/lib/data';
import { Habit } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface HabitLinkerProps {
  onHabitCreated: (habit: Habit) => void;
  habits: Habit[];
}

const HabitLinker: React.FC<HabitLinkerProps> = ({ onHabitCreated, habits }) => {
  const [open, setOpen] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitDesc, setHabitDesc] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  const [targetCategory, setTargetCategory] = useState('');
  const [linkedAction, setLinkedAction] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!habitName || !savingsAmount || !targetCategory) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitName,
      description: habitDesc,
      savingsAmount: parseFloat(savingsAmount),
      targetCategory,
      linkedAction,
      createdAt: new Date(),
      active: true,
    };
    
    onHabitCreated(newHabit);
    setOpen(false);
    resetForm();
    
    toast({
      title: "Habit created",
      description: "Your habit has been linked to savings",
    });
  };
  
  const resetForm = () => {
    setHabitName('');
    setHabitDesc('');
    setSavingsAmount('');
    setTargetCategory('');
    setLinkedAction('');
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <PlusIcon className="h-4 w-4" /> Link a Habit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Link a Habit to Savings</DialogTitle>
            <DialogDescription>
              Connect lifestyle habits with financial goals. Every time you skip an expense, you can add to your savings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="habit-name" className="text-sm font-medium">Habit name</label>
              <Input
                id="habit-name"
                placeholder="Skip milk tea"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="habit-desc" className="text-sm font-medium">Description (optional)</label>
              <Textarea
                id="habit-desc"
                placeholder="Skip buying milk tea on weekdays"
                value={habitDesc}
                onChange={(e) => setHabitDesc(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="savings-amount" className="text-sm font-medium">Amount saved</label>
                <Input
                  id="savings-amount"
                  type="number"
                  placeholder="150"
                  value={savingsAmount}
                  onChange={(e) => setSavingsAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">Save to category</label>
                <Select value={targetCategory} onValueChange={setTargetCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultCategories
                      .filter(cat => cat.type === 'income' || cat.type === 'both')
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="linked-action" className="text-sm font-medium">Action (optional)</label>
              <Input
                id="linked-action"
                placeholder="Make coffee at home instead"
                value={linkedAction}
                onChange={(e) => setLinkedAction(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Habit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Linked Habits List */}
      {habits.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Your Linked Habits</h3>
          <div className="space-y-2">
            {habits.map(habit => (
              <div key={habit.id} className="bg-white border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-sm">{habit.name}</h4>
                  <p className="text-xs text-gray-500">
                    Save ${habit.savingsAmount.toFixed(2)} each time
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <SaveIcon className="h-4 w-4" />
                  <span className="ml-1">Log</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitLinker;
