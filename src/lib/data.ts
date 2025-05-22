
import { Transaction, Category, Budget, SummaryStats, TransactionType, Wallet, MiniApp } from './types';

// Sample categories
export const defaultCategories: Category[] = [
  { id: 'food', name: 'Food & Dining', color: '#38B2AC', type: 'expense' },
  { id: 'transportation', name: 'Transportation', color: '#4299E1', type: 'expense' },
  { id: 'utilities', name: 'Utilities', color: '#9F7AEA', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', color: '#ED8936', type: 'expense' },
  { id: 'shopping', name: 'Shopping', color: '#F56565', type: 'expense' },
  { id: 'health', name: 'Health', color: '#48BB78', type: 'expense' },
  { id: 'housing', name: 'Housing', color: '#805AD5', type: 'expense' },
  { id: 'salary', name: 'Salary', color: '#38A169', type: 'income' },
  { id: 'freelance', name: 'Freelance', color: '#68D391', type: 'income' },
  { id: 'gifts', name: 'Gifts', color: '#4FD1C5', type: 'income' },
  { id: 'other_income', name: 'Other Income', color: '#81E6D9', type: 'income' },
  { id: 'other_expense', name: 'Other Expense', color: '#CBD5E0', type: 'expense' }
];

// Sample payment methods
export const defaultPaymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Mobile Payment',
  'Check',
  'Other'
];

// Default wallets
export const defaultWallets: Wallet[] = [
  {
    id: 'cash',
    name: 'Cash',
    balance: 500,
    currency: 'USD',
    color: '#38A169', // green
    isDefault: true,
    createdAt: new Date()
  },
  {
    id: 'bank',
    name: 'Bank Account',
    balance: 2500,
    currency: 'USD',
    color: '#3182CE', // blue
    createdAt: new Date()
  },
  {
    id: 'savings',
    name: 'Savings',
    balance: 10000,
    currency: 'USD',
    color: '#805AD5', // purple
    createdAt: new Date()
  }
];

// Generate sample transactions for the current month
const today = new Date();
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: 1000,
    date: new Date(today.getFullYear(), today.getMonth(), 5),
    category: 'food',
    description: 'Weekly groceries',
    type: 'expense',
    paymentMethod: 'Credit Card',
    tags: ['essential'],
    walletId: 'bank'
  },
  {
    id: '2',
    amount: 50,
    date: new Date(today.getFullYear(), today.getMonth(), 8),
    category: 'transportation',
    description: 'Gas',
    type: 'expense',
    paymentMethod: 'Debit Card',
    walletId: 'bank'
  },
  {
    id: '3',
    amount: 3500,
    date: new Date(today.getFullYear(), today.getMonth(), 1),
    category: 'salary',
    description: 'Monthly salary',
    type: 'income',
    paymentMethod: 'Bank Transfer',
    tags: ['work'],
    walletId: 'bank'
  },
  {
    id: '4',
    amount: 200,
    date: new Date(today.getFullYear(), today.getMonth(), 12),
    category: 'entertainment',
    description: 'Movie night',
    type: 'expense',
    paymentMethod: 'Cash',
    walletId: 'cash'
  },
  {
    id: '5',
    amount: 150,
    date: new Date(today.getFullYear(), today.getMonth(), 15),
    category: 'utilities',
    description: 'Electricity bill',
    type: 'expense',
    paymentMethod: 'Bank Transfer',
    tags: ['bills', 'home'],
    walletId: 'bank'
  },
  {
    id: '6',
    amount: 500,
    date: new Date(today.getFullYear(), today.getMonth(), 10),
    category: 'freelance',
    description: 'Website project',
    type: 'income',
    paymentMethod: 'Bank Transfer',
    tags: ['work', 'freelance'],
    walletId: 'bank'
  },
  {
    id: '7',
    amount: 800,
    date: new Date(today.getFullYear(), today.getMonth(), 20),
    category: 'shopping',
    description: 'New clothes',
    type: 'expense',
    paymentMethod: 'Credit Card',
    walletId: 'bank'
  }
];

// Sample budgets
export const sampleBudgets: Budget[] = [
  {
    id: '1',
    category: 'food',
    amount: 1500,
    period: 'monthly',
    startDate: startOfMonth
  },
  {
    id: '2',
    category: 'entertainment',
    amount: 500,
    period: 'monthly',
    startDate: startOfMonth
  },
  {
    id: '3',
    category: 'transportation',
    amount: 300,
    period: 'monthly',
    startDate: startOfMonth
  }
];

// Local Storage Keys
const TRANSACTIONS_KEY = 'trakr_transactions';
const CATEGORIES_KEY = 'trakr_categories';
const BUDGETS_KEY = 'trakr_budgets';
const WALLETS_KEY = 'trakr_wallets';
const MINI_APPS_KEY = 'trakr_mini_apps';

