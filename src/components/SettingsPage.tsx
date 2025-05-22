
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { Input } from '@/components/ui/input';
import { useMediaQuery } from '@/hooks/use-mobile';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Settings state
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en-US');
  const [notifications, setNotifications] = useState(true);
  const [shameFreeMode, setShameFreeMode] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState('weekly');
  const [exportFormat, setExportFormat] = useState('csv');
  
  // User profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    // Load persistent settings
    const savedCurrency = localStorage.getItem('trakr-currency');
    const savedLanguage = localStorage.getItem('trakr-language');
    const savedNotifications = localStorage.getItem('trakr-notifications');
    const savedShameFreeMode = localStorage.getItem('trakr-shame-free');
    const savedBackupFrequency = localStorage.getItem('trakr-backup-frequency');
    const savedExportFormat = localStorage.getItem('trakr-export-format');
    const savedDisplayName = localStorage.getItem('trakr-display-name');
    const savedEmail = localStorage.getItem('trakr-email');
    
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedNotifications !== null) setNotifications(savedNotifications === 'true');
    if (savedShameFreeMode !== null) setShameFreeMode(savedShameFreeMode === 'true');
    if (savedBackupFrequency) setBackupFrequency(savedBackupFrequency);
    if (savedExportFormat) setExportFormat(savedExportFormat);
    if (savedDisplayName) setDisplayName(savedDisplayName);
    if (savedEmail) setEmail(savedEmail);
  }, []);
  
  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('trakr-currency', currency);
    localStorage.setItem('trakr-language', language);
    localStorage.setItem('trakr-notifications', String(notifications));
    localStorage.setItem('trakr-shame-free', String(shameFreeMode));
    localStorage.setItem('trakr-backup-frequency', backupFrequency);
    localStorage.setItem('trakr-export-format', exportFormat);
    localStorage.setItem('trakr-display-name', displayName);
    localStorage.setItem('trakr-email', email);
    
    // Apply shame-free mode to the document
    document.documentElement.setAttribute('data-shame-free', shameFreeMode ? 'true' : 'false');
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Handle shame-free mode toggle
  const handleShameFreeToggle = (checked: boolean) => {
    setShameFreeMode(checked);
  };
  
  // Clear all data
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.removeItem('transactions');
      localStorage.removeItem('budgets');
      localStorage.removeItem('wallets');
      localStorage.removeItem('habits');
      localStorage.removeItem('streaks');
      
      toast({
        title: "Data cleared",
        description: "All your financial data has been cleared.",
      });
      
      // Refresh the page to show empty state
      window.location.reload();
    }
  };
  
  // Export data as JSON
  const exportData = () => {
    const data = {
      transactions: localStorage.getItem('transactions'),
      budgets: localStorage.getItem('budgets'),
      wallets: localStorage.getItem('wallets'),
      habits: localStorage.getItem('habits'),
      streaks: localStorage.getItem('streaks'),
      settings: {
        currency,
        language,
        theme,
        notifications,
        shameFreeMode,
        backupFrequency,
      }
    };
    
    // Convert to appropriate format
    let content, filename, contentType;
    
    if (exportFormat === 'csv') {
      // Simple CSV conversion for demo
      content = 'data:text/csv;charset=utf-8,';
      content += 'Category,Data\n';
      Object.entries(data).forEach(([key, value]) => {
        content += `${key},${value}\n`;
      });
      filename = 'trakr-export.csv';
      contentType = 'text/csv';
    } else {
      // JSON is default
      content = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
      filename = 'trakr-export.json';
      contentType = 'application/json';
    }
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', content);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: `Your data has been exported as ${filename}`,
    });
  };
  
  return (
    <div className="space-y-4 md:space-y-6">
      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="w-full mb-6 overflow-x-auto no-scrollbar">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interface Settings</CardTitle>
              <CardDescription>Customize how Trakr looks and behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-toggle">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shame-free-toggle">Shame-Free Mode</Label>
                  <p className="text-sm text-muted-foreground">Use positive, non-judgmental language</p>
                </div>
                <Switch
                  id="shame-free-toggle"
                  checked={shameFreeMode}
                  onCheckedChange={handleShameFreeToggle}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency-select">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency-select">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="PHP">PHP - Philippine Peso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language-select">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className={isMobile ? "flex flex-col space-y-2" : "flex justify-between"}>
              <Button className="w-full md:w-auto" onClick={saveSettings}>Save Preferences</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notification-toggle">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts about your finances</p>
                </div>
                <Switch
                  id="notification-toggle"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input 
                  id="display-name" 
                  placeholder="Your display name" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="your.email@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter className={isMobile ? "flex flex-col space-y-2" : "flex justify-between"}>
              <Button className="w-full md:w-auto" onClick={saveSettings}>Save Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Management</CardTitle>
              <CardDescription>Backup and export your financial data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="export-format">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Auto-Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className={isMobile ? "flex flex-col space-y-2" : "flex justify-between items-center"}>
              <Button className="w-full md:w-auto" variant="outline" onClick={exportData}>
                Export Data
              </Button>
              <Button className="w-full md:w-auto" variant="destructive" onClick={clearAllData}>
                Clear All Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Trakr</CardTitle>
              <CardDescription>Application information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-center p-4">
                <h3 className="font-semibold text-xl">Trakr</h3>
                <p className="text-muted-foreground">Version 1.0.0</p>
                <p className="mt-4">A personal finance tracker focused on financial wellness and mindful spending.</p>
                <p className="text-xs text-muted-foreground mt-6">
                  &copy; {new Date().getFullYear()} Trakr. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
