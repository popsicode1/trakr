
import { Sun, Menu, X, LogOut, User, Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { logoutUser, getCurrentUser } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function TrakrHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const [stealthMode, setStealthMode] = useState(false);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  const toggleStealthMode = () => {
    setStealthMode(!stealthMode);
    toast({
      title: stealthMode ? "Stealth Mode Deactivated" : "Stealth Mode Activated",
      description: stealthMode 
        ? "Your financial information is now visible." 
        : "Your financial information is now hidden from prying eyes.",
    });
  };

  return (
    <header className="bg-gradient-to-r from-primary/95 to-primary/80 shadow-md py-3 px-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-white/20 rounded-full p-1.5 mr-2">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Trakr
            </span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleStealthMode}
                title={stealthMode ? "Disable stealth mode" : "Enable stealth mode"}
                className="text-white/90 hover:text-white hover:bg-white/10"
              >
                {stealthMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              
              <div className="hidden md:flex items-center">
                <span className="text-sm mr-2">
                  Welcome, {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                    >
                      <User className="h-4 w-4 mr-1" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Privacy Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button size="icon" variant="ghost" className="text-white">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Trakr Menu</SheetTitle>
                    <SheetDescription>
                      Manage your account and settings
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-4">
                    <p className="text-sm font-medium">
                      Signed in as: {currentUser.email}
                    </p>
                    <Button variant="outline" className="w-full justify-start" onClick={toggleStealthMode}>
                      {stealthMode ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                      {stealthMode ? "Disable Stealth Mode" : "Enable Stealth Mode"}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Privacy Settings
                    </Button>
                    <SheetClose asChild>
                      <Button variant="default" className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
