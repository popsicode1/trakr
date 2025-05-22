
import React, { useState } from 'react';
import { PlusIcon, MinusIcon, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Budget, Transaction } from '@/lib/types';
import { getBudgets, saveBudgets, generateId, getCategories, filterTransactionsByCategory } from '@/lib/data';

interface BudgetManagementProps {
  transactions: Transaction[];
}

const BudgetManagement: React.FC<BudgetManagementProps> = ({ transactions }) => {
  const [budgets, setBudgets] = useState<Budget[]>(getBudgets());
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: 0,
    period: 'monthly' as 'weekly' | 'monthly' | 'yearly',
  });
  const { toast } = useToast();
  
  const categories = getCategories();
  const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

  const handleAddBudget = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    let endDate;
    switch (formData.period) {
      case 'weekly':
        endDate = new Date(startOfMonth);
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'monthly':
        endDate = new Date(startOfMonth);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); // Last day of the month
        break;
      case 'yearly':
        endDate = new Date(startOfMonth);
        endDate.setFullYear(endDate.getFullYear() + 1);
        endDate.setDate(0); // Last day of the year
        break;
    }

    const newBudget: Budget = {
      id: generateId(),
      category: formData.category,
      amount: formData.amount,
      period: formData.period,
      startDate: startOfMonth,
      endDate: endDate,
    };

    const updatedBudgets = [...budgets, newBudget];
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
    setOpenAddDialog(false);
    resetForm();

    toast({
      title: "Budget Created",
      description: `Budget for ${getCategoryName(formData.category)} has been created.`,
    });
  };

  const handleEditBudget = () => {
    if (!currentBudget) return;

    const updatedBudgets = budgets.map(budget => 
      budget.id === currentBudget.id 
        ? { 
            ...budget, 
            category: formData.category, 
            amount: formData.amount, 
            period: formData.period 
          } 
        : budget
    );

    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
    setOpenEditDialog(false);
    resetForm();

    toast({
      title: "Budget Updated",
      description: `Budget for ${getCategoryName(formData.category)} has been updated.`,
    });
  };

  const handleDeleteBudget = (id: string) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== id);
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
    
    toast({
      title: "Budget Deleted",
      description: "The budget has been removed.",
    });
  };

  const editBudget = (budget: Budget) => {
    setCurrentBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
    });
    setOpenEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      category: expenseCategories.length > 0 ? expenseCategories[0].id : '',
      amount: 0,
      period: 'monthly',
    });
    setCurrentBudget(null);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#CBD5E0';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Budgets</h2>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => resetForm()}>
              <PlusIcon className="mr-1 h-4 w-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select 
                  value={formData.period} 
                  onValueChange={(value) => handleSelectChange('period', value as 'weekly' | 'monthly' | 'yearly')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-4" onClick={handleAddBudget}>
                Create Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No budgets set up yet</p>
          <p className="text-sm text-gray-400 mt-1">Create a budget to track your spending against goals</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {budgets.map(budget => {
            const progress = calculateBudgetProgress(budget);
            const categoryName = getCategoryName(budget.category);
            const categoryColor = getCategoryColor(budget.category);
            
            return (
              <Card key={budget.id} className="overflow-hidden">
                <div 
                  className="h-2" 
                  style={{ backgroundColor: categoryColor }}
                ></div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: categoryColor }}
                        ></div>
                        <span className="font-medium">{categoryName}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} budget
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(budget.amount)}</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(progress.totalSpent)} spent
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Progress 
                      value={progress.percentage} 
                      className={progress.overBudget ? 'bg-red-100' : 'bg-gray-100'} 
                    />
                    
                    <div className="flex justify-between items-center text-xs mt-1">
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

                  <div className="mt-4 flex space-x-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => editBudget(budget)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MinusIcon className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Budget Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Budget Amount</Label>
              <Input
                id="edit-amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-period">Period</Label>
              <Select 
                value={formData.period} 
                onValueChange={(value) => handleSelectChange('period', value as 'weekly' | 'monthly' | 'yearly')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full mt-4" onClick={handleEditBudget}>
              Update Budget
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetManagement;
