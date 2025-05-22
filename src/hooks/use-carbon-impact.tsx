
import { useState } from 'react';

const CARBON_FACTORS = {
  'food': 0.1, // kg CO2 per dollar spent
  'transportation': 0.25,
  'utilities': 0.15,
  'shopping': 0.08,
  'entertainment': 0.05,
  // Default factor for other categories
  'default': 0.07
};

export function useCarbonImpact() {
  const [isMindfulPromptVisible, setIsMindfulPromptVisible] = useState(false);

  const calculateCarbonImpact = (category: string, amount: number): number => {
    const factor = CARBON_FACTORS[category as keyof typeof CARBON_FACTORS] || CARBON_FACTORS.default;
    return parseFloat((amount * factor).toFixed(2));
  };

  const shouldPromptMindfulSpending = (amount: number): boolean => {
    // This threshold could come from user preferences
    const threshold = 1000; // PHP 1000
    return amount > threshold;
  };

  const showMindfulPrompt = (amount: number) => {
    if (shouldPromptMindfulSpending(amount)) {
      setIsMindfulPromptVisible(true);
      return true;
    }
    return false;
  };

  const hideMindfulPrompt = () => {
    setIsMindfulPromptVisible(false);
  };

  return {
    calculateCarbonImpact,
    showMindfulPrompt,
    hideMindfulPrompt,
    isMindfulPromptVisible
  };
}
