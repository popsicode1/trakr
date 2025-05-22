
import React from 'react';
import { Moon, Sun, MessagesSquare, Home, Wallet, PieChart, Settings, Lightbulb, BarChart2, Trophy, Heart, UserIcon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AppSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    onNavigate(page);
  };
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Trakr</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'dashboard'}
                  onClick={() => handleNavigate('dashboard')}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'transactions'}
                  onClick={() => handleNavigate('transactions')}
                >
                  <Wallet className="h-4 w-4" />
                  <span>Transactions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'budgets'}
                  onClick={() => handleNavigate('budgets')}
                >
                  <PieChart className="h-4 w-4" />
                  <span>Budgets</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'reports'}
                  onClick={() => handleNavigate('reports')}
                >
                  <BarChart2 className="h-4 w-4" />
                  <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'ai-advisor'}
                  onClick={() => handleNavigate('ai-advisor')}
                >
                  <MessagesSquare className="h-4 w-4" />
                  <span>Financial AI Advisor</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <Separator className="my-4" />
        
        <SidebarGroup>
          <SidebarGroupLabel>Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'personality-quiz'}
                  onClick={() => handleNavigate('personality-quiz')}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Personality Quiz</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'streaks'}
                  onClick={() => handleNavigate('streaks')}
                >
                  <Trophy className="h-4 w-4" />
                  <span>Behavioral Streaks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'shame-free'}
                  onClick={() => handleNavigate('shame-free')}
                >
                  <Heart className="h-4 w-4" />
                  <span>Shame-Free Mode</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'gamified'}
                  onClick={() => handleNavigate('gamified')}
                >
                  <Trophy className="h-4 w-4" />
                  <span>Gamified Features</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'mindful'}
                  onClick={() => handleNavigate('mindful')}
                >
                  <Heart className="h-4 w-4" />
                  <span>Mindful Add-Ons</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <Separator className="my-4" />
        
        <SidebarGroup>
          <SidebarGroupLabel>More</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'tools'}
                  onClick={() => handleNavigate('tools')}
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>Mini Tools</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === 'settings'}
                  onClick={() => handleNavigate('settings')}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 space-y-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center gap-2"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          )}
        </Button>
        
        <div className="text-xs text-center text-muted-foreground">
          Trakr v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
