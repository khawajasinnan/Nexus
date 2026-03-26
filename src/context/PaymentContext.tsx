import React, { createContext, useContext, useState, useCallback } from 'react';
import { Wallet, Transaction, PaymentContextType } from '../types';
import { initialWallets, initialTransactions, generateTxnId } from '../data/payments';

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayments = (): PaymentContextType => {
    const ctx = useContext(PaymentContext);
    if (!ctx) throw new Error('usePayments must be used within PaymentProvider');
    return ctx;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wallets, setWallets] = useState<Wallet[]>(initialWallets);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

    const getWallet = useCallback(
        (userId: string): Wallet => {
            const found = wallets.find(w => w.userId === userId);
            return found || { userId, balance: 0, currency: 'USD' };
        },
        [wallets]
    );

    const addTxn = (txn: Omit<Transaction, 'id' | 'createdAt'>) => {
        const newTxn: Transaction = { ...txn, id: generateTxnId(), createdAt: new Date().toISOString() };
        setTransactions(prev => [newTxn, ...prev]);
    };

    const deposit = useCallback((userId: string, amount: number) => {
        setWallets(prev => {
            const exists = prev.some(w => w.userId === userId);
            if (!exists) return [...prev, { userId, balance: amount, currency: 'USD' }];
            return prev.map(w => w.userId === userId ? { ...w, balance: w.balance + amount } : w);
        });
        addTxn({ type: 'deposit', amount, currency: 'USD', fromUserId: userId, description: 'Wallet deposit', status: 'completed' });
    }, []);

    const withdraw = useCallback((userId: string, amount: number) => {
        setWallets(prev => prev.map(w => w.userId === userId ? { ...w, balance: Math.max(0, w.balance - amount) } : w));
        addTxn({ type: 'withdraw', amount, currency: 'USD', fromUserId: userId, description: 'Withdrawal to bank', status: 'completed' });
    }, []);

    const transfer = useCallback((fromId: string, toId: string, amount: number, description: string) => {
        setWallets(prev => {
            const hasToUser = prev.some(w => w.userId === toId);
            let updated = prev.map(w => {
                if (w.userId === fromId) return { ...w, balance: Math.max(0, w.balance - amount) };
                if (w.userId === toId) return { ...w, balance: w.balance + amount };
                return w;
            });
            if (!hasToUser) updated = [...updated, { userId: toId, balance: amount, currency: 'USD' }];
            return updated;
        });
        addTxn({ type: 'transfer', amount, currency: 'USD', fromUserId: fromId, toUserId: toId, description, status: 'completed' });
    }, []);

    const fundDeal = useCallback((investorId: string, entrepreneurId: string, amount: number, description: string) => {
        setWallets(prev => {
            // Ensure entrepreneur wallet exists
            const hasEntrepreneurWallet = prev.some(w => w.userId === entrepreneurId);
            let updated = prev.map(w => {
                if (w.userId === investorId) return { ...w, balance: Math.max(0, w.balance - amount) };
                if (w.userId === entrepreneurId) return { ...w, balance: w.balance + amount };
                return w;
            });
            if (!hasEntrepreneurWallet) {
                updated = [...updated, { userId: entrepreneurId, balance: amount, currency: 'USD' }];
            }
            return updated;
        });
        addTxn({ type: 'funding', amount, currency: 'USD', fromUserId: investorId, toUserId: entrepreneurId, description, status: 'completed' });
    }, []);

    const getUserTransactions = useCallback(
        (userId: string) => transactions.filter(t => t.fromUserId === userId || t.toUserId === userId),
        [transactions]
    );

    return (
        <PaymentContext.Provider value={{ wallets, transactions, getWallet, deposit, withdraw, transfer, fundDeal, getUserTransactions }}>
            {children}
        </PaymentContext.Provider>
    );
};
