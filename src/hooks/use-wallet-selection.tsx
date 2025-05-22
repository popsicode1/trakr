
import { useState, useEffect } from 'react';
import { Wallet } from '@/lib/types';
import { getWallets } from '@/lib/firebase';
import { useToast } from './use-toast';

export function useWalletSelection() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setIsLoading(true);
        const result = await getWallets();
        
        if (result.success) {
          // Make sure to properly transform the data to match Wallet type
          const typedWallets: Wallet[] = result.wallets.map((wallet: any) => ({
            id: wallet.id || '',
            name: wallet.name || '',
            balance: wallet.balance || 0,
            currency: wallet.currency || 'PHP',
            color: wallet.color || '#E2E8F0',
            type: wallet.type || 'cash',
            isDefault: wallet.isDefault || false,
            createdAt: wallet.createdAt || new Date()
          }));
          
          setWallets(typedWallets);
        } else {
          toast({
            title: "Error loading wallets",
            description: "Could not load your wallets. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
        toast({
          title: "Error loading wallets",
          description: "Could not load your wallets. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallets();
  }, [toast]);

  const getDefaultWallet = (): string => {
    const defaultWallet = wallets.find(wallet => wallet.isDefault);
    return defaultWallet ? defaultWallet.id : wallets[0]?.id || '';
  };

  return {
    wallets,
    isLoading,
    getDefaultWallet,
  };
}