// Local Storage Utilities
export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  if (!data) {
    // Initialize with sample data if nothing exists
    saveTransactions(sampleTransactions);
    return sampleTransactions;
  }
  
  try {
    const parsed = JSON.parse(data);
    return parsed.map((tx: any) => ({
      ...tx,
      date: new Date(tx.date)
    }));
  } catch (error) {
    console.error('Error parsing transactions:', error);
    return [];
  }
};

export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const getCategories = (): Category[] => {
  const data = localStorage.getItem(CATEGORIES_KEY);
  if (!data) {
    // Initialize with default categories if nothing exists
    saveCategories(defaultCategories);
    return defaultCategories;
  }
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing categories:', error);
    return defaultCategories;
  }
};

export const saveBudgets = (budgets: Budget[]): void => {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
};

export const getBudgets = (): Budget[] => {
  const data = localStorage.getItem(BUDGETS_KEY);
  if (!data) {
    // Initialize with sample budgets if nothing exists
    saveBudgets(sampleBudgets);
    return sampleBudgets;
  }
  
  try {
    const parsed = JSON.parse(data);
    return parsed.map((budget: any) => ({
      ...budget,
      startDate: new Date(budget.startDate),
      endDate: budget.endDate ? new Date(budget.endDate) : undefined
    }));
  } catch (error) {
    console.error('Error parsing budgets:', error);
    return [];
  }
};

// New: Wallet functions
export const saveWallets = (wallets: Wallet[]): void => {
  localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets));
};

export const getWallets = (): Wallet[] => {
  const data = localStorage.getItem(WALLETS_KEY);
  if (!data) {
    // Initialize with default wallets if nothing exists
    saveWallets(defaultWallets);
    return defaultWallets;
  }
  
  try {
    const parsed = JSON.parse(data);
    return parsed.map((wallet: any) => ({
      ...wallet,
      createdAt: new Date(wallet.createdAt)
    }));
  } catch (error) {
    console.error('Error parsing wallets:', error);
    return defaultWallets;
  }
};

// New: Mini App functions
export const saveMiniApps = (miniApps: MiniApp[]): void => {
  localStorage.setItem(MINI_APPS_KEY, JSON.stringify(miniApps));
};

export const getMiniApps = (): MiniApp[] => {
  const data = localStorage.getItem(MINI_APPS_KEY);
  if (!data) {
    // Initialize with sample mini apps if nothing exists
    const defaultMiniApps: MiniApp[] = [
      {
        id: 'tip-calculator',
        name: 'Tip Calculator',
        description: 'Calculate tips and split bills',
        icon: 'calculator',
        component: 'TipCalculator',
        active: true
      }
    ];
    saveMiniApps(defaultMiniApps);
    return defaultMiniApps;
  }
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing mini apps:', error);
    return [];
  }
};

// Utilities to calculate summary statistics
export const calculateSummary = (transactions: Transaction[]): SummaryStats => {
  // Initialize summary
  const summary: SummaryStats = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    mostSpentCategory: {
      name: 'None',
      amount: 0
    },
    categoryTotals: {}
  };

  // Process all transactions
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      summary.totalIncome += transaction.amount;
    } else {
      summary.totalExpense += transaction.amount;
      
      // Update category totals
      if (!summary.categoryTotals[transaction.category]) {
        summary.categoryTotals[transaction.category] = 0;
      }
      summary.categoryTotals[transaction.category] += transaction.amount;
    }
  });

  // Calculate balance
  summary.balance = summary.totalIncome - summary.totalExpense;

  // Find most spent category
  let maxAmount = 0;
  for (const [category, amount] of Object.entries(summary.categoryTotals)) {
    if (amount > maxAmount) {
      maxAmount = amount;
      const categoryObj = defaultCategories.find(c => c.id === category);
      summary.mostSpentCategory = {
        name: categoryObj ? categoryObj.name : category,
        amount
      };
    }
  }

  return summary;
};

// Filter transactions by date range
export const filterTransactionsByDate = (
  transactions: Transaction[], 
  startDate: Date, 
  endDate: Date
): Transaction[] => {
  return transactions.filter(tx => 
    tx.date >= startDate && tx.date <= endDate
  );
};

// Filter transactions by type
export const filterTransactionsByType = (
  transactions: Transaction[],
  type: TransactionType
): Transaction[] => {
  return transactions.filter(tx => tx.type === type);
};

// Filter transactions by category
export const filterTransactionsByCategory = (
  transactions: Transaction[],
  categoryId: string
): Transaction[] => {
  return transactions.filter(tx => tx.category === categoryId);
};

// Filter transactions by wallet
export const filterTransactionsByWallet = (
  transactions: Transaction[],
  walletId: string
): Transaction[] => {
  return transactions.filter(tx => tx.walletId === walletId);
};

// Generate a new unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
