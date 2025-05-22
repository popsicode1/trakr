
import React from 'react';
import { Moon, Sun, MessageSquare, Settings, Lightbulb, X } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PersonalityQuiz } from './features/PersonalityQuiz';
import { BehavioralStreaks } from './features/BehavioralStreaks';
import { ShameFreeMode } from './features/ShameFreeMode';
import { GamifiedFeatures } from './features/GamifiedFeatures';
import { MindfulAddons } from './features/MindfulAddons';

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (page: string) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ open, onOpenChange, onNavigate }) => {
  const { theme, setTheme } = useTheme();

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle>Menu</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col p-4 h-full overflow-auto">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigate('ai-advisor')}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Financial AI Advisor
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigate('tools')}
            >
              <Lightbulb className="mr-2 h-5 w-5" />
              Mini Tools
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigate('settings')}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <>
                  <Moon className="mr-2 h-5 w-5" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="mr-2 h-5 w-5" />
                  Light Mode
                </>
              )}
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">New Features</h3>
            
            <div className="rounded-lg border p-3">
              <h4 className="font-medium mb-2">Personality Quiz</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Discover if you're a Saver, Spender, Avoider, or Monk
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full" 
                onClick={() => handleNavigate('personality-quiz')}
              >
                Take Quiz
              </Button>
            </div>
            
            <div className="rounded-lg border p-3">
              <h4 className="font-medium mb-2">Behavioral Streaks</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Track your financial habits with daily streaks
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleNavigate('streaks')}
              >
                View Streaks
              </Button>
            </div>
            
            <div className="rounded-lg border p-3">
              <h4 className="font-medium mb-2">Shame-Free Mode</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Positive, non-judgmental financial guidance
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleNavigate('shame-free')}
              >
                Enable
              </Button>
            </div>
            
            <div className="rounded-lg border p-3">
              <h4 className="font-medium mb-2">Gamified Features</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Build a city, level up avatars, and more
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleNavigate('gamified')}
              >
                Explore
              </Button>
            </div>
            
            <div className="rounded-lg border p-3">
              <h4 className="font-medium mb-2">Mindful & Spiritual Add-Ons</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Connect finances with well-being
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleNavigate('mindful')}
              >
                Discover
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
