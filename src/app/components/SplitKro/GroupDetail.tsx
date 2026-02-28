import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Users, DollarSign, BarChart2, Loader2, UserPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { splitKroApi, SKGroup, SKMember, SKExpense, BalanceEntry } from '../../utils/splitkro-api';
import { simplifyDebts } from '../../utils/debtSimplifier';
import { AddExpenseModal } from './AddExpenseModal.tsx';
import { SettleUpModal } from './SettleUpModal.tsx';

const INDIGO = '#818CF8';
const INDIGO_DARK = '#6366F1';
const headingFont: React.CSSProperties = { fontFamily: 'Inter, Geist, SF Pro, sans-serif' };
const monoFont: React.CSSProperties = { fontFamily: 'JetBrains Mono, "Courier New", monospace' };

const glass = (): React.CSSProperties => ({
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
});

const indigoCard = (): React.CSSProperties => ({
    background: 'rgba(99,102,241,0.07)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(129,140,248,0.18)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
});

// ─── Add Member Modal ────────────────────────────────────────────────────────
function AddMemberModal({ groupId, onClose, onAdded }: {
    groupId: string; onClose: () => void; onAdded: () => void;
}) {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName.trim()) return toast.error('Name is required');
        setLoading(true);
        const { error } = await splitKroApi.addMember(groupId, displayName.trim(), email.trim());
        setLoading(false);
        if (error) return toast.error(error);
        toast.success(`${displayName} added to group!`);
        onAdded();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
            <motion.div className="w-full max-w-md rounded-2xl p-7 relative overflow-hidden"
                style={{
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(36px)',
                    border: '1px solid rgba(99,102,241,0.28)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.85)',
                }}
                initial={{ opacity: 0, scale: 0.88, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}>
                <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(129,140,248,0.6), transparent)' }} />
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white" style={headingFont}>Add Member</h3>
                    <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }}
                        onMouseEnter={e => (e.currentTarget.style.color = INDIGO)}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Name *</label>
                        <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                            placeholder="e.g. Rohan Sharma"
                            style={{
                                width: '100%', padding: '10px 14px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.25)',
                                borderRadius: '10px', color: '#fff', outline: 'none', ...monoFont,
                            }} autoFocus />
                    </div>
                    <div>
                        <label className="block text-sm mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Email (optional)</label>
                        <input value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="rohan@example.com" type="email"
                            style={{
                                width: '100%', padding: '10px 14px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.25)',
                                borderRadius: '10px', color: '#fff', outline: 'none', ...monoFont,
                            }} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl text-sm"
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#A1A1A1', border: '1px solid rgba(255,255,255,0.1)', ...monoFont }}>
                            Cancel
                        </button>
                        <motion.button type="submit" disabled={loading}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                            style={{
                                background: `linear-gradient(135deg, ${INDIGO_DARK}, #8B5CF6)`,
                                color: '#fff', border: 'none', ...headingFont,
                                opacity: loading ? 0.7 : 1,
                            }}
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                            {loading ? 'Adding...' : 'Add Member'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ─── Group Detail ────────────────────────────────────────────────────────────
interface GroupDetailProps {
    group: SKGroup;
    userId: string;
    userName: string;
    onBack: () => void;
}

type Tab = 'expenses' | 'balances' | 'settle';

export function GroupDetail({ group, userId, userName, onBack }: GroupDetailProps) {
    const [activeTab, setActiveTab] = useState<Tab>('expenses');
    const [members, setMembers] = useState<SKMember[]>([]);
    const [expenses, setExpenses] = useState<SKExpense[]>([]);
    const [balances, setBalances] = useState<BalanceEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showSettle, setShowSettle] = useState(false);

    const loadAll = async () => {
        setLoading(true);
        const [mRes, eRes] = await Promise.all([
            splitKroApi.getGroupMembers(group.id),
            splitKroApi.getGroupExpenses(group.id),
        ]);
        const fetchedMembers = mRes.data || [];
        const fetchedExpenses = eRes.data || [];
        setMembers(fetchedMembers);
        setExpenses(fetchedExpenses);

        if (fetchedMembers.length > 0) {
            const bRes = await splitKroApi.getBalances(group.id, fetchedMembers);
            setBalances(bRes.data || []);
        }
        setLoading(false);
    };

    useEffect(() => { loadAll(); }, [group.id]);

    const groupTotal = expenses.filter(e => e.description !== '✅ Settlement').reduce((s, e) => s + e.total_amount, 0);
    const myBalance = balances.find(b => b.userId === userId);
    const settlements = simplifyDebts(balances.map(b => ({ userId: b.userId, displayName: b.displayName, netBalance: b.netBalance })));

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: 'expenses', label: 'Expenses', icon: DollarSign },
        { id: 'balances', label: 'Balances', icon: BarChart2 },
        { id: 'settle', label: 'Settle Up', icon: Users },
    ];

    return (
        <div className="relative">
            {/* Header */}
            <motion.div className="mb-6" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                <button onClick={onBack}
                    className="flex items-center gap-2 mb-4 text-sm"
                    style={{ color: '#A1A1A1', ...monoFont }}
                    onMouseEnter={e => (e.currentTarget.style.color = INDIGO)}
                    onMouseLeave={e => (e.currentTarget.style.color = '#A1A1A1')}>
                    <ArrowLeft className="size-4" /> Back to Groups
                </button>

                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1" style={headingFont}>{group.name}</h1>
                        <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>
                            {members.length} member{members.length !== 1 ? 's' : ''} · {group.type}
                        </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <motion.button onClick={() => setShowAddMember(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(129,140,248,0.25)', color: INDIGO, ...monoFont }}
                            whileHover={{ scale: 1.03, background: 'rgba(99,102,241,0.18)' }}
                            whileTap={{ scale: 0.97 }}>
                            <UserPlus className="size-4" /> Add Member
                        </motion.button>
                        <motion.button onClick={() => setShowAddExpense(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                            style={{
                                background: `linear-gradient(135deg, ${INDIGO_DARK}, #8B5CF6)`,
                                color: '#fff', ...headingFont,
                                boxShadow: '0 0 16px rgba(99,102,241,0.3)',
                            }}
                            whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(99,102,241,0.5)' }}
                            whileTap={{ scale: 0.97 }}>
                            <Plus className="size-4" /> Add Expense
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {[
                    {
                        label: 'Group Total', value: `₹${groupTotal.toLocaleString()}`,
                        color: INDIGO, icon: '💰',
                    },
                    {
                        label: 'Your Balance',
                        value: myBalance ? `${myBalance.netBalance >= 0 ? '+' : ''}₹${Math.abs(myBalance.netBalance).toFixed(0)}` : '₹0',
                        color: myBalance && myBalance.netBalance >= 0 ? '#34D399' : '#F87171',
                        icon: myBalance && myBalance.netBalance >= 0 ? '✅' : '⚠️',
                    },
                    {
                        label: 'Expenses', value: expenses.filter(e => e.description !== '✅ Settlement').length.toString(),
                        color: '#FBBF24', icon: '📋',
                    },
                ].map((s, i) => (
                    <motion.div key={i} className="p-4 rounded-xl"
                        style={indigoCard()}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{s.icon}</span>
                            <span className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}>{s.label}</span>
                        </div>
                        <div className="text-xl font-bold" style={{ color: s.color, ...headingFont }}>{s.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setActiveTab(id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                        style={activeTab === id ? {
                            background: `linear-gradient(135deg, ${INDIGO_DARK}, #8B5CF6)`,
                            color: '#fff', ...headingFont,
                            boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                        } : { color: '#A1A1A1', ...headingFont }}>
                        <Icon className="size-4" />
                        <span className="hidden sm:inline">{label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {loading ? (
                <div className="py-20 text-center">
                    <Loader2 className="size-8 mx-auto mb-3 animate-spin" style={{ color: INDIGO }} />
                    <p style={{ color: '#A1A1A1', ...monoFont }}>Loading group data...</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {/* EXPENSES TAB */}
                    {activeTab === 'expenses' && (
                        <motion.div key="expenses" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            {expenses.length === 0 ? (
                                <div className="py-20 text-center rounded-2xl" style={indigoCard()}>
                                    <div className="text-4xl mb-3">💸</div>
                                    <p className="text-white font-semibold mb-1" style={headingFont}>No expenses yet</p>
                                    <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>Add your first shared expense</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {expenses.map((exp, i) => {
                                        const payer = members.find(m => m.user_id === exp.paid_by);
                                        const payerName = payer?.display_name || 'Unknown';
                                        const isSettlement = exp.description === '✅ Settlement';
                                        return (
                                            <motion.div key={exp.id}
                                                className="p-5 rounded-xl flex items-center justify-between group"
                                                style={isSettlement ? glass() : indigoCard()}
                                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                                whileHover={{ scale: 1.01 }}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                                                        style={{ background: isSettlement ? 'rgba(52,211,153,0.1)' : 'rgba(99,102,241,0.12)', border: `1px solid ${isSettlement ? 'rgba(52,211,153,0.2)' : 'rgba(129,140,248,0.2)'}` }}>
                                                        {isSettlement ? '✅' : '💳'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white" style={headingFont}>{exp.description}</div>
                                                        <div className="text-xs mt-0.5" style={{ color: '#A1A1A1', ...monoFont }}>
                                                            Paid by {exp.paid_by === userId ? 'You' : payerName} · {new Date(exp.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <div className="font-bold text-lg" style={{ color: isSettlement ? '#34D399' : INDIGO, ...headingFont }}>
                                                            ₹{exp.total_amount.toLocaleString()}
                                                        </div>
                                                        <div className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}>{exp.split_type}</div>
                                                    </div>
                                                    {!isSettlement && (
                                                        <button onClick={async () => {
                                                            if (!confirm('Delete this expense?')) return;
                                                            const { error } = await splitKroApi.deleteExpense(exp.id);
                                                            if (error) return toast.error(error);
                                                            toast.success('Expense deleted');
                                                            loadAll();
                                                        }} className="opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:text-red-300 p-1">
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* BALANCES TAB */}
                    {activeTab === 'balances' && (
                        <motion.div key="balances" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            {balances.length === 0 ? (
                                <div className="py-20 text-center rounded-2xl" style={indigoCard()}>
                                    <div className="text-4xl mb-3">📊</div>
                                    <p className="text-white font-semibold" style={headingFont}>Add expenses to see balances</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {balances.map((bal, i) => {
                                        const isMe = bal.userId === userId;
                                        const isPositive = bal.netBalance >= 0;
                                        return (
                                            <motion.div key={bal.userId}
                                                className="p-5 rounded-xl"
                                                style={indigoCard()}
                                                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                                                            style={{
                                                                background: isMe ? `linear-gradient(135deg, ${INDIGO_DARK}, #8B5CF6)` : 'rgba(255,255,255,0.08)',
                                                                color: '#fff',
                                                            }}>
                                                            {(bal.displayName || 'U')[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-white" style={headingFont}>
                                                                {isMe ? `${bal.displayName} (You)` : bal.displayName}
                                                            </div>
                                                            <div className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}>
                                                                Paid ₹{bal.totalPaid.toFixed(0)} · Owes ₹{bal.totalOwed.toFixed(0)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`text-lg font-bold`}
                                                        style={{ color: isPositive ? '#34D399' : '#F87171', ...headingFont }}>
                                                        {isPositive ? '+' : ''}₹{Math.abs(bal.netBalance).toFixed(0)}
                                                    </div>
                                                </div>

                                                {/* Balance bar */}
                                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                                                    <motion.div className="h-full rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(Math.abs(bal.netBalance) / Math.max(1, groupTotal) * 100 * 3, 100)}%` }}
                                                        transition={{ duration: 0.6, delay: i * 0.07 }}
                                                        style={{ background: isPositive ? '#34D399' : '#F87171' }} />
                                                </div>

                                                <div className="mt-2 text-xs" style={{ color: '#A1A1A1', ...monoFont }}>
                                                    {isPositive ? `Others owe ${isMe ? 'you' : bal.displayName} ₹${bal.netBalance.toFixed(0)}` : `${isMe ? 'You owe' : `${bal.displayName} owes`} ₹${Math.abs(bal.netBalance).toFixed(0)}`}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* SETTLE UP TAB */}
                    {activeTab === 'settle' && (
                        <motion.div key="settle" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            {settlements.length === 0 ? (
                                <div className="py-20 text-center rounded-2xl" style={indigoCard()}>
                                    <div className="text-4xl mb-3">🎉</div>
                                    <p className="text-white font-semibold mb-1" style={headingFont}>All settled up!</p>
                                    <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>No pending payments</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {settlements.map((txn, i) => {
                                        const isMyPayment = txn.from === userId;
                                        const isMyReceipt = txn.to === userId;
                                        return (
                                            <motion.div key={i}
                                                className="p-5 rounded-xl"
                                                style={indigoCard()}
                                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                                                <div className="flex items-center justify-between flex-wrap gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                                                                style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171', border: '1px solid rgba(248,113,113,0.3)' }}>
                                                                {txn.fromName[0].toUpperCase()}
                                                            </div>
                                                            <span className="text-2xl">→</span>
                                                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                                                                style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' }}>
                                                                {txn.toName[0].toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-white text-sm" style={headingFont}>
                                                                <span style={{ color: isMyPayment ? '#F87171' : '#A1A1A1' }}>{isMyPayment ? 'You' : txn.fromName}</span>
                                                                <span style={{ color: '#A1A1A1' }}> pay </span>
                                                                <span style={{ color: isMyReceipt ? '#34D399' : '#A1A1A1' }}>{isMyReceipt ? 'you' : txn.toName}</span>
                                                            </div>
                                                            <div className="text-xs mt-0.5" style={{ color: '#A1A1A1', ...monoFont }}>Simplified settlement</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="text-xl font-bold" style={{ color: INDIGO, ...headingFont }}>
                                                            ₹{txn.amount.toLocaleString()}
                                                        </div>
                                                        {isMyPayment && (
                                                            <motion.button
                                                                onClick={() => setShowSettle(true)}
                                                                className="px-4 py-2 rounded-xl text-sm font-semibold"
                                                                style={{
                                                                    background: `linear-gradient(135deg, ${INDIGO_DARK}, #8B5CF6)`,
                                                                    color: '#fff', ...headingFont,
                                                                    boxShadow: '0 0 12px rgba(99,102,241,0.3)',
                                                                }}
                                                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                                                Settle ✓
                                                            </motion.button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showAddExpense && (
                    <AddExpenseModal
                        groupId={group.id}
                        members={members}
                        userId={userId}
                        onClose={() => setShowAddExpense(false)}
                        onAdded={() => { loadAll(); setShowAddExpense(false); }}
                    />
                )}
                {showAddMember && (
                    <AddMemberModal
                        groupId={group.id}
                        onClose={() => setShowAddMember(false)}
                        onAdded={loadAll}
                    />
                )}
                {showSettle && (
                    <SettleUpModal
                        groupId={group.id}
                        members={members}
                        userId={userId}
                        settlements={settlements}
                        onClose={() => setShowSettle(false)}
                        onSettled={() => { loadAll(); setShowSettle(false); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
