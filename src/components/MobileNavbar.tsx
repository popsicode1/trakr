
import React from 'react';
import { HomeIcon, ListIcon, PieChartIcon, BarChart2Icon, PlusIcon, SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onAddTransaction: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  currentPage,
  onNavigate,
  onAddTransaction
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: HomeIcon },
    { id: 'transactions', label: 'Trans', icon: ListIcon },
    { id: 'add', label: '', icon: PlusIcon, action: onAddTransaction, highlight: true },
    { id: 'budgets', label: 'Budget', icon: PieChartIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors relative",
              item.highlight ? "text-primary-foreground" : 
                currentPage === item.id 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => item.action ? item.action() : onNavigate(item.id)}
            aria-label={item.label || item.id}
          >
            {item.highlight ? (
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center -mt-5 shadow-lg">
                <item.icon className="h-6 w-6" />
              </div>
            ) : (
              <>
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] mt-1">{item.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
