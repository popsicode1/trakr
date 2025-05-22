
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Budget, Transaction } from '@/lib/types';
import { defaultCategories } from '@/lib/data';

interface BudgetOverviewProps {
  budgets: Budget[];
  transactions: Transaction[];
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budgets, transactions }) => {
  // Function to calculate budget progress
  const calculateBudgetProgress = (budget: Budget) => {
    // Filter transactions for current period and matching category
    const relevantTransactions = transactions.filter(tx => {
      const isMatchingCategory = tx.category === budget.category;
      const isExpense = tx.type === 'expense';
      const isWithinPeriod = tx.date >= budget.startDate && 
        (!budget.endDate || tx.date <= budget.endDate);
      
      return isMatchingCategory && isExpense && isWithinPeriod;
    });

    // Calculate total spent
    const totalSpent = relevantTransactions.reduce(
      (sum, tx) => sum + tx.amount, 
      0
    );

    // Calculate percentage
    const percentage = Math.min(Math.round((totalSpent / budget.amount) * 100), 100);

    return {
      totalSpent,
      percentage,
      remaining: Math.max(budget.amount - totalSpent, 0),
      overBudget: totalSpent > budget.amount
    };
  };

  // Function to get category details
  const getCategoryDetails = (categoryId: string) => {
    const category = defaultCategories.find(c => c.id === categoryId);
    return {
      name: category ? category.name : categoryId,
      color: category ? category.color : '#CBD5E0'
    };
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {budgets.length > 0 ? (
          <div className="space-y-5">
            {budgets.map(budget => {
              const progress = calculateBudgetProgress(budget);
              const category = getCategoryDetails(budget.category);
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(progress.totalSpent)} of {formatCurrency(budget.amount)}
                    </div>
                  </div>
                  
                  <Progress 
                    value={progress.percentage} 
                    className={progress.overBudget ? 'bg-red-100' : 'bg-gray-100'}
                  />
                  
                  <div className="flex justify-between items-center text-xs">
                    <span 
                      className={progress.overBudget 
                        ? "text-red-600 font-medium" 
                        : "text-gray-500"
                      }
                    >
                      {progress.overBudget 
                        ? `Over budget by ${formatCurrency(progress.totalSpent - budget.amount)}` 
                        : `${formatCurrency(progress.remaining)} remaining`
                      }
                    </span>
                    <span className="text-gray-500">{progress.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No budgets set. Add a budget to track your spending goals.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;
