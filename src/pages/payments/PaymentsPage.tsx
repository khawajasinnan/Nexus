import React, { useState } from 'react';
import {
    Wallet, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, DollarSign,
    TrendingUp, X, Send, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { usePayments } from '../../context/PaymentContext';
import { findUserById, users } from '../../data/users';
import { entrepreneurs } from '../../data/users';
import { TransactionStatus } from '../../types';

/* ─── Action Modal ─── */
const ActionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}> = ({ isOpen, onClose, title, icon, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                        {icon}
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
};

/* ─── Status badge config ─── */
const statusBadge: Record<TransactionStatus, { variant: 'success' | 'warning' | 'error'; icon: React.ReactNode }> = {
    completed: { variant: 'success', icon: <CheckCircle size={12} /> },
    pending: { variant: 'warning', icon: <Clock size={12} /> },
    failed: { variant: 'error', icon: <AlertCircle size={12} /> },
};

/* ─── Main PaymentsPage ─── */
export const PaymentsPage: React.FC = () => {
    const { user } = useAuth();
    const { getWallet, deposit, withdraw, transfer, fundDeal, getUserTransactions } = usePayments();

    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showFunding, setShowFunding] = useState(false);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [recipientId, setRecipientId] = useState('');

    if (!user) return null;

    const wallet = getWallet(user.id);
    const txns = getUserTransactions(user.id);
    const otherUsers = users.filter(u => u.id !== user.id);

    const resetForm = () => { setAmount(''); setDescription(''); setRecipientId(''); };

    const handleDeposit = () => {
        const val = parseFloat(amount);
        if (val > 0) { deposit(user.id, val); setShowDeposit(false); resetForm(); }
    };

    const handleWithdraw = () => {
        const val = parseFloat(amount);
        if (val > 0 && val <= wallet.balance) { withdraw(user.id, val); setShowWithdraw(false); resetForm(); }
    };

    const handleTransfer = () => {
        const val = parseFloat(amount);
        if (val > 0 && recipientId) { transfer(user.id, recipientId, val, description || 'Transfer'); setShowTransfer(false); resetForm(); }
    };

    const handleFund = () => {
        const val = parseFloat(amount);
        if (val > 0 && recipientId) { fundDeal(user.id, recipientId, val, description || 'Investment funding'); setShowFunding(false); resetForm(); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <Wallet size={24} className="text-primary-600" />
                    <span>Payments</span>
                </h1>
                <p className="text-gray-600 mt-1">Manage your wallet, transactions, and funding deals</p>
            </div>

            {/* Wallet + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Wallet Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />
                        <div className="relative">
                            <p className="text-sm text-primary-200 font-medium">Wallet Balance</p>
                            <h2 className="text-3xl font-bold mt-2">${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                            <p className="text-xs text-primary-300 mt-1">{wallet.currency}</p>
                            <div className="mt-6 flex items-center space-x-1.5">
                                <TrendingUp size={14} className="text-green-300" />
                                <span className="text-xs text-green-300 font-medium">Active account</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button onClick={() => setShowDeposit(true)} className="flex flex-col items-center p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors">
                            <ArrowDownLeft size={20} className="text-green-600" />
                            <span className="text-xs font-medium text-green-700 mt-1.5">Deposit</span>
                        </button>
                        <button onClick={() => setShowWithdraw(true)} className="flex flex-col items-center p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
                            <ArrowUpRight size={20} className="text-red-600" />
                            <span className="text-xs font-medium text-red-700 mt-1.5">Withdraw</span>
                        </button>
                        <button onClick={() => setShowTransfer(true)} className="flex flex-col items-center p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors">
                            <ArrowLeftRight size={20} className="text-blue-600" />
                            <span className="text-xs font-medium text-blue-700 mt-1.5">Transfer</span>
                        </button>
                        {user.role === 'investor' && (
                            <button onClick={() => setShowFunding(true)} className="flex flex-col items-center p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors">
                                <Send size={20} className="text-amber-600" />
                                <span className="text-xs font-medium text-amber-700 mt-1.5">Fund Deal</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Transaction History */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
                        </CardHeader>
                        <CardBody>
                            {txns.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-2 font-medium text-gray-500">Description</th>
                                                <th className="text-left py-3 px-2 font-medium text-gray-500">Type</th>
                                                <th className="text-right py-3 px-2 font-medium text-gray-500">Amount</th>
                                                <th className="text-left py-3 px-2 font-medium text-gray-500">Counterparty</th>
                                                <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                                                <th className="text-left py-3 px-2 font-medium text-gray-500">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {txns.map(txn => {
                                                const isOutgoing = txn.fromUserId === user.id;
                                                const counterpartyId = isOutgoing ? txn.toUserId : txn.fromUserId;
                                                const counterparty = counterpartyId ? findUserById(counterpartyId) : null;
                                                const sb = statusBadge[txn.status];
                                                return (
                                                    <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                        <td className="py-3 px-2">
                                                            <div className="flex items-center space-x-2">
                                                                <div className={`p-1.5 rounded-lg ${txn.type === 'deposit' ? 'bg-green-100' :
                                                                        txn.type === 'withdraw' ? 'bg-red-100' :
                                                                            txn.type === 'funding' ? 'bg-amber-100' : 'bg-blue-100'
                                                                    }`}>
                                                                    <DollarSign size={14} className={
                                                                        txn.type === 'deposit' ? 'text-green-600' :
                                                                            txn.type === 'withdraw' ? 'text-red-600' :
                                                                                txn.type === 'funding' ? 'text-amber-600' : 'text-blue-600'
                                                                    } />
                                                                </div>
                                                                <span className="font-medium text-gray-900">{txn.description}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <span className="capitalize text-gray-600">{txn.type}</span>
                                                        </td>
                                                        <td className={`py-3 px-2 text-right font-semibold ${(txn.type === 'deposit' || (!isOutgoing && txn.type === 'funding')) ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                            {(txn.type === 'deposit' || (!isOutgoing && txn.type === 'funding')) ? '+' : '-'}${txn.amount.toLocaleString()}
                                                        </td>
                                                        <td className="py-3 px-2 text-gray-600">
                                                            {counterparty ? counterparty.name : '—'}
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <Badge variant={sb.variant} size="sm">
                                                                <span className="flex items-center space-x-1">{sb.icon}<span>{txn.status}</span></span>
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-2 text-gray-500">
                                                            {new Date(txn.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <DollarSign size={32} className="mx-auto text-gray-300" />
                                    <p className="text-gray-500 mt-2">No transactions yet</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* ─── Modals ─── */}

            {/* Deposit */}
            <ActionModal isOpen={showDeposit} onClose={() => { setShowDeposit(false); resetForm(); }} title="Deposit Funds" icon={<ArrowDownLeft size={18} className="text-green-600" />}>
                <div className="space-y-4">
                    <Input label="Amount ($)" type="number" value={amount} onChange={e => setAmount(e.target.value)} fullWidth placeholder="Enter amount" />
                    <Button fullWidth onClick={handleDeposit} disabled={!amount || parseFloat(amount) <= 0}>Deposit</Button>
                </div>
            </ActionModal>

            {/* Withdraw */}
            <ActionModal isOpen={showWithdraw} onClose={() => { setShowWithdraw(false); resetForm(); }} title="Withdraw Funds" icon={<ArrowUpRight size={18} className="text-red-600" />}>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Available: <span className="font-semibold text-gray-900">${wallet.balance.toLocaleString()}</span></p>
                    <Input label="Amount ($)" type="number" value={amount} onChange={e => setAmount(e.target.value)} fullWidth placeholder="Enter amount" />
                    <Button fullWidth onClick={handleWithdraw} disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > wallet.balance}>Withdraw</Button>
                </div>
            </ActionModal>

            {/* Transfer */}
            <ActionModal isOpen={showTransfer} onClose={() => { setShowTransfer(false); resetForm(); }} title="Transfer Funds" icon={<ArrowLeftRight size={18} className="text-blue-600" />}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                        <select value={recipientId} onChange={e => setRecipientId(e.target.value)} className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500">
                            <option value="">Select recipient...</option>
                            {otherUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                        </select>
                    </div>
                    <Input label="Amount ($)" type="number" value={amount} onChange={e => setAmount(e.target.value)} fullWidth placeholder="Enter amount" />
                    <Input label="Note (optional)" value={description} onChange={e => setDescription(e.target.value)} fullWidth placeholder="What's this for?" />
                    <Button fullWidth onClick={handleTransfer} disabled={!amount || !recipientId || parseFloat(amount) <= 0}>Send Transfer</Button>
                </div>
            </ActionModal>

            {/* Fund Deal (Investor only) */}
            <ActionModal isOpen={showFunding} onClose={() => { setShowFunding(false); resetForm(); }} title="Fund a Startup" icon={<Send size={18} className="text-amber-600" />}>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Send investment funding directly to an entrepreneur's wallet.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Entrepreneur</label>
                        <select value={recipientId} onChange={e => setRecipientId(e.target.value)} className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500">
                            <option value="">Select startup...</option>
                            {entrepreneurs.map(e => <option key={e.id} value={e.id}>{e.name} — {e.startupName}</option>)}
                        </select>
                    </div>
                    <Input label="Funding Amount ($)" type="number" value={amount} onChange={e => setAmount(e.target.value)} fullWidth placeholder="Enter investment amount" />
                    <Input label="Deal Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth placeholder="e.g. Seed round — Series A" />
                    <Button fullWidth onClick={handleFund} disabled={!amount || !recipientId || parseFloat(amount) <= 0}>Send Funding</Button>
                </div>
            </ActionModal>
        </div>
    );
};
