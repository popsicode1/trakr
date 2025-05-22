
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState<number>(0);
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [perPersonAmount, setPerPersonAmount] = useState<number>(0);

  // Calculate tip, total and per person amounts whenever inputs change
  useEffect(() => {
    const calcTipAmount = (billAmount * tipPercentage) / 100;
    const calcTotalAmount = billAmount + calcTipAmount;
    const calcPerPersonAmount = calcTotalAmount / (numberOfPeople || 1);

    setTipAmount(calcTipAmount);
    setTotalAmount(calcTotalAmount);
    setPerPersonAmount(calcPerPersonAmount);
  }, [billAmount, tipPercentage, numberOfPeople]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Handle bill amount input
  const handleBillAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setBillAmount(value);
  };

  // Handle number of people input
  const handleNumberOfPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setNumberOfPeople(value > 0 ? value : 1);
  };

  // Quick tip percentage buttons
  const tipOptions = [10, 15, 18, 20, 25];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Tip Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bill Amount */}
        <div className="space-y-2">
          <Label htmlFor="bill-amount">Bill Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="bill-amount"
              type="number"
              placeholder="0.00"
              className="pl-8"
              value={billAmount || ''}
              onChange={handleBillAmountChange}
              min={0}
              step="0.01"
            />
          </div>
        </div>
        
        {/* Tip Percentage */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Tip Percentage</Label>
            <span className="font-medium text-lg">{tipPercentage}%</span>
          </div>
          
          <Slider
            defaultValue={[tipPercentage]}
            min={0}
            max={50}
            step={1}
            onValueChange={(value) => setTipPercentage(value[0])}
          />
          
          <div className="flex justify-between gap-2">
            {tipOptions.map(percent => (
              <Button
                key={percent}
                variant={tipPercentage === percent ? "default" : "outline"}
                className="flex-1 text-xs px-1 sm:text-sm sm:px-2"
                onClick={() => setTipPercentage(percent)}
              >
                {percent}%
              </Button>
            ))}
          </div>
        </div>
        
        {/* Number of People */}
        <div className="space-y-2">
          <Label htmlFor="people">Number of People</Label>
          <Input
            id="people"
            type="number"
            value={numberOfPeople}
            onChange={handleNumberOfPeopleChange}
            min={1}
            step={1}
          />
        </div>
        
        {/* Results */}
        <div className="pt-4 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Tip Amount</div>
              <div className="text-xl font-bold text-blue-600">{formatCurrency(tipAmount)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Total Amount</div>
              <div className="text-xl font-bold">{formatCurrency(totalAmount)}</div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-sm text-blue-800">Per Person</div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(perPersonAmount)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TipCalculator;
