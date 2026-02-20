import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  Wallet, TrendingDown, TrendingUp, PiggyBank, Plus, Bell, Settings,
  LogOut, DollarSign, Calendar, Target, CheckCircle2, Circle, Trash2,
  Globe, Calculator, HeadphonesIcon, Heart, X,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Logo } from './Logo';
import { StarField } from './StarField';
import { LoanCalculator } from './LoanCalculator';
import { Settings as SettingsPage } from './Settings';
import { ContactDeveloper } from './ContactDeveloper';

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
interface DashboardProps { userEmail: string; userId: string; accessToken: string; onLogout: () => void; }
interface Expense { id: string; category: string; amount: number; date: string; description: string; }
interface Reminder { id: string; title: string; dueDate: string; completed: boolean; }
interface Budget { id: string; category: string; limit: number; spent: number; }
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
};

// ─── 3D Tilt card ─────────────────────────────────────────────────
function TiltCard({ children, style = {}, className = '', teal = false }: {
  children: React.ReactNode; style?: React.CSSProperties; className?: string; teal?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 350, damping: 35 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 350, damping: 35 });
  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} className={className}
      style={{ ...glass(teal), ...style, transformStyle: 'preserve-3d', rotateX: rotX, rotateY: rotY, willChange: 'transform', position: 'relative' }}
      onMouseMove={handleMouse} onMouseLeave={handleLeave}
      whileHover={{ scale: 1.02, z: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      {/* Glass reflection sheen */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0) 50%, rgba(0,242,234,0.03) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}

// ─── Liquid glass modal ────────────────────────────────────────────
function ModalCard({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
      <motion.div
        className="w-full max-w-md rounded-2xl p-7 relative overflow-hidden"
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(36px) saturate(220%) brightness(1.08)',
          WebkitBackdropFilter: 'blur(36px) saturate(220%) brightness(1.08)',
          border: '1px solid rgba(0,242,234,0.22)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,242,234,0.07), inset 0 1.5px 0 rgba(0,242,234,0.2)',
        }}
        initial={{ opacity: 0, scale: 0.88, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        {/* top shimmer + glass sheen */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,242,234,0.6), transparent)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-xl font-bold text-white" style={headingFont}>{title}</h3>
          <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          ><X className="size-5" /></button>
        </div>
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
}

// ─── Teal CTA button ──────────────────────────────────────────────
function TealButton({ onClick, type = 'button', children, className = '' }:
  { onClick?: () => void; type?: 'button' | 'submit'; children: React.ReactNode; className?: string }) {
  return (
    <motion.button type={type} onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold ${className}`}
      style={{
        background: TEAL, color: '#000', ...headingFont,
        boxShadow: '0 0 18px rgba(0,242,234,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
      }}
      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,242,234,0.55), inset 0 1px 0 rgba(255,255,255,0.3)' }}
      whileTap={{ scale: 0.96 }}
    >{children}</motion.button>
  );
}

function GhostButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <motion.button type="button" onClick={onClick}
      className="px-6 py-2 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.06)', color: '#A1A1A1', border: '1px solid rgba(255,255,255,0.1)', ...monoFont, backdropFilter: 'blur(10px)' }}
      whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.12)', color: '#fff' }}
      whileTap={{ scale: 0.97 }}
    >{children}</motion.button>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, label, value, delay, onEdit }:
  { icon: any; iconColor: string; label: string; value: string; delay: number; onEdit?: () => void }) {
  return (
    <TiltCard teal className="p-6 rounded-2xl overflow-hidden"
      style={{ minHeight: 140 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: `rgba(${iconColor === TEAL ? '0,242,234' : iconColor === '#F87171' ? '248,113,113' : iconColor === '#34D399' ? '52,211,153' : '96,165,250'},0.12)`,
            border: `1px solid ${iconColor}33`,
            boxShadow: `0 4px 16px ${iconColor}22, inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}>
          <Icon className="size-6" style={{ color: iconColor, filter: `drop-shadow(0 0 7px ${iconColor})` }} />
        </div>
        {onEdit && (
          <button className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}
            onClick={onEdit}
            onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#A1A1A1')}
          >Edit</button>
        )}
      </div>
      <motion.div className="text-3xl font-bold text-white mb-1" style={headingFont}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>{value}</motion.div>
      <div className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>{label}</div>
    </TiltCard>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────
export function Dashboard({ userEmail, userId, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'budgets' | 'expenses' | 'reminders'>('dashboard');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [salary, setSalary] = useState(50000);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showEditSalary, setShowEditSalary] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContactDeveloper, setShowContactDeveloper] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Food & Dining', amount: 4500, date: '2026-02-15', description: 'Groceries' },
    { id: '2', category: 'Transportation', amount: 1200, date: '2026-02-14', description: 'Gas' },
    { id: '3', category: 'Entertainment', amount: 800, date: '2026-02-13', description: 'Movies' },
    { id: '4', category: 'Shopping', amount: 2000, date: '2026-02-12', description: 'Clothes' },
    { id: '5', category: 'Bills', amount: 3500, date: '2026-02-10', description: 'Electricity' },
  ]);
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', title: 'Pay credit card bill', dueDate: '2026-02-25', completed: false },
    { id: '2', title: 'Review monthly budget', dueDate: '2026-02-28', completed: false },
    { id: '3', title: 'Renew insurance', dueDate: '2026-03-01', completed: false },
  ]);
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Food & Dining', limit: 8000, spent: 0 },
    { id: '2', category: 'Transportation', limit: 3000, spent: 0 },
    { id: '3', category: 'Entertainment', limit: 2000, spent: 0 },
    { id: '4', category: 'Shopping', limit: 5000, spent: 0 },
  ]);
  const [newExpense, setNewExpense] = useState({ category: 'Food & Dining', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [newReminder, setNewReminder] = useState({ title: '', dueDate: '' });
  const [newBudget, setNewBudget] = useState({ category: 'Food & Dining', limit: '' });

  useEffect(() => {
    const saved = localStorage.getItem(`finmax_${userId}`);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.expenses) setExpenses(d.expenses);
        if (d.reminders) setReminders(d.reminders);
        if (d.budgets) setBudgets(d.budgets);
        if (d.salary) setSalary(d.salary);
        if (d.currency) setCurrency(d.currency);
      } catch { /* silent */ }
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(`finmax_${userId}`, JSON.stringify({ expenses, reminders, budgets, salary, currency }));
  }, [expenses, reminders, budgets, salary, currency, userId]);

  useEffect(() => {
    setBudgets(prev => prev.map(b => ({
      ...b, spent: expenses.filter(e => e.category === b.category).reduce((s, e) => s + e.amount, 0),
    })));
  }, [expenses]); // eslint-disable-line

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const savings = salary - totalExpenses;
  const savingsRate = ((savings / salary) * 100).toFixed(1);
  const sym = CURRENCY_SYMBOLS[currency];

  const categoryData = expenses.reduce((acc, e) => {
    const ex = acc.find(i => i.name === e.category);
    if (ex) ex.value += e.amount; else acc.push({ name: e.category, value: e.amount });
    return acc;
  }, [] as { name: string; value: number }[]);

  const useCounter = (end: number) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start: number; let id: number;
      const animate = (t: number) => { if (!start) start = t; const p = Math.min((t - start) / 1000, 1); setCount(Math.floor(p * end)); if (p < 1) id = requestAnimationFrame(animate); };
      id = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(id);
    }, [end]);
    return count;
  };

  const animSalary = useCounter(salary);
  const animExpenses = useCounter(totalExpenses);
  const animSavings = useCounter(savings);

  const handleAddExpense = (e: React.FormEvent) => { e.preventDefault(); setExpenses([{ id: Date.now().toString(), ...newExpense, amount: parseFloat(newExpense.amount) }, ...expenses]); setNewExpense({ category: 'Food & Dining', amount: '', description: '', date: new Date().toISOString().split('T')[0] }); setShowAddExpense(false); };
  const handleAddReminder = (e: React.FormEvent) => { e.preventDefault(); setReminders([...reminders, { id: Date.now().toString(), ...newReminder, completed: false }]); setNewReminder({ title: '', dueDate: '' }); setShowAddReminder(false); };
  const handleAddBudget = (e: React.FormEvent) => { e.preventDefault(); setBudgets([...budgets, { id: Date.now().toString(), category: newBudget.category, limit: parseFloat(newBudget.limit), spent: 0 }]); setNewBudget({ category: 'Food & Dining', limit: '' }); setShowAddBudget(false); };
  const toggleReminder = (id: string) => setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  const deleteReminder = (id: string) => setReminders(reminders.filter(r => r.id !== id));
  const deleteExpense = (id: string) => setExpenses(expenses.filter(e => e.id !== id));
  const deleteBudget = (id: string) => setBudgets(budgets.filter(b => b.id !== id));

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

      {/* ─── LIQUID GLASS SIDEBAR ─── */}
      <motion.aside
        className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-20"
        style={{
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(32px) saturate(200%) brightness(1.06)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%) brightness(1.06)',
          borderRight: '1px solid rgba(0,242,234,0.12)',
          boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.04)',
          padding: '24px 16px',
        }}
        initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
      >
        {/* inner sheen */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 40%)' }} />

        <div className="mb-10 px-2 relative z-10"><Logo /></div>

        <nav className="flex-1 space-y-1 relative z-10">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeView === id;
            return (
              <motion.button key={id} onClick={() => setActiveView(id)}
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

          <motion.button onClick={() => setShowLoanCalculator(true)}
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
            { label: 'Contact Developer', icon: HeadphonesIcon, onClick: () => setShowContactDeveloper(true) },
            { label: 'Settings', icon: Settings, onClick: () => setShowSettings(true) },
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
      </motion.aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="ml-64 p-8 relative z-10">
        {/* Header */}
        <motion.div className="mb-8 flex items-start justify-between"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white" style={headingFont}>Financial Dashboard</h1>
            <p style={{ color: '#A1A1A1', ...monoFont }}>Welcome back, <span style={{ color: TEAL }}>{userEmail}</span></p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={DollarSign} iconColor={TEAL} label="Monthly Income" value={`${sym}${animSalary.toLocaleString()}`} delay={0.3} onEdit={() => setShowEditSalary(true)} />
          <StatCard icon={TrendingDown} iconColor="#F87171" label="Total Expenses" value={`${sym}${animExpenses.toLocaleString()}`} delay={0.4} />
          <StatCard icon={PiggyBank} iconColor="#34D399" label="Total Savings" value={`${sym}${animSavings.toLocaleString()}`} delay={0.5} />
          <StatCard icon={TrendingUp} iconColor="#60A5FA" label="Savings Rate" value={`${savingsRate}%`} delay={0.6} />
        </div>

        {/* ─── DASHBOARD VIEW ─── */}
        {activeView === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <TiltCard teal className="p-6 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 text-white" style={headingFont}>Spending by Category</h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value" animationBegin={0} animationDuration={1000}>
                        {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,242,234,0.25)', borderRadius: '10px', color: '#fff', ...monoFont }} />
                      <Legend wrapperStyle={{ color: '#A1A1A1', ...monoFont }} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TiltCard>

              <TiltCard teal className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white" style={headingFont}>Recent Expenses</h2>
                  <TealButton onClick={() => setShowAddExpense(true)}><Plus className="size-4" /> Add</TealButton>
                </div>
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {expenses.slice(0, 5).map((expense, i) => (
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
                          <div className="font-semibold text-white text-sm" style={headingFont}>{expense.description}</div>
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
              </TiltCard>
            </div>

            {/* Reminders widget */}
            <TiltCard teal className="p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white" style={headingFont}>Financial Reminders</h2>
                <TealButton onClick={() => setShowAddReminder(true)}><Plus className="size-4" /> Add Reminder</TealButton>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reminders.map((r, i) => (
                  <motion.div key={r.id} className="p-4 rounded-xl group relative overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,242,234,0.08)', backdropFilter: 'blur(12px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, borderColor: 'rgba(0,242,234,0.22)' }}
                  >
                    <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }} />
                    <div className="flex items-start gap-3 relative">
                      <button onClick={() => toggleReminder(r.id)} style={{ color: r.completed ? TEAL : '#A1A1A1', marginTop: 2 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = r.completed ? TEAL : '#A1A1A1')}
                      >{r.completed ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}</button>
                      <div className="flex-1">
                        <div className="font-semibold mb-1 text-sm" style={{ color: r.completed ? '#A1A1A1' : '#fff', textDecoration: r.completed ? 'line-through' : 'none', ...headingFont }}>{r.title}</div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#A1A1A1', ...monoFont }}><Calendar className="size-3" />{new Date(r.dueDate).toLocaleDateString()}</div>
                      </div>
                      <button onClick={() => deleteReminder(r.id)} className="opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TiltCard>
          </>
        )}

        {/* ─── BUDGETS VIEW ─── */}
        {activeView === 'budgets' && (
          <TiltCard teal className="p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white" style={headingFont}>Budget Management</h2>
              <TealButton onClick={() => setShowAddBudget(true)}><Plus className="size-4" /> Add Budget</TealButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((b, i) => {
                const pct = (b.spent / b.limit) * 100;
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
                        <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>{sym}{b.spent} / {sym}{b.limit}</p>
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
          </TiltCard>
        )}

        {/* ─── EXPENSES VIEW ─── */}
        {activeView === 'expenses' && (
          <TiltCard teal className="p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white" style={headingFont}>All Expenses</h2>
              <TealButton onClick={() => setShowAddExpense(true)}><Plus className="size-4" /> Add Expense</TealButton>
            </div>
            <div className="space-y-3">
              {expenses.map((e, i) => (
                <motion.div key={e.id} className="flex items-center justify-between p-5 rounded-xl group relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.01, borderColor: 'rgba(0,242,234,0.2)' }}
                >
                  <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }} />
                  <div className="flex items-center gap-4 flex-1 relative">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(0,242,234,0.1)', border: '1px solid rgba(0,242,234,0.2)', boxShadow: '0 4px 16px rgba(0,242,234,0.1), inset 0 1px 0 rgba(0,242,234,0.2)' }}>
                      <DollarSign className="size-6" style={{ color: TEAL, filter: 'drop-shadow(0 0 6px #00F2EA)' }} />
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-white" style={headingFont}>{e.description}</div>
                      <div className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>{e.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 relative">
                    <div className="text-right">
                      <div className="font-bold text-xl text-red-400" style={monoFont}>-{sym}{e.amount}</div>
                      <div className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>{new Date(e.date).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => deleteExpense(e.id)} className="opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:text-red-300"><Trash2 className="size-5" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TiltCard>
        )}

        {/* ─── REMINDERS VIEW ─── */}
        {activeView === 'reminders' && (
          <TiltCard teal className="p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white" style={headingFont}>Financial Reminders</h2>
              <TealButton onClick={() => setShowAddReminder(true)}><Plus className="size-4" /> Add Reminder</TealButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders.map((r, i) => (
                <motion.div key={r.id} className="p-5 rounded-xl group relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,242,234,0.08)', backdropFilter: 'blur(12px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(0,242,234,0.22)' }}
                >
                  <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)' }} />
                  <div className="flex items-start gap-3 relative">
                    <button onClick={() => toggleReminder(r.id)} style={{ color: r.completed ? TEAL : '#A1A1A1', marginTop: 3 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = r.completed ? TEAL : '#A1A1A1')}
                    >{r.completed ? <CheckCircle2 className="size-6" /> : <Circle className="size-6" />}</button>
                    <div className="flex-1">
                      <div className="font-semibold text-lg mb-2" style={{ color: r.completed ? '#A1A1A1' : '#fff', textDecoration: r.completed ? 'line-through' : 'none', ...headingFont }}>{r.title}</div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#A1A1A1', ...monoFont }}><Calendar className="size-4" />{new Date(r.dueDate).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => deleteReminder(r.id)} className="opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:text-red-300"><Trash2 className="size-5" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TiltCard>
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
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Description</label>
              <input type="text" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} required style={{ ...inputStyle }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 0 14px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08)'; }}
              /></div>
            <div><label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Date</label>
              <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} required style={{ ...inputStyle }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 0 14px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08)'; }}
              /></div>
            <div className="flex gap-3 pt-2"><TealButton type="submit" className="flex-1 py-2.5">Add Expense</TealButton><GhostButton onClick={() => setShowAddExpense(false)}>Cancel</GhostButton></div>
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
            <div className="flex gap-3 pt-2"><TealButton type="submit" className="flex-1 py-2.5">Add Reminder</TealButton><GhostButton onClick={() => setShowAddReminder(false)}>Cancel</GhostButton></div>
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
            <div className="flex gap-3 pt-2"><TealButton type="submit" className="flex-1 py-2.5">Save</TealButton><GhostButton onClick={() => setShowEditSalary(false)}>Cancel</GhostButton></div>
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
            <div className="flex gap-3 pt-2"><TealButton type="submit" className="flex-1 py-2.5">Add Budget</TealButton><GhostButton onClick={() => setShowAddBudget(false)}>Cancel</GhostButton></div>
          </form>
        </ModalCard>
      )}

      <LoanCalculator isOpen={showLoanCalculator} onClose={() => setShowLoanCalculator(false)} currencySymbol={sym} />
    </div>
  );
}