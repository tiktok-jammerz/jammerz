import { createContext, useContext, useState, ReactNode } from 'react';

interface Transaction {
  id: string;
  type: 'reinvest' | 'withdraw' | 'purchase' | 'borrow' | 'earn';
  amount: number;
  timestamp: Date;
  description: string;
}

interface BalanceContextType {
  totalCoins: number;
  availableCoins: number;
  investedCoins: number;
  borrowedCoins: number;
  transactions: Transaction[];
  reinvestCoins: (amount: number, description?: string) => boolean;
  withdrawCoins: (amount: number, description?: string) => boolean;
  purchaseWithCoins: (amount: number, description?: string) => boolean;
  borrowCoins: (amount: number, description?: string) => boolean;
  earnCoins: (amount: number, description?: string) => void;
  getUSDEquivalent: (coins: number) => number;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

interface BalanceProviderProps {
  children: ReactNode;
}

export const BalanceProvider = ({ children }: BalanceProviderProps) => {
  const [totalCoins, setTotalCoins] = useState(12547); // Starting balance
  const [investedCoins, setInvestedCoins] = useState(0);
  const [borrowedCoins, setBorrowedCoins] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // USD conversion rate (100 coins = $1)
  const coinsToUSDRate = 0.01;

  const availableCoins = totalCoins - investedCoins;

  const addTransaction = (type: Transaction['type'], amount: number, description: string) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      timestamp: new Date(),
      description,
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const reinvestCoins = (amount: number, description = 'Reinvestment') => {
    if (amount <= 0 || amount > availableCoins) {
      return false;
    }
    setInvestedCoins(prev => prev + amount);
    addTransaction('reinvest', amount, description);
    return true;
  };

  const withdrawCoins = (amount: number, description = 'Withdrawal') => {
    if (amount <= 0 || amount > availableCoins) {
      return false;
    }
    setTotalCoins(prev => prev - amount);
    addTransaction('withdraw', amount, description);
    return true;
  };

  const purchaseWithCoins = (amount: number, description = 'Purchase') => {
    if (amount <= 0 || amount > availableCoins) {
      return false;
    }
    setTotalCoins(prev => prev - amount);
    addTransaction('purchase', amount, description);
    return true;
  };

  const borrowCoins = (amount: number, description = 'Borrowed coins') => {
    if (amount <= 0) {
      return false;
    }
    setTotalCoins(prev => prev + amount);
    setBorrowedCoins(prev => prev + amount);
    addTransaction('borrow', amount, description);
    return true;
  };

  const earnCoins = (amount: number, description = 'Earned coins') => {
    if (amount <= 0) return;
    setTotalCoins(prev => prev + amount);
    addTransaction('earn', amount, description);
  };

  const getUSDEquivalent = (coins: number) => {
    return coins * coinsToUSDRate;
  };

  const value: BalanceContextType = {
    totalCoins,
    availableCoins,
    investedCoins,
    borrowedCoins,
    transactions,
    reinvestCoins,
    withdrawCoins,
    purchaseWithCoins,
    borrowCoins,
    earnCoins,
    getUSDEquivalent,
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
};