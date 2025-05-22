
import React, { useState } from 'react';
import { PlusIcon, MinusIcon, Pencil, WalletIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from '@/lib/types';
import { getWallets, saveWallets, generateId } from '@/lib/data';

const WalletManagement = () => {
  const [wallets, setWallets] = useState<Wallet[]>(getWallets());
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    balance: 0,
    currency: 'USD',
    color: '#4299E1',
  });
  const { toast } = useToast();

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value,
    });
  };

  const handleAddWallet = () => {
    const newWallet: Wallet = {
      id: generateId(),
      name: formData.name,
      balance: formData.balance,
      currency: formData.currency,
      color: formData.color,
      createdAt: new Date(),
      isDefault: wallets.length === 0,
    };

    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    saveWallets(updatedWallets);
    setOpenAddDialog(false);
    resetForm();

    toast({
      title: "Wallet Added",
      description: `${formData.name} wallet has been added successfully.`,
    });
  };

  const handleEditWallet = () => {
    if (!currentWallet) return;

    const updatedWallets = wallets.map(wallet => 
      wallet.id === currentWallet.id 
        ? { 
            ...wallet, 
            name: formData.name, 
            balance: formData.balance, 
            currency: formData.currency,
            color: formData.color 
          } 
        : wallet
    );

    setWallets(updatedWallets);
    saveWallets(updatedWallets);
    setOpenEditDialog(false);
    resetForm();

    toast({
      title: "Wallet Updated",
      description: `${formData.name} wallet has been updated successfully.`,
    });
  };

  const handleDeleteWallet = (id: string) => {
    const updatedWallets = wallets.filter(wallet => wallet.id !== id);
    
    // If we're deleting the default wallet, set the first remaining wallet as default
    if (wallets.find(w => w.id === id)?.isDefault && updatedWallets.length > 0) {
      updatedWallets[0].isDefault = true;
    }
    
    setWallets(updatedWallets);
    saveWallets(updatedWallets);
    
    toast({
      title: "Wallet Deleted",
      description: "The wallet has been removed successfully.",
    });
  };

  const editWallet = (wallet: Wallet) => {
    setCurrentWallet(wallet);
    setFormData({
      name: wallet.name,
      balance: wallet.balance,
      currency: wallet.currency,
      color: wallet.color,
    });
    setOpenEditDialog(true);
  };

  const setDefaultWallet = (id: string) => {
    const updatedWallets = wallets.map(wallet => ({
      ...wallet,
      isDefault: wallet.id === id,
    }));
    
    setWallets(updatedWallets);
    saveWallets(updatedWallets);
    
    toast({
      title: "Default Wallet Updated",
      description: "Your default wallet has been updated.",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      balance: 0,
      currency: 'USD',
      color: '#4299E1',
    });
    setCurrentWallet(null);
  };

  // Format balance with currency
  const formatBalance = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Total Balance Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-blue-800">
            Total Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center text-blue-700">
            {formatBalance(totalBalance, 'USD')}
          </div>
          <div className="text-sm text-center text-gray-500 mt-2">
            Across {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Wallets List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Wallets</h2>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => resetForm()}>
                <PlusIcon className="mr-1 h-4 w-4" />
                Add Wallet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Wallet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Wallet Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Cash, Bank Account"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Initial Balance</Label>
                  <Input
                    id="balance"
                    name="balance"
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    name="currency"
                    placeholder="USD"
                    value={formData.currency}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-12 h-8 p-0"
                    />
                    <span className="text-sm">{formData.color}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={handleAddWallet}>
                  Add Wallet
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {wallets.length === 0 ? (
          <div className="text-center py-10">
            <WalletIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No wallets added yet</p>
            <p className="text-sm text-gray-400">Add a wallet to start tracking your finances</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {wallets.map(wallet => (
              <Card key={wallet.id} className="border-l-4" style={{ borderLeftColor: wallet.color }}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{wallet.name}</h3>
                        {wallet.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {formatBalance(wallet.balance, wallet.currency)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => editWallet(wallet)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {!wallet.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => setDefaultWallet(wallet.id)}>
                          Set Default
                        </Button>
                      )}
                      {wallets.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteWallet(wallet.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Wallet Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Wallet Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-balance">Balance</Label>
              <Input
                id="edit-balance"
                name="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-currency">Currency</Label>
              <Input
                id="edit-currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="edit-color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-12 h-8 p-0"
                />
                <span className="text-sm">{formData.color}</span>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleEditWallet}>
              Update Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletManagement;
