import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  Wallet, TrendingDown, TrendingUp, PiggyBank, Plus, Bell, Settings,
  LogOut, DollarSign, Calendar, Target, CheckCircle2, Circle, Trash2,
  Globe, Calculator, HeadphonesIcon, Heart, X, Menu, Search, Loader2,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Logo } from './Logo';
import { StarField } from './StarField';
import { LoanCalculator } from './LoanCalculator';
import { Settings as SettingsPage } from './Settings';
import { ContactDeveloper } from './ContactDeveloper';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { SplitKro } from './SplitKro';
import { GlassCard } from './ui/GlassCard';
import { NeonButton } from './ui/NeonButton';

// ─── Design tokens ────────────────────────────────────────────────
const TEAL = '#00F2EA';
const headingFont: React.CSSProperties = { fontFamily: 'Inter, Geist, SF Pro, sans-serif' };
const monoFont: React.CSSProperties = { fontFamily: 'JetBrains Mono, "Courier New", monospace' };

// ─── Liquid Glass helpers ──────────────────────────────────────────
const glass = (tealTint = false, blurPx = 24): React.CSSProperties => ({
  background: tealTint ? 'rgba(0,242,234,0.055)' : 'rgba(255,255,255,0.045)',
  backdropFilter: `blur(${blurPx}px) saturate(200%) brightness(1.08)`,
  WebkitBackdropFilter: `blur(${blurPx}px) saturate(200%) brightness(1.08)`,
  border: tealTint ? '1px solid rgba(0,242,234,0.18)' : '1px solid rgba(255,255,255,0.09)',
  boxShadow:
    '0 12px 40px rgba(0,0,0,0.65), inset 0 1.5px 0 rgba(255,255,255,0.13), inset 0 -1px 0 rgba(0,0,0,0.18)',
});

const PIE_COLORS = [TEAL, '#00b8b3', '#007a78', '#004d4b', '#10B981', '#3B82F6'];

// ─── Interfaces ───────────────────────────────────────────────────
interface DashboardProps { userName: string; userEmail: string; userId: string; accessToken: string; onLogout: () => void; }
interface Expense { id: string; category: string; amount: number; date: string; title: string; note?: string; }
interface Reminder { id: string; title: string; dueDate: string; status: 'pending' | 'completed'; amount?: number; }
interface Budget { id: string; category: string; allocatedAmount: number; month: number; year: number; }
type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD';
const CURRENCY_SYMBOLS: Record<Currency, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$' };

// ─── Input styling ─────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(0,242,234,0.18)',
  borderRadius: '10px', color: '#fff', outline: 'none', ...monoFont,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
  transition: 'all 0.2s ease',
};

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl" style={{ ...glass(false, 20), border: '1px solid rgba(0,242,234,0.3)' }}>
        <p className="text-xs font-bold mb-1 text-white" style={headingFont}>{label || payload[0].name}</p>
        <p className="text-sm font-bold" style={{ color: TEAL, ...monoFont }}>
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};



// ─── Liquid glass modal ────────────────────────────────────────────
function ModalCard({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
      <GlassCard
        className="w-full max-w-md p-7"
        spacing="none"
        style={{
          boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,242,255,0.07)',
        }}
      >
        <div className="p-7 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white" style={headingFont}>{title}</h3>
            <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.4)' }}
              className="hover:text-[var(--ns-cyan)] transition-colors"
            ><X className="size-5" /></button>
          </div>
          {children}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, label, value, delay, onEdit, index }:
  { icon: any; iconColor: string; label: string; value: string; delay: number; onEdit?: () => void; index: number }) {
  // Normalize icons to the new cyan if they were the old teal
  const actualColor = iconColor === TEAL ? '#00f2ff' : iconColor;

  return (
    <GlassCard
      interactive
      rounded="apple"
      active={iconColor === TEAL}
      className="flex flex-col"
      style={{ minHeight: 140, boxShadow: '0 20px 50px -12px rgba(0,0,0,0.5)' }}
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        y: {
          duration: 5 + index,
          repeat: Infinity,
          ease: "easeInOut"
        },
        delay: delay
      }}
      whileHover={{ y: -12, scale: 1.02, boxShadow: `0 30px 60px -12px rgba(0,0,0,0.7), 0 0 30px ${actualColor}15` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: `rgba(${actualColor === '#00f2ff' ? '0,242,255' : actualColor === '#F87171' ? '248,113,113' : actualColor === '#34D399' ? '52,211,153' : '96,165,250'},0.12)`,
            border: `1px solid ${actualColor}33`,
            boxShadow: `0 4px 16px ${actualColor}22`,
          }}>
          <Icon className="size-6" style={{ color: actualColor, filter: `drop-shadow(0 0 7px ${actualColor})` }} />
        </div>
        {onEdit && (
          <button className="text-xs text-[var(--ns-text-secondary)] hover:text-[var(--ns-cyan)] transition-colors" style={monoFont}
            onClick={onEdit}
          >Edit</button>
        )}
      </div>
      <motion.div className="text-3xl font-bold text-white mb-1 tracking-tight" style={headingFont}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{value}</motion.div>
      <div className="text-sm font-medium" style={{ color: 'var(--ns-text-secondary)', ...monoFont }}>{label}</div>
    </GlassCard>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────
