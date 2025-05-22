import React, { useState, useEffect } from 'react';
import { Building2, Trophy, Gamepad2, Award, Star, Zap, Crown, Rocket, MapPin, Heart, Building, CircleDashed } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type BuildingType = {
  id: number;
  name: string;
  cost: number;
  unlocked: boolean;
  description: string;
};

type AvatarLevel = {
  level: number;
  xpRequired: number;
  reward: string;
  unlocked: boolean;
};

type Challenge = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
};

export const GamifiedFeatures = () => {
  const [savings, setSavings] = useState(0);
  const [virtualCity, setVirtualCity] = useState<BuildingType[]>([]);
  const [avatarXp, setAvatarXp] = useState(0);
  const [avatarLevels, setAvatarLevels] = useState<AvatarLevel[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showCityDialog, setShowCityDialog] = useState(false);
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  
  const { toast } = useToast();

  // Initialize game data
  useEffect(() => {
    // Load data from localStorage if available
    const savedSavings = localStorage.getItem('gamifiedSavings');
    if (savedSavings) setSavings(Number(savedSavings));
    
    const savedCity = localStorage.getItem('virtualCity');
    if (savedCity) {
      setVirtualCity(JSON.parse(savedCity));
    } else {
      // Initialize default city buildings
      const defaultBuildings: BuildingType[] = [
        { id: 1, name: 'Small House', cost: 500, unlocked: false, description: 'A cozy starter home for your virtual city' },
        { id: 2, name: 'Local Shop', cost: 1000, unlocked: false, description: 'A small business to serve the community' },
        { id: 3, name: 'Park', cost: 1500, unlocked: false, description: 'A green space for recreation' },
        { id: 4, name: 'Community Center', cost: 2500, unlocked: false, description: 'A hub for local events and gatherings' },
        { id: 5, name: 'School', cost: 5000, unlocked: false, description: 'Education for your virtual citizens' }
      ];
      setVirtualCity(defaultBuildings);
    }
    
    const savedXp = localStorage.getItem('avatarXp');
    if (savedXp) setAvatarXp(Number(savedXp));
    
    const savedLevels = localStorage.getItem('avatarLevels');
    if (savedLevels) {
      setAvatarLevels(JSON.parse(savedLevels));
    } else {
      // Initialize default avatar levels
      const defaultLevels: AvatarLevel[] = [
        { level: 1, xpRequired: 0, reward: 'Beginner Badge', unlocked: true },
        { level: 2, xpRequired: 100, reward: 'Casual Outfit', unlocked: false },
        { level: 3, xpRequired: 250, reward: 'Saver Badge', unlocked: false },
        { level: 4, xpRequired: 500, reward: 'Office Outfit', unlocked: false },
        { level: 5, xpRequired: 1000, reward: 'Financial Wizard Hat', unlocked: false }
      ];
      setAvatarLevels(defaultLevels);
    }
    
    const savedChallenges = localStorage.getItem('financialChallenges');
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    } else {
      // Initialize default challenges
      const defaultChallenges: Challenge[] = [
        { 
          id: 1, 
          title: 'Space Station Repairs', 
          description: 'You\'re stuck on a space station and need to save 1000 credits for repairs. Track your actual savings to progress!', 
          completed: false,
          xpReward: 200
        },
        { 
          id: 2, 
          title: 'Dragon\'s Treasure', 
          description: 'Collect 500 gold coins (real savings) to defeat the budget dragon and claim the treasure!', 
          completed: false,
          xpReward: 150
        },
        { 
          id: 3, 
          title: 'Desert Caravan', 
          description: 'Your caravan needs supplies worth 750 coins to cross the desert. Save up to continue your journey!', 
          completed: false,
          xpReward: 175
        }
      ];
      setChallenges(defaultChallenges);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('gamifiedSavings', String(savings));
  }, [savings]);

  useEffect(() => {
    if (virtualCity.length > 0) {
      localStorage.setItem('virtualCity', JSON.stringify(virtualCity));
    }
  }, [virtualCity]);

  useEffect(() => {
    localStorage.setItem('avatarXp', String(avatarXp));
  }, [avatarXp]);

  useEffect(() => {
    if (avatarLevels.length > 0) {
      localStorage.setItem('avatarLevels', JSON.stringify(avatarLevels));
    }
  }, [avatarLevels]);

  useEffect(() => {
    if (challenges.length > 0) {
      localStorage.setItem('financialChallenges', JSON.stringify(challenges));
    }
  }, [challenges]);

  const addSavings = (amount: number) => {
    setSavings(prev => {
      const newAmount = prev + amount;
      
      // Check if any buildings can be unlocked
      const updatedCity = virtualCity.map(building => {
        if (!building.unlocked && newAmount >= building.cost) {
          toast({
            title: "New Building Unlocked!",
            description: `You've unlocked the ${building.name} for your virtual city!`,
          });
          return { ...building, unlocked: true };
        }
        return building;
      });
      setVirtualCity(updatedCity);
      
      // Check if any challenges are completed
      const updatedChallenges = challenges.map(challenge => {
        if (!challenge.completed) {
          const challengeCost = parseInt(challenge.description.match(/\d+/)?.[0] || '0');
          if (newAmount >= challengeCost) {
            toast({
              title: "Challenge Completed!",
              description: `You've completed "${challenge.title}" and earned ${challenge.xpReward} XP!`,
            });
            
            // Award XP
            setAvatarXp(prev => prev + challenge.xpReward);
            
            return { ...challenge, completed: true };
          }
        }
        return challenge;
      });
      setChallenges(updatedChallenges);
      
      return newAmount;
    });
  };

  // Check for level ups whenever XP changes
  useEffect(() => {
    const updatedLevels = avatarLevels.map((level, index) => {
      if (!level.unlocked && avatarXp >= level.xpRequired) {
        toast({
          title: `Level ${level.level} Unlocked!`,
          description: `You've reached level ${level.level} and unlocked: ${level.reward}!`,
        });
        return { ...level, unlocked: true };
      }
      return level;
    });
    setAvatarLevels(updatedLevels);
  }, [avatarXp, toast]);

  const getCurrentLevel = () => {
    let currentLevel = 1;
    for (const level of avatarLevels) {
      if (level.unlocked) {
        currentLevel = level.level;
      } else {
        break;
      }
    }
    return currentLevel;
  };

  const getNextLevelXp = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = avatarLevels.find(level => level.level === currentLevel + 1);
    return nextLevel ? nextLevel.xpRequired : avatarXp;
  };

  const getXpProgress = () => {
    const currentLevel = getCurrentLevel();
    const currentLevelData = avatarLevels.find(level => level.level === currentLevel);
    const nextLevelData = avatarLevels.find(level => level.level === currentLevel + 1);
    
    if (!nextLevelData) return 100;
    
    const currentLevelXp = currentLevelData ? currentLevelData.xpRequired : 0;
    const nextLevelXp = nextLevelData.xpRequired;
    const xpForNextLevel = nextLevelXp - currentLevelXp;
    const progressInLevel = avatarXp - currentLevelXp;
    
    return Math.min(Math.floor((progressInLevel / xpForNextLevel) * 100), 100);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Ultra Gamified Features</h2>
      <p>Making finance fun through interactive experiences</p>
      
      <div className="bg-muted p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Your Savings</span>
          <span className="font-bold">₱{savings.toLocaleString()}</span>
        </div>
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={() => addSavings(100)}>+₱100</Button>
          <Button size="sm" variant="outline" onClick={() => addSavings(500)}>+₱500</Button>
          <Button size="sm" variant="outline" onClick={() => addSavings(1000)}>+₱1000</Button>
        </div>
      </div>
      
      <div className="grid gap-4 mt-6">
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Build-a-City with Savings</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Save ₱500 to add a new building to your virtual town. Watch your savings transform into a thriving city!
              </p>
              <div className="mt-2">
                <Button 
                  className="text-sm" 
                  variant="link" 
                  onClick={() => setShowCityDialog(true)}
                >
                  View City ({virtualCity.filter(b => b.unlocked).length}/{virtualCity.length} buildings)
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Level Up Your Avatar</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Hit financial goals to earn XP. Level up and unlock new badges or outfits for your character.
              </p>
              
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Level {getCurrentLevel()}</span>
                  <span>{avatarXp} / {getNextLevelXp()} XP</span>
                </div>
                <Progress value={getXpProgress()} className="h-2" />
              </div>
              
              <div className="mt-2">
                <Button 
                  className="text-sm" 
                  variant="link" 
                  onClick={() => setShowAvatarDialog(true)}
                >
                  See Avatar & Rewards
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Narrative Challenges</h3>
              <p className="text-sm text-muted-foreground mt-1">
                "You're stuck on a space station and need to save for repairs. Spend wisely!" Budgeting gamified like an RPG.
              </p>
              <div className="mt-2">
                <Button 
                  className="text-sm" 
                  variant="link"
                  onClick={() => setShowChallengeDialog(true)}
                >
                  Start Adventure ({challenges.filter(c => c.completed).length}/{challenges.length} completed)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Avatar Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Financial Avatar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Award className="h-24 w-24 text-primary" />
                <div className="absolute bottom-0 right-0 bg-background rounded-full border-2 border-primary w-6 h-6 flex items-center justify-center font-bold">
                  {getCurrentLevel()}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-medium">Level {getCurrentLevel()} Financial Hero</h3>
              <p className="text-sm text-muted-foreground mt-1">{avatarXp} total XP</p>
            </div>
            
            <div className="space-y-3 mt-4">
              <h4 className="font-medium">Rewards Unlocked:</h4>
              <ul className="space-y-2">
                {avatarLevels.map(level => (
                  <li key={level.level} className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${level.unlocked ? 'bg-primary' : 'border border-muted-foreground'}`} />
                    <span className={level.unlocked ? '' : 'text-muted-foreground'}>
                      Level {level.level}: {level.reward}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* City Dialog */}
      <Dialog open={showCityDialog} onOpenChange={setShowCityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Virtual City</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">Buildings unlocked with your savings:</p>
            
            <div className="space-y-3 mt-4">
              {virtualCity.map(building => (
                <div 
                  key={building.id} 
                  className={`p-3 rounded-lg border ${building.unlocked ? 'bg-primary/5 border-primary' : 'bg-muted opacity-70'}`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{building.name}</h4>
                    <span className="text-sm">₱{building.cost.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{building.description}</p>
                  {!building.unlocked && (
                    <div className="mt-2">
                      <Progress value={(savings / building.cost) * 100} className="h-1" />
                      <p className="text-xs mt-1">
                        Progress: ₱{savings.toLocaleString()} / ₱{building.cost.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Challenge Dialog */}
      <Dialog open={showChallengeDialog} onOpenChange={setShowChallengeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Narrative Challenges</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">Complete savings challenges to earn XP!</p>
            
            <div className="space-y-3 mt-4">
              {challenges.map(challenge => (
                <div 
                  key={challenge.id} 
                  className={`p-3 rounded-lg border ${challenge.completed ? 'bg-primary/5 border-primary' : 'border-muted'}`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <span className="text-sm">{challenge.xpReward} XP</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                  
                  {challenge.completed ? (
                    <div className="mt-2 flex items-center text-primary">
                      <CircleDashed className="h-4 w-4 mr-1" />
                      <span className="text-sm">Completed!</span>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Progress 
                        value={(savings / parseInt(challenge.description.match(/\d+/)?.[0] || '1000')) * 100} 
                        className="h-1" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
