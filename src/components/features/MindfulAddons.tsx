import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

type JournalEntry = {
  id: string;
  date: string;
  expense: string;
  amount: number;
  emotions: string;
  worth: number;
  lessons: string;
};

type FutureYouMessage = {
  id: number;
  title: string;
  message: string;
  read: boolean;
};

type MeditationSession = {
  id: number;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
};

export const MindfulAddons = () => {
  const [showJournalDialog, setShowJournalDialog] = useState(false);
  const [showLetterDialog, setShowLetterDialog] = useState(false);
  const [showMeditationDialog, setShowMeditationDialog] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [futureMessages, setFutureMessages] = useState<FutureYouMessage[]>([]);
  const [meditations, setMeditations] = useState<MeditationSession[]>([]);
  
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTime, setMeditationTime] = useState(0);
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationSession | null>(null);
  
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    expense: '',
    amount: 0,
    emotions: '',
    worth: 5,
    lessons: ''
  });
  
  const { toast } = useToast();
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries));
    }
    
    const savedMessages = localStorage.getItem('futureYouMessages');
    if (savedMessages) {
      setFutureMessages(JSON.parse(savedMessages));
    } else {
      // Default messages
      const defaultMessages = [
        {
          id: 1,
          title: "Thanks for saving for my education",
          message: "Dear Past Self, I'm writing this letter from 10 years in the future. That decision you made to start saving 10% of each paycheck for education? It changed everything. I was able to take that specialized course that led to my dream career. Every time you resisted an impulse purchase, you were really investing in a version of us that is now thriving. Thank you for thinking of me.",
          read: false
        },
        {
          id: 2,
          title: "The debt-free life is worth it",
          message: "Hello from a debt-free future! Remember those days when we were juggling multiple payments and feeling the weight of financial obligations? Your dedication to paying off that debt—even when friends were spending on luxuries—led to this incredible freedom I enjoy today. Financial peace feels even better than those temporary purchases would have. Stay strong!",
          read: false
        },
        {
          id: 3,
          title: "Our emergency fund saved us",
          message: "You won't believe what happened last month—that emergency fund you've been building saved us during an unexpected job transition. Instead of panic, I felt prepared. Those small deposits you're making now created a shield of security that protected our family when we needed it most. Every penny was worth it.",
          read: false
        }
      ];
      setFutureMessages(defaultMessages);
    }
    
    const savedMeditations = localStorage.getItem('meditationSessions');
    if (savedMeditations) {
      setMeditations(JSON.parse(savedMeditations));
    } else {
      // Default meditation sessions
      const defaultMeditations = [
        {
          id: 1,
          title: "Financial Anxiety Release",
          description: "A guided meditation to help release worry about money and create a sense of abundance and possibility.",
          duration: 300, // 5 minutes in seconds
          completed: false
        },
        {
          id: 2,
          title: "Mindful Spending Intention",
          description: "Set clear intentions about your relationship with money and spending before making financial decisions.",
          duration: 180, // 3 minutes in seconds
          completed: false
        },
        {
          id: 3,
          title: "Gratitude for What You Have",
          description: "Focus on appreciating what you already have rather than what you lack, reducing materialistic desires.",
          duration: 240, // 4 minutes in seconds
          completed: false
        }
      ];
      setMeditations(defaultMeditations);
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (journalEntries.length > 0) {
      localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }
  }, [journalEntries]);
  
  useEffect(() => {
    if (futureMessages.length > 0) {
      localStorage.setItem('futureYouMessages', JSON.stringify(futureMessages));
    }
  }, [futureMessages]);
  
  useEffect(() => {
    if (meditations.length > 0) {
      localStorage.setItem('meditationSessions', JSON.stringify(meditations));
    }
  }, [meditations]);
  
  // Meditation timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (meditationActive && selectedMeditation) {
      interval = window.setInterval(() => {
        setMeditationTime(prevTime => {
          if (prevTime >= selectedMeditation.duration) {
            setMeditationActive(false);
            completeMeditation();
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [meditationActive, selectedMeditation]);
  
  const completeMeditation = () => {
    if (!selectedMeditation) return;
    
    // Mark meditation as completed
    const updatedMeditations = meditations.map(med => 
      med.id === selectedMeditation.id ? { ...med, completed: true } : med
    );
    setMeditations(updatedMeditations);
    
    toast({
      title: "Meditation Complete",
      description: `You've completed "${selectedMeditation.title}" meditation. Great job!`,
    });
  };
  
  const addJournalEntry = () => {
    if (!newEntry.expense || !newEntry.emotions || !newEntry.lessons) {
      toast({
        title: "Incomplete Entry",
        description: "Please fill in all the required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      expense: newEntry.expense,
      amount: newEntry.amount || 0,
      emotions: newEntry.emotions,
      worth: newEntry.worth || 5,
      lessons: newEntry.lessons
    };
    
    setJournalEntries(prev => [entry, ...prev]);
    setNewEntry({
      expense: '',
      amount: 0,
      emotions: '',
      worth: 5,
      lessons: ''
    });
    
    toast({
      title: "Journal Entry Added",
      description: "Your reflection has been saved to your spending journal.",
    });
    
    setShowJournalDialog(false);
  };
  
  const markMessageAsRead = (id: number) => {
    const updatedMessages = futureMessages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    );
    setFutureMessages(updatedMessages);
  };
  
  const startMeditation = (meditation: MeditationSession) => {
    setSelectedMeditation(meditation);
    setMeditationTime(0);
    setMeditationActive(true);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Mindful & Spiritual Add-Ons</h2>
      <p>Connect finances with your well-being</p>
      
      <div className="grid gap-4 mt-6">
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Gratitude Spending Journal</h3>
              <p className="text-sm text-muted-foreground mt-1">
                After big purchases, reflect: "Was this worth it? What did it give you emotionally?" Encourage mindful consumption.
              </p>
              <Button className="mt-3 text-sm" onClick={() => setShowJournalDialog(true)}>
                Open Journal {journalEntries.length > 0 && `(${journalEntries.length} entries)`}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">"Future You" Mode</h3>
              <p className="text-sm text-muted-foreground mt-1">
                See simulated letters from your future self based on current habits. "Thanks for quitting impulse spending!"
              </p>
              <Button 
                className="mt-3 text-sm" 
                onClick={() => setShowLetterDialog(true)}
              >
                Read Letter {futureMessages.filter(m => !m.read).length > 0 && 
                  `(${futureMessages.filter(m => !m.read).length} new)`}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Money + Meditation Integration</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Calm audio sessions that reflect on spending intentions, financial anxiety, or letting go of materialism.
              </p>
              <Button className="mt-3 text-sm" onClick={() => setShowMeditationDialog(true)}>
                Begin Session {meditations.filter(m => m.completed).length > 0 && 
                  `(${meditations.filter(m => m.completed).length}/${meditations.length} completed)`}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Journal Dialog */}
      <Dialog open={showJournalDialog} onOpenChange={setShowJournalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Gratitude Spending Journal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">What did you spend on?</label>
                <input 
                  type="text" 
                  className="w-full mt-1 p-2 border rounded" 
                  value={newEntry.expense}
                  onChange={(e) => setNewEntry({...newEntry, expense: e.target.value})}
                  placeholder="e.g., New headphones, dinner out"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">How much did it cost?</label>
                <input 
                  type="number" 
                  className="w-full mt-1 p-2 border rounded" 
                  value={newEntry.amount || ''}
                  onChange={(e) => setNewEntry({...newEntry, amount: parseInt(e.target.value) || 0})}
                  placeholder="Amount"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">What emotions did this purchase give you?</label>
                <Textarea 
                  className="mt-1" 
                  value={newEntry.emotions}
                  onChange={(e) => setNewEntry({...newEntry, emotions: e.target.value})}
                  placeholder="How did this purchase make you feel?"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Was it worth it? (1-10)</label>
                <div className="py-4">
                  <Slider 
                    value={[newEntry.worth || 5]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => setNewEntry({...newEntry, worth: value[0]})}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Not worth it</span>
                    <span>Very worth it</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">What did you learn from this experience?</label>
                <Textarea 
                  className="mt-1" 
                  value={newEntry.lessons}
                  onChange={(e) => setNewEntry({...newEntry, lessons: e.target.value})}
                  placeholder="What would you do differently next time?"
                />
              </div>
            </div>
            
            <Button className="w-full" onClick={addJournalEntry}>
              Save Journal Entry
            </Button>
            
            {journalEntries.length > 0 && (
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Previous Entries</h4>
                <div className="max-h-[200px] overflow-y-auto space-y-3">
                  {journalEntries.map(entry => (
                    <Card key={entry.id}>
                      <CardContent className="p-3">
                        <div className="flex justify-between">
                          <h5 className="font-medium">{entry.expense}</h5>
                          <span className="text-sm">${entry.amount.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                        <p className="text-sm mt-2">
                          <span className="font-medium">Worth it score:</span> {entry.worth}/10
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Future You Letters Dialog */}
      <Dialog open={showLetterDialog} onOpenChange={setShowLetterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Letters from Future You</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {futureMessages.map(message => (
              <Card 
                key={message.id} 
                className={!message.read ? 'border-primary' : ''}
                onClick={() => markMessageAsRead(message.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{message.title}</h4>
                    {!message.read && <div className="h-2 w-2 bg-primary rounded-full"></div>}
                  </div>
                  <p className="text-sm mt-2">{message.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Meditation Dialog */}
      <Dialog open={showMeditationDialog} onOpenChange={(open) => {
        if (!open && meditationActive) {
          if (!confirm("Your meditation session is still in progress. Are you sure you want to exit?")) {
            return;
          }
          setMeditationActive(false);
        }
        setShowMeditationDialog(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Financial Meditations</DialogTitle>
          </DialogHeader>
          
          {meditationActive && selectedMeditation ? (
            <div className="space-y-6 py-8 text-center">
              <h3 className="text-xl font-medium">{selectedMeditation.title}</h3>
              
              <div className="flex flex-col items-center">
                <div className="text-4xl font-mono mb-4">
                  {formatTime(meditationTime)} / {formatTime(selectedMeditation.duration)}
                </div>
                
                <Progress 
                  value={(meditationTime / selectedMeditation.duration) * 100} 
                  className="h-2 w-full max-w-xs"
                />
                
                <p className="mt-4 text-sm text-muted-foreground px-4">
                  {selectedMeditation.description}
                </p>
              </div>
              
              <Button 
                variant={meditationActive ? "destructive" : "default"} 
                onClick={() => setMeditationActive(false)}
              >
                <Pause className="h-4 w-4 mr-2" /> End Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {meditations.map(meditation => (
                <Card key={meditation.id} className={meditation.completed ? 'border-primary/50 bg-primary/5' : ''}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{meditation.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(meditation.duration)}
                      </span>
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {meditation.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => startMeditation(meditation)}
                    >
                      <Play className="h-3 w-3 mr-1" /> 
                      {meditation.completed ? 'Practice Again' : 'Begin'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
