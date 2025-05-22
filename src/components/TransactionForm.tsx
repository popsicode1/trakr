
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, PlusIcon, LeafyGreen, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Transaction, TransactionType, Wallet } from '@/lib/types';
import { defaultCategories, defaultPaymentMethods, generateId, getWallets } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTransaction: (transaction: Transaction) => void;
}

const schema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive' }),
  date: z.date(),
  category: z.string().min(1, { message: 'Please select a category' }),
  description: z.string().optional(),
  type: z.enum(['income', 'expense']),
  paymentMethod: z.string().min(1, { message: 'Please select a payment method' }),
  tags: z.string().optional(),
  walletId: z.string().min(1, { message: 'Please select a wallet' }),
  carbonImpact: z.number().min(0).max(10).optional(),
  mindfulPrompt: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const TransactionForm: React.FC<TransactionFormProps> = ({ open, onOpenChange, onAddTransaction }) => {
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showMindfulPrompt, setShowMindfulPrompt] = useState(false);
  const [isBigExpense, setIsBigExpense] = useState(false);
  const [confirmedMindful, setConfirmedMindful] = useState(false);
  
  useEffect(() => {
    setWallets(getWallets());
  }, [open]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      category: '',
      description: '',
      type: 'expense',
      paymentMethod: '',
      tags: '',
      walletId: '',
      carbonImpact: 0,
      mindfulPrompt: false,
    },
  });
  
  // Watch for amount to determine if this is a "big expense"
  const watchAmount = form.watch('amount');
  const watchCategory = form.watch('category');
  
  useEffect(() => {
    // If amount is over 500, consider it a "big expense"
    setIsBigExpense(watchAmount > 500 && transactionType === 'expense');
    
    // Check if category is related to travel or fuel
    const category = defaultCategories.find(c => c.id === watchCategory);
    const isTravelOrFuel = category && 
      ['transportation', 'travel'].includes(category.id);
    
    // Show carbon impact field for relevant categories
    if (isTravelOrFuel) {
      form.setValue('carbonImpact', 5); // Default mid value
    }
  }, [watchAmount, watchCategory, transactionType, form]);

  const handleSubmit = (data: FormValues) => {
    // Check if mindful prompt is needed but not confirmed
    if (isBigExpense && data.mindfulPrompt && !confirmedMindful) {
      setShowMindfulPrompt(true);
      return;
    }
    
    // Create new transaction object
    const newTransaction: Transaction = {
      id: generateId(),
      amount: data.amount,
      date: data.date,
      category: data.category,
      description: data.description,
      type: data.type,
      paymentMethod: data.paymentMethod,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      walletId: data.walletId,
      carbonImpact: data.carbonImpact,
    };

    onAddTransaction(newTransaction);
    setConfirmedMindful(false);
    form.reset();
    onOpenChange(false);
  };
  
  const handleConfirmMindful = () => {
    setConfirmedMindful(true);
    setShowMindfulPrompt(false);
    form.handleSubmit(handleSubmit)();
  };

  // Filter categories by transaction type
  const filteredCategories = defaultCategories.filter(
    category => category.type === transactionType || category.type === 'both'
  );
  
  // Check if showing carbon impact field
  const showCarbonImpact = () => {
    const category = defaultCategories.find(c => c.id === form.getValues('category'));
    return category && ['transportation', 'travel'].includes(category.id);
  };
  
  const carbonImpactLabels = [
    'Minimal',
    'Very Low',
    'Low',
    'Moderate',
    'Medium',
    'Standard',
    'Considerable',
    'High',
    'Very High',
    'Extensive',
    'Maximum'
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Enter the details of your transaction.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Transaction Type */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={transactionType === 'expense' ? 'default' : 'outline'}
                  className={cn(
                    transactionType === 'expense' && 'bg-trakr-expense text-white hover:bg-trakr-expense/90'
                  )}
                  onClick={() => {
                    setTransactionType('expense');
                    form.setValue('type', 'expense');
                    form.setValue('category', '');
                  }}
                >
                  Expense
                </Button>
                <Button
                  type="button"
                  variant={transactionType === 'income' ? 'default' : 'outline'}
                  className={cn(
                    transactionType === 'income' && 'bg-trakr-income text-white hover:bg-trakr-income/90'
                  )}
                  onClick={() => {
                    setTransactionType('income');
                    form.setValue('type', 'income');
                    form.setValue('category', '');
                  }}
                >
                  Income
                </Button>
              </div>

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value !== '' ? parseFloat(e.target.value) : 0;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Wallet Selection - NEW */}
              <FormField
                control={form.control}
                name="walletId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a wallet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: wallet.color }}
                              ></div>
                              {wallet.name} ({new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: wallet.currency
                              }).format(wallet.balance)})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {defaultPaymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Carbon Footprint - NEW */}
              {showCarbonImpact() && (
                <FormField
                  control={form.control}
                  name="carbonImpact"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Carbon Impact</FormLabel>
                        <LeafyGreen className="h-4 w-4 text-green-600" />
                      </div>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider 
                            defaultValue={[field.value || 5]} 
                            max={10}
                            step={1}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{carbonImpactLabels[0]}</span>
                            <span>{carbonImpactLabels[5]}</span>
                            <span>{carbonImpactLabels[10]}</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Estimate the environmental impact of this transaction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Mindful Spending - NEW */}
              {transactionType === 'expense' && (
                <FormField
                  control={form.control}
                  name="mindfulPrompt"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex">
                          <FormLabel className="text-base mr-2">
                            Enable mindful spending
                          </FormLabel>
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                        </div>
                        <FormDescription>
                          Get prompted to reflect on larger purchases
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. work, important, reimbursable"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate tags with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Transaction</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Mindful Spending Prompt */}
      <Dialog open={showMindfulPrompt} onOpenChange={setShowMindfulPrompt}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-purple-600" />
              Mindful Spending Check
            </DialogTitle>
            <DialogDescription>
              Take a moment to reflect on this purchase.
            </DialogDescription>
          </DialogHeader>
          
          <Alert>
            <AlertTitle>This is a significant expense (${watchAmount})</AlertTitle>
            <AlertDescription>
              Ask yourself:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Do I really need this right now?</li>
                <li>Will this purchase benefit me in the long term?</li>
                <li>Is there a more affordable alternative?</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowMindfulPrompt(false)}>
              Let me reconsider
            </Button>
            <Button onClick={handleConfirmMindful}>
              Yes, I need this
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionForm;
