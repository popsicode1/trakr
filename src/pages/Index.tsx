import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from '@/hooks/use-mobile';
import MobileNavbar from '@/components/MobileNavbar';
import MobileSidebar from '@/components/MobileSidebar';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import SummaryCards from '@/components/SummaryCards';
import CategoryPieChart from '@/components/CategoryPieChart';
import BudgetOverview from '@/components/BudgetOverview';
import HabitsTab from '@/components/HabitsTab';
import WalletManagement from '@/components/WalletManagement';
import BudgetManagement from '@/components/BudgetManagement';
import ReportsPage from '@/components/ReportsPage';
import MiniAppsGrid from '@/components/MiniAppsGrid';
import FinancialAiAdvisor from '@/components/FinancialAiAdvisor';
import AppSidebar from '@/components/AppSidebar';
import { PersonalityQuiz } from '@/components/features/PersonalityQuiz';
import { BehavioralStreaks } from '@/components/features/BehavioralStreaks';
import { ShameFreeMode } from '@/components/features/ShameFreeMode';
import { GamifiedFeatures } from '@/components/features/GamifiedFeatures';
import { MindfulAddons } from '@/components/features/MindfulAddons';
import SettingsPage from '@/components/SettingsPage';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  getTransactions, 
  saveTransactions, 
  getBudgets, 
  calculateSummary,
  getWallets,
  saveWallets
} from '@/lib/data';
import { Transaction, Wallet } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState(getBudgets());
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Load transactions and wallets from local storage
  useEffect(() => {
    setTransactions(getTransactions());
    setWallets(getWallets());
    
    // Load user settings from localStorage for persistent session
    const savedTheme = localStorage.getItem('trakr-theme');
    const savedCurrency = localStorage.getItem('trakr-currency') || 'USD';
    const savedLanguage = localStorage.getItem('trakr-language') || 'en-US';
    const shameFreeMode = localStorage.getItem('trakr-shame-free') === 'true';
    
    // Apply saved settings (to be used by the SettingsPage component)
    document.documentElement.setAttribute('data-shame-free', shameFreeMode ? 'true' : 'false');
  }, []);

  // Calculate summary statistics
  const summary = calculateSummary(transactions);

  // Handle adding a new transaction
  const handleAddTransaction = (transaction: Transaction) => {
    // Update transactions
    const newTransactions = [...transactions, transaction];
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
    
    // Update wallet balance if wallet ID is provided
    if (transaction.walletId) {
      const updatedWallets = wallets.map(wallet => {
        if (wallet.id === transaction.walletId) {
          // Add or subtract amount based on transaction type
          const newBalance = transaction.type === 'income' 
            ? wallet.balance + transaction.amount 
            : wallet.balance - transaction.amount;
          
          return { ...wallet, balance: newBalance };
        }
        return wallet;
      });
      
      setWallets(updatedWallets);
      saveWallets(updatedWallets);
    }
    
    toast({
      title: "Transaction added",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount} has been added.`,
    });
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (id: string) => {
    // Find the transaction before deleting it
    const transactionToDelete = transactions.find(tx => tx.id === id);
    
    if (transactionToDelete && transactionToDelete.walletId) {
      // Reverse the effect on the wallet
      const updatedWallets = wallets.map(wallet => {
        if (wallet.id === transactionToDelete.walletId) {
          // If the deleted transaction was an expense, add the amount back
          // If it was income, subtract the amount
          const newBalance = transactionToDelete.type === 'income' 
            ? wallet.balance - transactionToDelete.amount 
            : wallet.balance + transactionToDelete.amount;
          
          return { ...wallet, balance: newBalance };
        }
        return wallet;
      });
      
      setWallets(updatedWallets);
      saveWallets(updatedWallets);
    }
    
    // Update transactions
    const newTransactions = transactions.filter(tx => tx.id !== id);
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
    
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed.",
    });
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <AppSidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
          />
        )}
        
        <SidebarInset className="bg-background">
          <main className="container py-4 px-3 md:py-6 md:px-4 max-w-7xl">
            {/* Mobile Header with Menu Button */}
            {isMobile && (
              <div className="mb-3 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowMobileSidebar(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold ml-2">Trakr</h1>
              </div>
            )}
            
            <div className="space-y-4 md:space-y-6 pb-16">
              <div>
                <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                  {currentPage === 'dashboard' && 'Dashboard'}
                  {currentPage === 'transactions' && 'Transactions'}
                  {currentPage === 'budgets' && 'Budgets'}
                  {currentPage === 'reports' && 'Reports'}
                  {currentPage === 'settings' && 'Settings'}
                  {currentPage === 'habits' && 'Habits'}
                  {currentPage === 'wallets' && 'Wallets'}
                  {currentPage === 'tools' && 'Mini Tools'}
                  {currentPage === 'ai-advisor' && 'Financial AI Advisor'}
                  {currentPage === 'personality-quiz' && 'Financial Personality Quiz'}
                  {currentPage === 'streaks' && 'Behavioral Streaks'}
                  {currentPage === 'shame-free' && 'Shame-Free Mode'}
                  {currentPage === 'gamified' && 'Gamified Features'}
                  {currentPage === 'mindful' && 'Mindful Add-Ons'}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  {currentPage === 'dashboard' && 'Overview of your financial status'}
                  {currentPage === 'transactions' && 'Manage your income and expenses'}
                  {currentPage === 'budgets' && 'Track your spending against budgets'}
                  {currentPage === 'reports' && 'Analyze your financial patterns'}
                  {currentPage === 'settings' && 'Customize your experience'}
                  {currentPage === 'habits' && 'Link habits to financial goals'}
                  {currentPage === 'wallets' && 'Manage your accounts and balances'}
                  {currentPage === 'tools' && 'Useful financial calculators and tools'}
                  {currentPage === 'ai-advisor' && 'Get personalized financial advice'}
                  {currentPage === 'personality-quiz' && 'Discover your financial personality type'}
                  {currentPage === 'streaks' && 'Build positive financial habits'}
                  {currentPage === 'shame-free' && 'Positive, non-judgmental guidance'}
                  {currentPage === 'gamified' && 'Make finance fun through games'}
                  {currentPage === 'mindful' && 'Connect finances with well-being'}
                </p>
              </div>

              {currentPage === 'ai-advisor' ? (
                <div className="animate-fade-in h-[calc(100vh-200px)]">
                  <FinancialAiAdvisor onBack={() => setCurrentPage('dashboard')} />
                </div>
              ) : currentPage === 'dashboard' && (
                <div className="space-y-4 md:space-y-6 animate-fade-in">
                  {/* Summary Cards */}
                  <SummaryCards summary={summary} />
                  
                  <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                    {/* Category Distribution */}
                    <CategoryPieChart summary={summary} />
                    
                    {/* Budget Overview */}
                    <BudgetOverview 
                      budgets={budgets}
                      transactions={transactions}
                    />
                  </div>
                  
                  {/* Recent Transactions */}
                  <div className="space-y-3 md:space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight">Recent Transactions</h2>
                    <TransactionList 
                      transactions={transactions.slice(0, 5)}
                      onDeleteTransaction={handleDeleteTransaction}
                    />
                  </div>
                </div>
              )}

              {currentPage === 'transactions' && (
                <div className="animate-fade-in">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-4 w-full overflow-x-auto no-scrollbar">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                      <TabsTrigger value="expense">Expenses</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-3 md:space-y-4">
                      <TransactionList 
                        transactions={transactions}
                        onDeleteTransaction={handleDeleteTransaction}
                      />
                    </TabsContent>
                    
                    <TabsContent value="income" className="space-y-3 md:space-y-4">
                      <TransactionList 
                        transactions={transactions.filter(tx => tx.type === 'income')}
                        onDeleteTransaction={handleDeleteTransaction}
                      />
                    </TabsContent>
                    
                    <TabsContent value="expense" className="space-y-3 md:space-y-4">
                      <TransactionList 
                        transactions={transactions.filter(tx => tx.type === 'expense')}
                        onDeleteTransaction={handleDeleteTransaction}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {currentPage === 'habits' && (
                <div className="animate-fade-in">
                  <HabitsTab />
                </div>
              )}

              {currentPage === 'budgets' && (
                <div className="animate-fade-in">
                  <BudgetManagement transactions={transactions} />
                </div>
              )}

              {currentPage === 'reports' && (
                <div className="animate-fade-in">
                  <ReportsPage transactions={transactions} />
                </div>
              )}

              {currentPage === 'wallets' && (
                <div className="animate-fade-in">
                  <WalletManagement />
                </div>
              )}

              {currentPage === 'tools' && (
                <div className="animate-fade-in">
                  <MiniAppsGrid />
                </div>
              )}

              {currentPage === 'settings' && (
                <div className="animate-fade-in">
                  <SettingsPage />
                </div>
              )}

              {/* New feature pages */}
              {currentPage === 'personality-quiz' && (
                <div className="animate-fade-in">
                  <PersonalityQuiz />
                </div>
              )}

              {currentPage === 'streaks' && (
                <div className="animate-fade-in">
                  <BehavioralStreaks />
                </div>
              )}

              {currentPage === 'shame-free' && (
                <div className="animate-fade-in">
                  <ShameFreeMode />
                </div>
              )}

              {currentPage === 'gamified' && (
                <div className="animate-fade-in">
                  <GamifiedFeatures />
                </div>
              )}

              {currentPage === 'mindful' && (
                <div className="animate-fade-in">
                  <MindfulAddons />
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* Mobile bottom navigation */}
      {isMobile && (
        <MobileNavbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onAddTransaction={() => setShowTransactionForm(true)}
        />
      )}

      {/* Mobile sidebar */}
      <MobileSidebar
        open={showMobileSidebar}
        onOpenChange={setShowMobileSidebar}
        onNavigate={setCurrentPage}
      />

      {/* Add padding at the bottom to account for mobile navigation */}
      {isMobile && <div className="h-16" />}

      <TransactionForm 
        open={showTransactionForm}
        onOpenChange={setShowTransactionForm}
        onAddTransaction={handleAddTransaction}
      />
    </SidebarProvider>
  );
};

export default Index;
