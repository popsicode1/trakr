
import React from 'react';
import { WalletIcon, PlusIcon, ArrowDownIcon, ArrowUpIcon, BarChartIcon, SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onAddTransaction: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, onAddTransaction }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <WalletIcon className="h-6 w-6 text-trakr-neutral" />
            <h1 className="text-xl font-semibold tracking-tight">Trakr</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant={currentPage === 'transactions' ? 'default' : 'ghost'}
              onClick={() => onNavigate('transactions')}
            >
              Transactions
            </Button>
            <Button 
              variant={currentPage === 'budgets' ? 'default' : 'ghost'}
              onClick={() => onNavigate('budgets')}
            >
              Budgets
            </Button>
            <Button 
              variant={currentPage === 'reports' ? 'default' : 'ghost'}
              onClick={() => onNavigate('reports')}
            >
              Reports
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              onClick={onAddTransaction}
              variant="default"
              className="flex items-center space-x-1"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add</span>
            </Button>
            
            {/* Mobile menu */}
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <WalletIcon className="h-5 w-5 text-trakr-neutral" />
                      <span>Trakr</span>
                    </SheetTitle>
                    <SheetDescription>
                      Track your finances with ease
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-2">
                    <Button 
                      variant={currentPage === 'dashboard' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => { 
                        onNavigate('dashboard');
                      }}
                    >
                      <BarChartIcon className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button 
                      variant={currentPage === 'transactions' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => {
                        onNavigate('transactions');
                      }}
                    >
                      <ArrowDownIcon className="mr-2 h-4 w-4" />
                      Transactions
                    </Button>
                    <Button 
                      variant={currentPage === 'budgets' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => {
                        onNavigate('budgets');
                      }}
                    >
                      <ArrowUpIcon className="mr-2 h-4 w-4" />
                      Budgets
                    </Button>
                    <Button 
                      variant={currentPage === 'reports' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => {
                        onNavigate('reports');
                      }}
                    >
                      <BarChartIcon className="mr-2 h-4 w-4" />
                      Reports
                    </Button>
                    <Button 
                      variant={currentPage === 'settings' ? 'default' : 'ghost'} 
                      className="w-full justify-start"
                      onClick={() => {
                        onNavigate('settings');
                      }}
                    >
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
