
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, WalletIcon, TrendingUpIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryStats } from '@/lib/types';

interface SummaryCardsProps {
  summary: SummaryStats;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Income */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            Total Income
          </CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-trakr-income" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-trakr-income">
            {formatCurrency(summary.totalIncome)}
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-red-800">
            Total Expenses
          </CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-trakr-expense" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-trakr-expense">
            {formatCurrency(summary.totalExpense)}
          </div>
        </CardContent>
      </Card>

      {/* Balance */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">
            Current Balance
          </CardTitle>
          <WalletIcon className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-trakr-expense'}`}>
            {formatCurrency(summary.balance)}
          </div>
        </CardContent>
      </Card>

      {/* Highest Expense Category */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">
            Top Expense Category
          </CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {summary.mostSpentCategory.name !== 'None'
              ? summary.mostSpentCategory.name
              : 'N/A'}
          </div>
          {summary.mostSpentCategory.amount > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(summary.mostSpentCategory.amount)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
