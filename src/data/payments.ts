import { Transaction, Wallet } from '../types';

export const initialWallets: Wallet[] = [
    { userId: 'e1', balance: 12500, currency: 'USD' },
    { userId: 'e2', balance: 8200, currency: 'USD' },
    { userId: 'e3', balance: 3700, currency: 'USD' },
    { userId: 'e4', balance: 5100, currency: 'USD' },
    { userId: 'i1', balance: 250000, currency: 'USD' },
    { userId: 'i2', balance: 180000, currency: 'USD' },
    { userId: 'i3', balance: 320000, currency: 'USD' },
];

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const initialTransactions: Transaction[] = [
    {
        id: 'txn1',
        type: 'funding',
        amount: 50000,
        currency: 'USD',
        fromUserId: 'i1',
        toUserId: 'e1',
        description: 'Seed funding — TechWave AI',
        status: 'completed',
        createdAt: daysAgo(14),
    },
    {
        id: 'txn2',
        type: 'deposit',
        amount: 25000,
        currency: 'USD',
        fromUserId: 'i2',
        description: 'Wallet top-up',
        status: 'completed',
        createdAt: daysAgo(10),
    },
    {
        id: 'txn3',
        type: 'funding',
        amount: 30000,
        currency: 'USD',
        fromUserId: 'i2',
        toUserId: 'e2',
        description: 'Investment — GreenLife Packaging',
        status: 'completed',
        createdAt: daysAgo(7),
    },
    {
        id: 'txn4',
        type: 'withdraw',
        amount: 5000,
        currency: 'USD',
        fromUserId: 'e1',
        description: 'Withdrawal to bank',
        status: 'completed',
        createdAt: daysAgo(5),
    },
    {
        id: 'txn5',
        type: 'transfer',
        amount: 2000,
        currency: 'USD',
        fromUserId: 'e1',
        toUserId: 'e2',
        description: 'Partnership payment',
        status: 'pending',
        createdAt: daysAgo(2),
    },
    {
        id: 'txn6',
        type: 'deposit',
        amount: 10000,
        currency: 'USD',
        fromUserId: 'i3',
        description: 'Wallet deposit',
        status: 'completed',
        createdAt: daysAgo(1),
    },
];

let txnCounter = initialTransactions.length;
export const generateTxnId = () => `txn${++txnCounter}`;