export function Dashboard({ userName, userEmail, userId, onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Track whether we are on a desktop viewport (≥1024px) to show sidebar by default
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  );

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      // Auto-close mobile sidebar when resizing to desktop
      if (desktop) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeView, setActiveView] = useState<'dashboard' | 'budgets' | 'expenses' | 'reminders' | 'splitkro'>('dashboard');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [salary, setSalary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showEditSalary, setShowEditSalary] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContactDeveloper, setShowContactDeveloper] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const [newExpense, setNewExpense] = useState({ category: 'Food & Dining', amount: '', title: '', date: new Date().toISOString().split('T')[0], note: '' });
  const [newReminder, setNewReminder] = useState({ title: '', dueDate: '', amount: '' });
  const [newBudget, setNewBudget] = useState({ category: 'Food & Dining', limit: '' });

  const fetchData = async () => {
    setLoading(true);
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    try {
      const [incRes, expRes, budRes, remRes] = await Promise.all([
        api.getIncomes(month, year),
        api.getExpenses(),
        api.getBudgets(month, year),
        api.getReminders()
      ]);

      if (incRes.data?.incomes?.length) {
        // Aggregate income for the month
        const totalInc = incRes.data.incomes.reduce((s, i) => s + i.amount, 0);
        setSalary(totalInc);
      } else {
        setSalary(0);
      }

      if (expRes.data) setExpenses(expRes.data.expenses.map(e => ({
        id: e._id,
        category: e.category,
        amount: e.amount,
        date: e.date,
        title: e.title,
        note: e.note
      })));

      if (budRes.data) setBudgets(budRes.data.budgets.map(b => ({
        id: b._id,
        category: b.category,
        allocatedAmount: b.allocatedAmount,
        month: b.month,
        year: b.year
      })));

      if (remRes.data) setReminders(remRes.data.reminders.map(r => ({
        id: r._id,
        title: r.title,
        dueDate: r.dueDate,
        status: r.status,
        amount: r.amount
      })));
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // budgets[].spent is calculated dynamically in the render logic or a useMemo
  }, [expenses]); // eslint-disable-line

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const savings = salary - totalExpenses;
  const savingsRate = salary > 0 ? ((savings / salary) * 100).toFixed(1) : '0.0';
  const sym = CURRENCY_SYMBOLS[currency];

  const categoryData = expenses.reduce((acc, e) => {
    const ex = acc.find(i => i.name === e.category);
    if (ex) ex.value += e.amount; else acc.push({ name: e.category, value: e.amount });
    return acc;
  }, [] as { name: string; value: number }[]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await api.addExpense({
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date(newExpense.date).toISOString()
    });
    if (error) return toast.error(error);
    toast.success('Expense added');
    setNewExpense({ category: 'Food & Dining', amount: '', title: '', date: new Date().toISOString().split('T')[0], note: '' });
    setShowAddExpense(false);
    fetchData();
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await api.addReminder({
      title: newReminder.title,
      dueDate: new Date(newReminder.dueDate).toISOString()
    });
    if (error) return toast.error(error);
    toast.success('Reminder added');
    setNewReminder({ title: '', dueDate: '', amount: '' });
    setShowAddReminder(false);
    fetchData();
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const { data, error } = await api.addBudget({
      category: newBudget.category,
      allocatedAmount: parseFloat(newBudget.limit),
      month: now.getMonth() + 1,
      year: now.getFullYear()
    });
    if (error) return toast.error(error);
    toast.success('Budget added');
    setNewBudget({ category: 'Food & Dining', limit: '' });
    setShowAddBudget(false);
    fetchData();
  };

  const toggleReminder = async (id: string) => {
    const { error } = await api.toggleReminder(id);
    if (error) return toast.error(error);
    fetchData();
  };

  const deleteReminder = async (id: string) => {
    const { error } = await api.deleteReminder(id);
    if (error) return toast.error(error);
    fetchData();
  };

  const deleteExpense = async (id: string) => {
    const { error } = await api.deleteExpense(id);
    if (error) return toast.error(error);
    fetchData();
  };

  const deleteBudget = async (id: string) => {
    const { error } = await api.deleteBudget(id);
    if (error) return toast.error(error);
    fetchData();
  };

  if (showSettings) return <SettingsPage userEmail={userEmail} onBack={() => setShowSettings(false)} onLogout={onLogout} currency={currency} onCurrencyChange={(c) => setCurrency(c as Currency)} />;
  if (showContactDeveloper) return <ContactDeveloper onBack={() => setShowContactDeveloper(false)} />;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Wallet },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'reminders', label: 'Reminders', icon: Bell },
  ] as const;

  const CATEGORIES = ['Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'];

  return (
    <div className="min-h-screen text-white" style={{ background: '#000000', ...monoFont }}>
      <StarField count={200} />

      {/* ─── MOBILE SIDEBAR BACKDROP ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── LIQUID GLASS SIDEBAR ─── */}
      {/* Desktop: always visible (lg:translate-x-0). Mobile: slides in from left. */}
      <aside
        className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-30 transition-transform duration-300 ease-in-out"
        style={{
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(32px) saturate(200%) brightness(1.06)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%) brightness(1.06)',
          borderRight: '1px solid rgba(0,242,234,0.12)',
          boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.04)',
          padding: '24px 16px',
          // Desktop: always visible. Mobile: visible only when open.
          transform: (isDesktop || sidebarOpen) ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* inner sheen */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 40%)' }} />

        {/* Mobile close button */}
        <button
          className="absolute top-4 right-4 lg:hidden z-10"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onClick={() => setSidebarOpen(false)}
          onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          <X className="size-5" />
        </button>

        <div className="mb-10 px-2 relative z-10"><Logo /></div>

        <nav className="flex-1 space-y-1 relative z-10">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeView === id;
            return (
              <motion.button key={id} onClick={() => { setActiveView(id); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden"
                style={active ? {
                  background: 'rgba(0,242,234,0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0,242,234,0.3)',
                  color: TEAL,
                  boxShadow: '0 0 20px rgba(0,242,234,0.1), inset 0 1px 0 rgba(0,242,234,0.2)',
                  ...monoFont,
                } : { border: '1px solid transparent', color: '#A1A1A1', ...monoFont }}
                whileHover={active ? {} : { x: 4, color: '#fff', background: 'rgba(255,255,255,0.04)' }}
              >
                {active && <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full" style={{ background: TEAL, boxShadow: `0 0 10px ${TEAL}` }} />}
                <Icon className="size-5" style={active ? { color: TEAL, filter: `drop-shadow(0 0 5px ${TEAL})` } : {}} />
                <span>{label}</span>
              </motion.button>
            );
          })}

          {/* Split Kro Specialist Button */}
          <motion.button
            onClick={() => { setActiveView('splitkro'); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden mt-3"
            style={activeView === 'splitkro' ? {
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
              ...headingFont,
            } : {
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#C7D2FE',
              ...headingFont,
            }}
            whileHover={{ scale: 1.02, x: 4, background: activeView === 'splitkro' ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : 'rgba(99,102,241,0.15)' }}
          >
            <TrendingUp className="size-5" />
            <span className="font-bold whitespace-nowrap">Split Kro 💸</span>
          </motion.button>

          <motion.button onClick={() => { setShowLoanCalculator(true); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-2 relative overflow-hidden"
            style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.22)', color: '#FBBF24', backdropFilter: 'blur(12px)', ...monoFont, boxShadow: 'inset 0 1px 0 rgba(234,179,8,0.12)' }}
            whileHover={{ scale: 1.02, background: 'rgba(234,179,8,0.13)' }} whileTap={{ scale: 0.98 }}
          >
            <Calculator className="size-5" />
            <span className="font-semibold">Financial Tools</span>
          </motion.button>
        </nav>

        <div className="space-y-1 pt-4 relative z-10" style={{ borderTop: '1px solid rgba(0,242,234,0.1)' }}>
          {[
            { label: 'Contact Developer', icon: HeadphonesIcon, onClick: () => { setShowContactDeveloper(true); setSidebarOpen(false); } },
            { label: 'Settings', icon: Settings, onClick: () => { setShowSettings(true); setSidebarOpen(false); } },
            { label: 'Logout', icon: LogOut, onClick: onLogout },
          ].map(({ label, icon: Icon, onClick }) => (
            <motion.button key={label} onClick={onClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ color: '#A1A1A1', ...monoFont }}
              whileHover={{ x: 4, color: TEAL, background: 'rgba(0,242,234,0.06)' }}
            >
              <Icon className="size-5" /><span>{label}</span>
            </motion.button>
          ))}
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      {/* On mobile: no left margin (sidebar is hidden). On lg: ml-64. Extra bottom padding for mobile bottom nav. */}
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 relative z-10">
        {/* Header */}
        <motion.div className="mb-8 flex items-start justify-between gap-3"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,242,234,0.08)', border: '1px solid rgba(0,242,234,0.2)', color: TEAL }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 text-white" style={headingFont}>Financial Dashboard</h1>
              <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>Welcome back, <span style={{ color: TEAL }}>{userName || userEmail}</span></p>
            </div>
          </div>

          {/* Currency selector */}
          <div className="relative">
            <motion.button
              onClick={() => setShowCurrencySelector(!showCurrencySelector)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl relative overflow-hidden"
              style={{ ...glass(false, 18), color: '#fff', ...monoFont }}
              whileHover={{ scale: 1.04 }}
            >
              <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
              <Globe className="size-5 relative" style={{ color: TEAL }} />
              <span className="font-semibold relative">{currency}</span>
              <span className="text-xl relative">{sym}</span>
            </motion.button>

            {showCurrencySelector && (
              <motion.div
                className="absolute top-full mt-2 right-0 w-48 p-2 rounded-xl z-50 overflow-hidden"
                style={{
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(32px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(32px) saturate(200%)',
                  border: '1px solid rgba(0,242,234,0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
                initial={{ opacity: 0, y: -10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                {(Object.keys(CURRENCY_SYMBOLS) as Currency[]).map((curr) => (
                  <motion.button key={curr}
                    onClick={() => { setCurrency(curr); setShowCurrencySelector(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg"
                    style={currency === curr ? { background: 'rgba(0,242,234,0.1)', color: TEAL, border: '1px solid rgba(0,242,234,0.25)', ...monoFont } : { color: '#A1A1A1', ...monoFont }}
                    whileHover={curr !== currency ? { background: 'rgba(255,255,255,0.06)', color: '#fff', x: 2 } : {}}
                  >
                    <span>{curr}</span><span className="text-xl">{CURRENCY_SYMBOLS[curr]}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ─── STAT CARDS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 items-start">
          <StatCard index={0} icon={DollarSign} iconColor={TEAL} label="Monthly Income" value={`${sym}${salary.toLocaleString()}`} delay={0.3} onEdit={() => setShowEditSalary(true)} />
          <StatCard index={1} icon={TrendingDown} iconColor="#F87171" label="Total Expenses" value={`${sym}${totalExpenses.toLocaleString()}`} delay={0.4} />
          <StatCard index={2} icon={PiggyBank} iconColor="#34D399" label="Total Savings" value={`${sym}${savings.toLocaleString()}`} delay={0.5} />
          <StatCard index={3} icon={TrendingUp} iconColor="#60A5FA" label="Savings Rate" value={`${savingsRate}%`} delay={0.6} />
        </div>

        {/* ─── DASHBOARD VIEW ─── */}
        {activeView === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <GlassCard rounded="apple" className="flex flex-col min-h-[400px]" style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)' }}>
                <h2 className="text-2xl font-bold mb-6 text-white tracking-tight" style={headingFont}>Where your money goes</h2>
                {expenses.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <PieChart className="size-12 mb-4 opacity-20 text-[var(--ns-cyan)]" />
                    <p className="text-sm opacity-50" style={monoFont}>Add expenses to see your spending breakdown.</p>
                  </div>
                ) : (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value" animationBegin={0} animationDuration={1000}>
                          {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ color: '#A1A1A1', ...monoFont }} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </GlassCard>
            </div>

            <GlassCard rounded="apple" className="mb-8 p-6 lg:p-8" style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)' }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight mb-1" style={headingFont}>Spending Trend</h2>
                  <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>Your recent daily activity</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs" style={monoFont}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Income
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs" style={monoFont}>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Expenses
                  </div>
                </div>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={expenses.slice(-15).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}>
                    <defs>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F87171" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="amount" stroke="#F87171" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" activeDot={{ r: 6, stroke: '#F87171', strokeWidth: 2, fill: '#000' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <GlassCard rounded="apple" style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white tracking-tight" style={headingFont}>Recent Expenses</h2>
                  <NeonButton size="sm" onClick={() => setShowAddExpense(true)}><Plus className="size-4" /> Add</NeonButton>
                </div>
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {expenses.length === 0 ? (
                    <div className="py-12 text-center opacity-30" style={monoFont}>
                      <TrendingDown className="size-8 mx-auto mb-2" />
                      <p>No expenses yet</p>
                    </div>
                  ) : expenses.slice(0, 5).map((expense, i) => (
                    <motion.div key={expense.id}
                      className="flex items-center justify-between p-4 rounded-xl group relative overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.01, borderColor: 'rgba(0,242,234,0.2)' }}
                    >
                      <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }} />
                      <div className="flex items-center gap-3 flex-1 relative">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center relative"
                          style={{ background: 'rgba(0,242,234,0.1)', border: '1px solid rgba(0,242,234,0.2)', boxShadow: '0 4px 12px rgba(0,242,234,0.1), inset 0 1px 0 rgba(0,242,234,0.2)' }}>
                          <DollarSign className="size-5" style={{ color: TEAL, filter: 'drop-shadow(0 0 5px #00F2EA)' }} />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm" style={headingFont}>{expense.title}</div>
                          <div className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}>{expense.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 relative">
                        <div className="text-right">
                          <div className="font-bold text-red-400 text-sm" style={monoFont}>-{sym}{expense.amount}</div>
                          <div className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}>{new Date(expense.date).toLocaleDateString()}</div>
                        </div>
                        <button onClick={() => deleteExpense(expense.id)} className="opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Reminders widget */}
            <GlassCard rounded="apple" style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight" style={headingFont}>Upcoming Bills</h2>
                <NeonButton size="sm" onClick={() => setShowAddReminder(true)}><Plus className="size-4" /> Add Reminder</NeonButton>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reminders.length === 0 ? (
                  <div className="col-span-full py-12 text-center glass rounded-xl opacity-30" style={monoFont}>
                    <Bell className="size-8 mx-auto mb-2" />
                    <p>No reminders set</p>
                  </div>
                ) : reminders.map((r, i) => {
                  const completed = r.status === 'completed';
                  return (
                    <motion.div key={r.id} className="p-4 rounded-xl group relative overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,242,234,0.08)', backdropFilter: 'blur(12px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(0,242,234,0.22)' }}
                    >
                      <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }} />
                      <div className="flex items-start gap-3 relative">
                        <button onClick={() => toggleReminder(r.id)} style={{ color: completed ? TEAL : '#A1A1A1', marginTop: 2 }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = completed ? TEAL : '#A1A1A1')}
                        >{completed ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}</button>
                        <div className="flex-1">
                          <div className="font-semibold mb-1 text-sm" style={{ color: completed ? '#A1A1A1' : '#fff', textDecoration: completed ? 'line-through' : 'none', ...headingFont }}>{r.title}</div>
                          <div className="flex items-center gap-2 text-xs" style={{ color: '#A1A1A1', ...monoFont }}><Calendar className="size-3" />{new Date(r.dueDate).toLocaleDateString()}</div>
                        </div>
                        <button onClick={() => deleteReminder(r.id)} className="opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </>
        )}

        {/* ─── BUDGETS VIEW ─── */}
        {activeView === 'budgets' && (
          <GlassCard spacing="lg" rounded="apple" style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight" style={headingFont}>Budgets</h2>
              <NeonButton onClick={() => setShowAddBudget(true)}><Plus className="size-5" /> Add Budget</NeonButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.length === 0 ? (
                <div className="col-span-full py-20 text-center opacity-30" style={monoFont}>
                  <Target className="size-12 mx-auto mb-4" />
                  <p>No budgets set up yet</p>
                </div>
              ) : budgets.map((b, i) => {
                const spent = expenses.filter(e => e.category === b.category).reduce((s, e) => s + e.amount, 0);
                const pct = b.allocatedAmount > 0 ? (spent / b.allocatedAmount) * 100 : 0;
                const over = pct > 100;
                const barColor = over ? '#F87171' : pct > 80 ? '#FBBF24' : TEAL;
                return (
                  <motion.div key={b.id} className="p-6 rounded-xl group relative overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,242,234,0.09)', backdropFilter: 'blur(12px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.03, borderColor: 'rgba(0,242,234,0.25)' }}
                  >
                    <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)' }} />
                    <div className="flex items-start justify-between mb-4 relative">
                      <div>
                        <h3 className="font-semibold text-lg text-white" style={headingFont}>{b.category}</h3>
                        <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>{sym}{spent} / {sym}{b.allocatedAmount}</p>
                      </div>
                      <button onClick={() => deleteBudget(b.id)} className="opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden mb-2 relative"
                      style={{ background: 'rgba(255,255,255,0.07)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)' }}>
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                        style={{ background: barColor, boxShadow: `0 0 10px ${barColor}80` }} />
                    </div>
                    <p className="text-sm font-semibold relative" style={{ color: over ? '#F87171' : '#A1A1A1', ...monoFont }}>{pct.toFixed(1)}% used</p>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* ─── EXPENSES VIEW ─── */}
        {activeView === 'expenses' && (
          <GlassCard spacing="lg" className="min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight" style={headingFont}>All Expenses</h2>
              <NeonButton onClick={() => setShowAddExpense(true)}><Plus className="size-5" /> Add Expense</NeonButton>
            </div>
            <div className="space-y-4">
              {expenses.length === 0 ? (
                <div className="py-20 text-center opacity-30" style={monoFont}>
                  <TrendingDown className="size-12 mx-auto mb-4" />
                  <p>No expenses recorded yet</p>
                </div>
              ) : expenses.map((expense, i) => (
                <motion.div key={expense.id}
                  className="flex items-center justify-between p-5 rounded-2xl group relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.01, borderColor: 'rgba(0,242,234,0.2)' }}
                >
                  <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }} />
                  <div className="flex items-center gap-4 relative">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(0,242,234,0.1)', border: '1px solid rgba(0,242,234,0.2)', boxShadow: '0 4px 15px rgba(0,242,234,0.1)' }}>
                      <DollarSign className="size-6" style={{ color: TEAL }} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg" style={headingFont}>{expense.title}</div>
                      <div className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>{expense.category} • {new Date(expense.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 relative">
                    <div className="text-right">
                      <div className="text-xl font-bold text-red-400" style={monoFont}>-{sym}{expense.amount.toLocaleString()}</div>
                    </div>
                    <button onClick={() => deleteExpense(expense.id)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:bg-red-400/10"><Trash2 className="size-5" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* ─── REMINDERS VIEW ─── */}
        {activeView === 'reminders' && (
          <GlassCard spacing="lg" className="min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight" style={headingFont}>Reminders & Bills</h2>
              <NeonButton onClick={() => setShowAddReminder(true)}><Plus className="size-5" /> New Reminder</NeonButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reminders.length === 0 ? (
                <div className="col-span-full py-20 text-center opacity-30" style={monoFont}>
                  <Bell className="size-12 mx-auto mb-4" />
                  <p>No reminders found</p>
                </div>
              ) : reminders.map((r, i) => {
                const completed = r.status === 'completed';
                return (
                  <motion.div key={r.id}
                    className="p-6 rounded-2xl group relative overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,242,234,0.08)', backdropFilter: 'blur(12px)' }}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02, borderColor: 'rgba(0,242,234,0.3)' }}
                  >
                    <div className="flex items-start gap-4 relative">
                      <button onClick={() => toggleReminder(r.id)} style={{ color: completed ? TEAL : '#A1A1A1', marginTop: 4 }}>
                        {completed ? <CheckCircle2 className="size-6" /> : <Circle className="size-6" />}
                      </button>
                      <div className="flex-1">
                        <div className="text-lg font-bold mb-1" style={{ color: completed ? '#A1A1A1' : '#fff', textDecoration: completed ? 'line-through' : 'none', ...headingFont }}>{r.title}</div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: '#A1A1A1', ...monoFont }}><Calendar className="size-4" />Due: {new Date(r.dueDate).toLocaleDateString()}</div>
                      </div>
                      <button onClick={() => deleteReminder(r.id)} className="opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:text-red-300 p-2"><Trash2 className="size-5" /></button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* ─── SPLIT KRO VIEW ─── */}
        {activeView === 'splitkro' && (
          <SplitKro userId={userId} userName={userName || userEmail} />
        )}

        {/* Footer */}
        <motion.div className="mt-12 py-6 text-center" style={{ borderTop: '1px solid rgba(0,242,234,0.08)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1 }}
        >
          <p className="flex items-center justify-center gap-2 text-sm" style={{ color: '#A1A1A1', ...monoFont }}>
            <span>Made with</span>
            <Heart className="size-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <span className="font-semibold" style={{ color: TEAL, ...headingFont }}>Akshit Jaswal</span>
            <span>🚀</span>
          </p>
        </motion.div>
      </div>

      {/* ─── INCOME SETUP OVERLAY ─── */}
      {!loading && salary === 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
          <GlassCard spacing="lg" interactive className="w-full max-w-md text-center">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'rgba(0,242,255,0.1)', border: '1px solid rgba(0,242,255,0.2)' }}>
              <Wallet className="size-10 text-[var(--ns-cyan)]" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-white" style={headingFont}>Welcome to FinMax!</h2>
            <p className="mb-8 opacity-60 text-sm" style={monoFont}>To get started, enter your monthly income. This helps us calculate your savings and track your budgets accurately.</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const val = (e.currentTarget.elements.namedItem('income') as HTMLInputElement).value;
              const now = new Date();
              const { error } = await api.addIncome({
                amount: parseFloat(val),
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                source: 'Initial Setup'
              });
              if (error) return toast.error(error);
              toast.success('Income set successfully');
              fetchData();
            }}>
              <div className="mb-6">
                <input name="income" type="number" step="0.01" required placeholder="Monthly income (e.g. 50000)" autoFocus
                  className="w-full text-center text-2xl font-bold bg-transparent border-b-2 py-4 focus:outline-none"
                  style={{ borderColor: 'rgba(0,242,234,0.3)', color: TEAL, ...monoFont }}
                />
              </div>
              <NeonButton type="submit" size="lg" className="w-full">Start tracking</NeonButton>
            </form>
          </GlassCard>
        </div>
      )}

      {/* ─── LOADING SPINNER ─── */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
            <Loader2 className="size-12" style={{ color: TEAL }} />
          </motion.div>
        </div>
      )}

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 lg:hidden"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          borderTop: '1px solid rgba(0,242,234,0.15)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
        }}
      >
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeView === id;
            return (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200"
                style={active
                  ? { color: TEAL, background: 'rgba(0,242,234,0.1)', border: '1px solid rgba(0,242,234,0.2)' }
                  : { color: '#A1A1A1', border: '1px solid transparent' }
                }
              >
                <Icon className="size-5" style={active ? { filter: `drop-shadow(0 0 5px ${TEAL})` } : {}} />
                <span className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: active ? 600 : 400 }}>{label}</span>
              </button>
            );
          })}
          {/* Logout shortcut on mobile bottom nav */}
          <button
            onClick={onLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200"
            style={{ color: '#A1A1A1', border: '1px solid transparent' }}
          >
            <LogOut className="size-5" />
            <span className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Logout</span>
          </button>
        </div>
      </div>

      {/* ─── MODALS ─── */}
      {showAddExpense && (
        <ModalCard title="Add Expense" onClose={() => setShowAddExpense(false)}>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Category</label>
              <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} style={{ ...inputStyle }}>
                {CATEGORIES.map(c => <option key={c} style={{ background: '#0A0A0A' }}>{c}</option>)}
              </select></div>
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Amount</label>
              <input type="number" step="0.01" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} required style={{ ...inputStyle }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 0 14px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08)'; }}
              /></div>
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Title</label>
              <input type="text" value={newExpense.title} onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })} required style={{ ...inputStyle }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 0 14px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08)'; }}
              /></div>
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Date</label>
              <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} required style={{ ...inputStyle }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 0 14px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08)'; }}
              /></div>
            <div className="flex gap-3 pt-2">
              <NeonButton type="submit" className="flex-1 py-2.5">Add Expense</NeonButton>
              <NeonButton variant="ghost" type="button" onClick={() => setShowAddExpense(false)}>Cancel</NeonButton>
            </div>
          </form>
        </ModalCard>
      )}

      {showAddReminder && (
        <ModalCard title="Add Reminder" onClose={() => setShowAddReminder(false)}>
          <form onSubmit={handleAddReminder} className="space-y-4">
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Title</label>
              <input type="text" value={newReminder.title} onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })} required placeholder="e.g., Pay rent" style={{ ...inputStyle }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 0 14px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08)'; }}
              /></div>
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Due Date</label>
              <input type="date" value={newReminder.dueDate} onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })} required style={{ ...inputStyle }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 0 14px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08)'; }}
              /></div>
            <div className="flex gap-3 pt-2">
              <NeonButton type="submit" className="flex-1 py-2.5">Add Reminder</NeonButton>
              <NeonButton variant="ghost" type="button" onClick={() => setShowAddReminder(false)}>Cancel</NeonButton>
            </div>
          </form>
        </ModalCard>
      )}

      {showEditSalary && (
        <ModalCard title="Edit Monthly Income" onClose={() => setShowEditSalary(false)}>
          <form onSubmit={(e) => { e.preventDefault(); setShowEditSalary(false); }} className="space-y-4">
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Monthly Income ({sym})</label>
              <input type="number" step="100" value={salary} onChange={(e) => setSalary(parseFloat(e.target.value))} required style={{ ...inputStyle }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 0 14px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08)'; }}
              /></div>
            <div className="flex gap-3 pt-2">
              <NeonButton type="submit" className="flex-1 py-2.5">Save</NeonButton>
              <NeonButton variant="ghost" type="button" onClick={() => setShowEditSalary(false)}>Cancel</NeonButton>
            </div>
          </form>
        </ModalCard>
      )}

      {showAddBudget && (
        <ModalCard title="Add Budget" onClose={() => setShowAddBudget(false)}>
          <form onSubmit={handleAddBudget} className="space-y-4">
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Category</label>
              <select value={newBudget.category} onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })} style={{ ...inputStyle }}>
                {CATEGORIES.map(c => <option key={c} style={{ background: '#0A0A0A' }}>{c}</option>)}
              </select></div>
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Limit ({sym})</label>
              <input type="number" step="0.01" value={newBudget.limit} onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })} required style={{ ...inputStyle }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 0 14px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08)'; }}
              /></div>
            <div className="flex gap-3 pt-2">
              <NeonButton type="submit" className="flex-1 py-2.5">Add Budget</NeonButton>
              <NeonButton variant="ghost" type="button" onClick={() => setShowAddBudget(false)}>Cancel</NeonButton>
            </div>
          </form>
        </ModalCard>
      )}

      <LoanCalculator isOpen={showLoanCalculator} onClose={() => setShowLoanCalculator(false)} currencySymbol={sym} />
    </div>
  );
}