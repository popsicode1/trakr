
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LeafyGreen, Info } from "lucide-react";
import { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CarbonFootprintTracker() {
  // Sample data - this would normally be calculated from transactions
  const [carbonData, _] = useState({
    thisMonth: 264, // kg of CO2
    lastMonth: 310,
    change: -14.8, // percentage
    categories: [
      { name: "Transportation", amount: 158, percentage: 60 },
      { name: "Food", amount: 53, percentage: 20 },
      { name: "Utilities", amount: 32, percentage: 12 },
      { name: "Shopping", amount: 21, percentage: 8 }
    ]
  });

  const getEmojiForChange = () => {
    if (carbonData.change < -10) return "🌱";
    if (carbonData.change < 0) return "🌿";
    if (carbonData.change === 0) return "🌳";
    if (carbonData.change > 10) return "⚠️";
    return "📊";
  };

  const getColorForPercentage = (percentage: number) => {
    if (percentage < 30) return "bg-green-500";
    if (percentage < 70) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getMessage = () => {
    if (carbonData.change < 0) {
      return "Great job reducing your carbon footprint! The Earth is doing a happy dance.";
    } else if (carbonData.change === 0) {
      return "Holding steady! Let's see if we can bring it down a bit more next month.";
    } else {
      return "Your carbon footprint increased. Don't worry, we've got tips to help you reduce it!";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <LeafyGreen className="mr-2 h-5 w-5 text-green-500" />
          Carbon Footprint
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 h-4 w-4 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Estimated CO₂ emissions based on your spending patterns.
                  This helps you understand your environmental impact.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Based on your recent transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Current Month Stats */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold">{carbonData.thisMonth} kg</p>
              <p className="text-sm text-muted-foreground">CO₂ this month</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <span className={carbonData.change < 0 ? 'text-green-600' : 'text-red-600'}>
                  {carbonData.change > 0 ? '+' : ''}{carbonData.change}%
                </span>
                <span className="text-xl">{getEmojiForChange()}</span>
              </div>
              <p className="text-sm text-muted-foreground">vs. last month</p>
            </div>
          </div>
          
          {/* Fun Message */}
          <div className="bg-muted/30 p-3 rounded-md">
            <p className="text-sm italic">{getMessage()}</p>
          </div>
          
          {/* Category Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Top Sources</h4>
            {carbonData.categories.map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{category.name}</span>
                  <span className="text-muted-foreground">{category.amount} kg</span>
                </div>
                <Progress 
                  value={category.percentage} 
                  className={`h-1.5 ${getColorForPercentage(category.percentage)}`}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
