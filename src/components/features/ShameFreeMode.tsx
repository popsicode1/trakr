
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Create a context that can be used across the app
export const ShameFreeContext = React.createContext<{
  enabled: boolean;
  toggle: () => void;
}>({
  enabled: false,
  toggle: () => {},
});

// Hook to use shame-free mode
export const useShameFree = () => React.useContext(ShameFreeContext);

// Provider component to wrap the app with
export const ShameFreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedValue = localStorage.getItem('shameFreeMode');
    if (savedValue) {
      setEnabled(savedValue === 'true');
      
      // Apply document class if enabled
      if (savedValue === 'true') {
        document.documentElement.classList.add('shame-free-mode');
      }
    }
  }, []);
  
  // Save to localStorage and update document class whenever state changes
  useEffect(() => {
    localStorage.setItem('shameFreeMode', String(enabled));
    
    if (enabled) {
      document.documentElement.classList.add('shame-free-mode');
    } else {
      document.documentElement.classList.remove('shame-free-mode');
    }
  }, [enabled]);
  
  const toggle = () => setEnabled(prev => !prev);
  
  return (
    <ShameFreeContext.Provider value={{ enabled, toggle }}>
      {children}
    </ShameFreeContext.Provider>
  );
};

export const ShameFreeMode = () => {
  // Get context values if available, otherwise use local state
  const contextValue = React.useContext(ShameFreeContext);
  const [enabled, setEnabled] = useState(false);
  const { toast } = useToast();
  
  // Sync with context if available, otherwise use local state
  useEffect(() => {
    if (contextValue) {
      setEnabled(contextValue.enabled);
    } else {
      // If no context, check localStorage
      const savedValue = localStorage.getItem('shameFreeMode');
      if (savedValue) {
        setEnabled(savedValue === 'true');
      }
    }
  }, [contextValue?.enabled]);
  
  const handleToggle = (checked: boolean) => {
    if (contextValue) {
      contextValue.toggle();
    } else {
      setEnabled(checked);
      localStorage.setItem('shameFreeMode', String(checked));
    }
    
    toast({
      title: checked ? "Shame-Free Mode Enabled" : "Shame-Free Mode Disabled",
      description: checked 
        ? "You'll now see positive, non-judgmental language throughout the app." 
        : "Standard language mode is now active.",
    });
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Shame-Free Mode</h2>
      <p>Positive, non-judgmental language for your financial journey</p>
      
      <div className="mt-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Switch 
            id="shame-free" 
            checked={enabled} 
            onCheckedChange={handleToggle} 
          />
          <Label htmlFor="shame-free">Enable Shame-Free Mode</Label>
        </div>
        
        <div className="space-y-4 mt-4">
          <h3 className="font-medium">When enabled:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>No red warnings or negative language</li>
            <li>Supportive framing of financial setbacks</li>
            <li>Progress-focused notifications</li>
            <li>Recovery-friendly terminology</li>
          </ul>
          
          <div className="p-4 bg-muted rounded-lg mt-4">
            <h4 className="font-medium mb-2">Example:</h4>
            <p className="text-muted-foreground mb-2">
              <strong>Instead of:</strong> "You overspent by $50! Budget violated."
            </p>
            <p className="text-muted-foreground">
              <strong>You'll see:</strong> "Budget adjusted. Next week brings new opportunities to align spending with your goals."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
