
import React, { useState } from 'react';
import { format } from 'date-fns';
import { SearchIcon, FilterIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Transaction, Category, TransactionType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { defaultCategories } from '@/lib/data';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  onDeleteTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Apply search term filter
    const matchesSearch = 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Apply type filter
    const matchesType = 
      typeFilter === 'all' || 
      transaction.type === typeFilter;
    
    // Apply category filter
    const matchesCategory = 
      categoryFilter === 'all' || 
      transaction.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc' 
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    } else { // sort by amount
      return sortDirection === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
  });

  // Function to toggle sort direction
  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc'); // Default to descending when changing sort field
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = defaultCategories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Get category color by ID
  const getCategoryColor = (categoryId: string): string => {
    const category = defaultCategories.find(c => c.id === categoryId);
    return category ? category.color : '#CBD5E0';
  };

  // Format amount with sign and color based on transaction type
  const formatAmount = (amount: number, type: TransactionType): JSX.Element => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
    
    const textColorClass = type === 'income' ? 'text-trakr-income' : 'text-trakr-expense';
    const sign = type === 'income' ? '+' : '-';
    
    return (
      <span className={`font-medium ${textColorClass}`}>
        {type === 'income' ? sign : ''}{formattedAmount}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {defaultCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer w-[110px] whitespace-nowrap"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortBy === 'date' && (
                      sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead 
                  className="text-right cursor-pointer whitespace-nowrap"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Amount</span>
                    {sortBy === 'amount' && (
                      sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(transaction.date, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getCategoryColor(transaction.category) }}
                      ></div>
                      <span>{getCategoryName(transaction.category)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.description || '-'}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {transaction.tags && transaction.tags.length > 0 ? (
                        transaction.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        '-'
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(transaction.amount, transaction.type)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="h-8 w-8"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center border rounded-md bg-slate-50">
          <div className="text-3xl mb-2 text-gray-300">📋</div>
          <h3 className="text-lg font-medium mb-1">No transactions found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
              ? "Try changing your filters or search term"
              : "Add your first transaction to get started"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
