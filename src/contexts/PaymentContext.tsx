import { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentContextType {
  isPremium: boolean;
  setPremium: (premium: boolean) => void;
  hasAccessToFeature: (feature: string) => boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);

  const hasAccessToFeature = (feature: string) => {
    if (feature === 'basic-dashboard') return true;
    return isPremium;
  };

  return (
    <PaymentContext.Provider value={{
      isPremium,
      setPremium: setIsPremium,
      hasAccessToFeature
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
}
