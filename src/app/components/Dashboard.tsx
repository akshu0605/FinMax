import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Plus,
  Bell,
  Settings,
  LogOut,
  DollarSign,
  Calendar,
  Target,
  CheckCircle2,
  Circle,
  Trash2,
  Globe,
  Calculator,
  Edit,
  X,
  HeadphonesIcon,
  Heart
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Logo } from './Logo';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LoanCalculator } from './LoanCalculator';
import { Settings as SettingsPage } from './Settings';
import { ContactDeveloper } from './ContactDeveloper';

interface DashboardProps {
  userEmail: string;
  userId: string;
  accessToken: string;
  onLogout: () => void;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
};

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

export function Dashboard({ userEmail, userId, accessToken, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'budgets' | 'expenses' | 'reminders'>('dashboard');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [salary, setSalary] = useState(50000);
  const [budget, setBudget] = useState(35000);
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

  const [newExpense, setNewExpense] = useState({
    category: 'Food & Dining',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [newReminder, setNewReminder] = useState({
    title: '',
    dueDate: '',
  });

  const [newBudget, setNewBudget] = useState({
    category: 'Food & Dining',
    limit: '',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const storageKey = `finmax_${userId}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.expenses) setExpenses(data.expenses);
        if (data.reminders) setReminders(data.reminders);
        if (data.budgets) setBudgets(data.budgets);
        if (data.salary) setSalary(data.salary);
        if (data.currency) setCurrency(data.currency);
      } catch {
        // data load failed silently; defaults will be used
      }
    }
  }, [userId]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const storageKey = `finmax_${userId}`;
    const dataToSave = {
      expenses,
      reminders,
      budgets,
      salary,
      currency,
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  }, [expenses, reminders, budgets, salary, currency, userId]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = salary - totalExpenses;
  const savingsRate = ((savings / salary) * 100).toFixed(1);

  // Calculate category totals for pie chart
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      description: newExpense.description,
    };
    setExpenses([expense, ...expenses]);
    setNewExpense({
      category: 'Food & Dining',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddExpense(false);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      dueDate: newReminder.dueDate,
      completed: false,
    };
    setReminders([...reminders, reminder]);
    setNewReminder({ title: '', dueDate: '' });
    setShowAddReminder(false);
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudgetItem: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      spent: 0,
    };
    setBudgets([...budgets, newBudgetItem]);
    setNewBudget({ category: 'Food & Dining', limit: '' });
    setShowAddBudget(false);
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  // Update budget spent amounts based on expenses
  useEffect(() => {
    const updatedBudgets = budgets.map(budget => {
      const categoryExpenses = expenses
        .filter(expense => expense.category === budget.category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return { ...budget, spent: categoryExpenses };
    });
    setBudgets(updatedBudgets);
  }, [expenses]);

  // Animated counter hook
  const useCounter = (end: number, duration: number = 1000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
  };

  const animatedSalary = useCounter(salary);
  const animatedExpenses = useCounter(totalExpenses);
  const animatedSavings = useCounter(savings);

  // Show Settings page if active
  if (showSettings) {
    return (
      <SettingsPage
        userEmail={userEmail}
        onBack={() => setShowSettings(false)}
        onLogout={onLogout}
        currency={currency}
        onCurrencyChange={(newCurrency) => setCurrency(newCurrency as Currency)}
      />
    );
  }

  // Show Contact Developer page if active
  if (showContactDeveloper) {
    return (
      <ContactDeveloper
        onBack={() => setShowContactDeveloper(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 bottom-0 w-64 bg-[#111827] border-r border-white/10 p-6 flex flex-col"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo className="mb-12" />

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <Wallet className="size-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView('budgets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'budgets'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <Target className="size-5" />
            <span>Budgets</span>
          </button>
          <button
            onClick={() => setActiveView('expenses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'expenses'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <TrendingDown className="size-5" />
            <span>Expenses</span>
          </button>
          <button
            onClick={() => setActiveView('reminders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'reminders'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <Bell className="size-5" />
            <span>Reminders</span>
          </button>

          {/* Financial Tools Button */}
          <motion.button
            onClick={() => setShowLoanCalculator(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 text-yellow-400 hover:from-yellow-500/30 hover:to-yellow-600/30 transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calculator className="size-5 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">Financial Tools</span>
          </motion.button>
        </nav>

        <div className="space-y-2 border-t border-white/10 pt-6">
          <button
            onClick={() => setShowContactDeveloper(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <HeadphonesIcon className="size-5" />
            <span>Contact Developer</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings className="size-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="size-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Financial Dashboard</h1>
            <p className="text-white/60">Welcome back, {userEmail}</p>
          </div>

          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencySelector(!showCurrencySelector)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#6366F1]/50 transition-all"
            >
              <Globe className="size-5" />
              <span className="font-semibold">{currency}</span>
              <span className="text-2xl">{CURRENCY_SYMBOLS[currency]}</span>
            </button>

            {showCurrencySelector && (
              <motion.div
                className="absolute top-full mt-2 right-0 w-48 p-2 rounded-xl bg-[#111827] border border-white/10 shadow-2xl z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {(Object.keys(CURRENCY_SYMBOLS) as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setShowCurrencySelector(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${currency === curr
                        ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                        : 'hover:bg-white/5 text-white/80'
                      }`}
                  >
                    <span className="font-medium">{curr}</span>
                    <span className="text-xl">{CURRENCY_SYMBOLS[curr]}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                  <DollarSign className="size-6 text-white" />
                </div>
                <button
                  onClick={() => setShowEditSalary(true)}
                  className="text-xs text-white/60 hover:text-white"
                >
                  Edit
                </button>
              </div>
              <div className="text-3xl font-bold mb-1">{CURRENCY_SYMBOLS[currency]}{animatedSalary.toLocaleString()}</div>
              <div className="text-sm text-white/60">Monthly Income</div>
            </div>
          </motion.div>

          <motion.div
            className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <TrendingDown className="size-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{CURRENCY_SYMBOLS[currency]}{animatedExpenses.toLocaleString()}</div>
              <div className="text-sm text-white/60">Total Expenses</div>
            </div>
          </motion.div>

          <motion.div
            className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <PiggyBank className="size-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{CURRENCY_SYMBOLS[currency]}{animatedSavings.toLocaleString()}</div>
              <div className="text-sm text-white/60">Total Savings</div>
            </div>
          </motion.div>

          <motion.div
            className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ y: -4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <TrendingUp className="size-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{savingsRate}%</div>
              <div className="text-sm text-white/60">Savings Rate</div>
            </div>
          </motion.div>
        </div>

        {/* Conditional Content Based on Active View */}
        {activeView === 'dashboard' && (
          <>
            {/* Charts and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Spending Chart */}
              <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2 className="text-2xl font-bold mb-6">Spending by Category</h2>
                <div className="h-[300px] w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height={300} minHeight={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111827',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend
                        wrapperStyle={{ color: '#fff' }}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recent Expenses */}
              <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Recent Expenses</h2>
                  <button
                    onClick={() => setShowAddExpense(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:shadow-lg hover:shadow-[#6366F1]/30 transition-all"
                  >
                    <Plus className="size-4" />
                    Add
                  </button>
                </div>
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                  {expenses.slice(0, 5).map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                          <DollarSign className="size-5" />
                        </div>
                        <div>
                          <div className="font-semibold">{expense.description}</div>
                          <div className="text-sm text-white/60">{expense.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-red-400">-{CURRENCY_SYMBOLS[currency]}{expense.amount}</div>
                          <div className="text-xs text-white/60">{new Date(expense.date).toLocaleDateString()}</div>
                        </div>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Financial Reminders */}
            <motion.div
              className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Financial Reminders</h2>
                <button
                  onClick={() => setShowAddReminder(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:shadow-lg hover:shadow-[#6366F1]/30 transition-all"
                >
                  <Plus className="size-4" />
                  Add Reminder
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reminders.map((reminder, index) => (
                  <motion.div
                    key={reminder.id}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className="mt-1 text-[#6366F1] hover:text-[#8B5CF6] transition-colors"
                      >
                        {reminder.completed ? (
                          <CheckCircle2 className="size-5" />
                        ) : (
                          <Circle className="size-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className={`font-semibold mb-1 ${reminder.completed ? 'line-through text-white/60' : ''}`}>
                          {reminder.title}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Calendar className="size-4" />
                          {new Date(reminder.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Budgets View */}
        {activeView === 'budgets' && (
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Budget Management</h2>
              <button
                onClick={() => setShowAddBudget(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:shadow-lg hover:shadow-[#6366F1]/30 transition-all"
              >
                <Plus className="size-4" />
                Add Budget
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget, index) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const isOverBudget = percentage > 100;
                return (
                  <motion.div
                    key={budget.id}
                    className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{budget.category}</h3>
                        <p className="text-sm text-white/60">
                          {CURRENCY_SYMBOLS[currency]}{budget.spent} / {CURRENCY_SYMBOLS[currency]}{budget.limit}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteBudget(budget.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mb-2">
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${isOverBudget
                              ? 'bg-red-500'
                              : percentage > 80
                                ? 'bg-yellow-500'
                                : 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]'
                            }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className={`text-sm font-semibold ${isOverBudget ? 'text-red-400' : 'text-white/80'}`}>
                      {percentage.toFixed(1)}% used
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Expenses View */}
        {activeView === 'expenses' && (
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">All Expenses</h2>
              <button
                onClick={() => setShowAddExpense(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:shadow-lg hover:shadow-[#6366F1]/30 transition-all"
              >
                <Plus className="size-4" />
                Add Expense
              </button>
            </div>
            <div className="space-y-3">
              {expenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  className="flex items-center justify-between p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                      <DollarSign className="size-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{expense.description}</div>
                      <div className="text-sm text-white/60">{expense.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-xl text-red-400">-{CURRENCY_SYMBOLS[currency]}{expense.amount}</div>
                      <div className="text-sm text-white/60">{new Date(expense.date).toLocaleDateString()}</div>
                    </div>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reminders View */}
        {activeView === 'reminders' && (
          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Financial Reminders</h2>
              <button
                onClick={() => setShowAddReminder(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:shadow-lg hover:shadow-[#6366F1]/30 transition-all"
              >
                <Plus className="size-4" />
                Add Reminder
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  className="p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className="mt-1 text-[#6366F1] hover:text-[#8B5CF6] transition-colors"
                    >
                      {reminder.completed ? (
                        <CheckCircle2 className="size-6" />
                      ) : (
                        <Circle className="size-6" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className={`font-semibold text-lg mb-2 ${reminder.completed ? 'line-through text-white/60' : ''}`}>
                        {reminder.title}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="size-4" />
                        {new Date(reminder.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          className="mt-12 py-6 text-center border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p className="text-white/60 flex items-center justify-center gap-2">
            <span>Made with</span>
            <Heart className="size-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <span className="font-semibold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
              Akshit Jaswal
            </span>
            <span>🚀</span>
          </p>
        </motion.div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-[#111827] rounded-2xl border border-white/10 p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-2xl font-bold mb-6">Add Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option>Food & Dining</option>
                  <option>Transportation</option>
                  <option>Entertainment</option>
                  <option>Shopping</option>
                  <option>Bills</option>
                  <option>Healthcare</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1]"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] font-semibold hover:shadow-lg hover:shadow-[#6366F1]/30 transition-all"
                >
                  Add Expense
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-[#111827] rounded-2xl border border-white/10 p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-2xl font-bold mb-6">Add Reminder</h3>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1]"
                  required
                  placeholder="e.g., Pay rent"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newReminder.dueDate}
                  onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1]"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] font-semibold hover:shadow-lg hover:shadow-[#6366F1]/30 transition-all"
                >
                  Add Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddReminder(false)}
                  className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Salary Modal */}
      {showEditSalary && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-[#111827] rounded-2xl border border-white/10 p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-2xl font-bold mb-6">Edit Monthly Income</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowEditSalary(false);
            }} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Monthly Income ($)</label>
                <input
                  type="number"
                  step="100"
                  value={salary}
                  onChange={(e) => setSalary(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1]"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] font-semibold hover:shadow-lg hover:shadow-[#6366F1]/30 transition-all"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditSalary(false)}
                  className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-[#111827] rounded-2xl border border-white/10 p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-2xl font-bold mb-6">Add Budget</h3>
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option>Food & Dining</option>
                  <option>Transportation</option>
                  <option>Entertainment</option>
                  <option>Shopping</option>
                  <option>Bills</option>
                  <option>Healthcare</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Limit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1]"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] font-semibold hover:shadow-lg hover:shadow-[#6366F1]/30 transition-all"
                >
                  Add Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBudget(false)}
                  className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Loan Calculator Modal */}
      <LoanCalculator
        isOpen={showLoanCalculator}
        onClose={() => setShowLoanCalculator(false)}
        currencySymbol={CURRENCY_SYMBOLS[currency]}
      />
    </div>
  );
}