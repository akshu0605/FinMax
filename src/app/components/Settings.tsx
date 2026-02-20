import { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Wallet,
  Bell,
  Palette,
  Shield,
  Database,
  CreditCard,
  ChevronRight,
  Upload,
  Lock,
  Mail,
  Phone,
  Calendar,
  Globe,
  Download,
  FileUp,
  Trash2,
  LogOut,
  Check,
  AlertTriangle,
  Smartphone,
  Monitor,
  Eye,
  Settings as SettingsIcon,
  Save,
} from 'lucide-react';
import { Logo } from './Logo';

interface SettingsProps {
  userEmail: string;
  onBack: () => void;
  onLogout: () => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

type SettingsSection = 
  | 'profile' 
  | 'financial' 
  | 'notifications' 
  | 'appearance' 
  | 'security' 
  | 'data' 
  | 'subscription';

export function Settings({ userEmail, onBack, onLogout, currency, onCurrencyChange }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Profile states
  const [fullName, setFullName] = useState('John Doe');
  const [phone, setPhone] = useState('+91 98765 43210');
  
  // Financial preferences
  const [salaryCreditDate, setSalaryCreditDate] = useState('1');
  const [financialYear, setFinancialYear] = useState('April-March');
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [overBudgetWarning, setOverBudgetWarning] = useState(true);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetAlertsNotif, setBudgetAlertsNotif] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [emiReminders, setEmiReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  
  // Appearance settings
  const [darkMode, setDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState('#6366F1');
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Active sessions
  const activeSessions = [
    { device: 'Chrome on Windows', location: 'Mumbai, India', lastActive: '5 minutes ago', current: true },
    { device: 'Safari on iPhone', location: 'Mumbai, India', lastActive: '2 hours ago', current: false },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'financial' as const, label: 'Financial Preferences', icon: Wallet },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'data' as const, label: 'Data Management', icon: Database },
    { id: 'subscription' as const, label: 'Subscription', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Profile Settings</h2>
              <p className="text-white/60">Manage your personal information</p>
            </div>

            {/* Profile Image */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="size-12 text-white" />
                    )}
                  </div>
                  <label className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="size-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{fullName}</h3>
                  <p className="text-white/60 mb-2">{userEmail}</p>
                  <button className="text-sm text-[#6366F1] hover:text-[#8B5CF6] transition-colors">
                    Upload new photo
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              
              <div>
                <label className="block text-sm text-white/60 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/40" />
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/40" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold hover:shadow-lg hover:shadow-[#6366F1]/50 transition-all"
                >
                  <Save className="size-4" />
                  Save Changes
                </motion.button>
              </div>
            </div>

            {/* Security Actions */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Security</h3>
              
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#6366F1]/50 transition-all group">
                <div className="flex items-center gap-3">
                  <Lock className="size-5 text-white/60 group-hover:text-[#6366F1] transition-colors" />
                  <span>Change Password</span>
                </div>
                <ChevronRight className="size-5 text-white/40" />
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all group">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-5 text-red-400" />
                  <span className="text-red-400">Delete Account</span>
                </div>
                <ChevronRight className="size-5 text-red-400/60" />
              </button>
            </div>
          </motion.div>
        );

      case 'financial':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Financial Preferences</h2>
              <p className="text-white/60">Customize your financial settings</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 space-y-6">
              <div>
                <label className="block text-sm text-white/60 mb-2">Default Currency</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/40" />
                  <select
                    value={currency}
                    onChange={(e) => onCurrencyChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="INR">INR - Indian Rupee (₹)</option>
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                    <option value="JPY">JPY - Japanese Yen (¥)</option>
                    <option value="AUD">AUD - Australian Dollar (A$)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Salary Credit Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/40" />
                  <select
                    value={salaryCreditDate}
                    onChange={(e) => setSalaryCreditDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all appearance-none cursor-pointer"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of every month</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Financial Year</label>
                <select
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="April-March">April - March (India)</option>
                  <option value="January-December">January - December (Calendar Year)</option>
                  <option value="July-June">July - June (Australia)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Enable Budget Alerts</div>
                    <div className="text-sm text-white/60">Get notified when approaching budget limits</div>
                  </div>
                  <button
                    onClick={() => setBudgetAlerts(!budgetAlerts)}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      budgetAlerts ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                      animate={{ left: budgetAlerts ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Over-Budget Warning</div>
                    <div className="text-sm text-white/60">Alert when expenses exceed budget</div>
                  </div>
                  <button
                    onClick={() => setOverBudgetWarning(!overBudgetWarning)}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      overBudgetWarning ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                      animate={{ left: overBudgetWarning ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold hover:shadow-lg hover:shadow-[#6366F1]/50 transition-all"
              >
                Save Preferences
              </motion.button>
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Notification Settings</h2>
              <p className="text-white/60">Manage how you receive notifications</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Mail className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Email Notifications</div>
                    <div className="text-sm text-white/60">Receive updates via email</div>
                  </div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    emailNotifications ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ left: emailNotifications ? '28px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                    <AlertTriangle className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Budget Alerts</div>
                    <div className="text-sm text-white/60">Notify when approaching limits</div>
                  </div>
                </div>
                <button
                  onClick={() => setBudgetAlertsNotif(!budgetAlertsNotif)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    budgetAlertsNotif ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ left: budgetAlertsNotif ? '28px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <Calendar className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Bill Reminders</div>
                    <div className="text-sm text-white/60">Get reminded before bill due dates</div>
                  </div>
                </div>
                <button
                  onClick={() => setBillReminders(!billReminders)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    billReminders ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ left: billReminders ? '28px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <CreditCard className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">EMI Reminders</div>
                    <div className="text-sm text-white/60">Loan payment notifications</div>
                  </div>
                </div>
                <button
                  onClick={() => setEmiReminders(!emiReminders)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    emiReminders ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ left: emiReminders ? '28px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Bell className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Weekly Financial Summary</div>
                    <div className="text-sm text-white/60">Weekly spending overview</div>
                  </div>
                </div>
                <button
                  onClick={() => setWeeklySummary(!weeklySummary)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    weeklySummary ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ left: weeklySummary ? '28px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'appearance':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Appearance Settings</h2>
              <p className="text-white/60">Customize your interface</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                    <Palette className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Dark Mode</div>
                    <div className="text-sm text-white/60">Use dark theme across the app</div>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    darkMode ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ left: darkMode ? '28px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-3">Accent Color</label>
                <div className="flex gap-3">
                  {['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'].map(color => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`w-12 h-12 rounded-xl transition-all ${
                        accentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0F172A] scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {accentColor === color && <Check className="size-6 text-white m-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Compact Mode</div>
                  <div className="text-sm text-white/60">Reduce spacing for more content</div>
                </div>
                <button
                  onClick={() => setCompactMode(!compactMode)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    compactMode ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ left: compactMode ? '28px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Enable Animations</div>
                  <div className="text-sm text-white/60">Smooth transitions and effects</div>
                </div>
                <button
                  onClick={() => setAnimationsEnabled(!animationsEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    animationsEnabled ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ left: animationsEnabled ? '28px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Security Settings</h2>
              <p className="text-white/60">Manage your account security</p>
            </div>

            {/* Security Status */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Shield className="size-6 text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-green-400">Account Secure</div>
                  <div className="text-sm text-white/60">Your account security is strong</div>
                </div>
              </div>
            </div>

            {/* Security Options */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 space-y-4">
              <button className="w-full flex items-center justify-between px-4 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#6366F1]/50 transition-all group">
                <div className="flex items-center gap-3">
                  <Lock className="size-5 text-white/60 group-hover:text-[#6366F1] transition-colors" />
                  <div className="text-left">
                    <div className="font-semibold">Change Password</div>
                    <div className="text-sm text-white/60">Update your password</div>
                  </div>
                </div>
                <ChevronRight className="size-5 text-white/40" />
              </button>

              <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Shield className="size-5 text-white/60" />
                  <div>
                    <div className="font-semibold">Two-Factor Authentication</div>
                    <div className="text-sm text-white/60">Add extra security layer</div>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    twoFactorEnabled ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ left: twoFactorEnabled ? '28px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Active Login Sessions</h3>
              <div className="space-y-3">
                {activeSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      {session.device.includes('Windows') || session.device.includes('Chrome') ? (
                        <Monitor className="size-5 text-white/60" />
                      ) : (
                        <Smartphone className="size-5 text-white/60" />
                      )}
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {session.device}
                          {session.current && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-white/60">{session.location} • {session.lastActive}</div>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <LogOut className="size-4" />
                  Logout from All Devices
                </div>
              </motion.button>
            </div>
          </motion.div>
        );

      case 'data':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Data Management</h2>
              <p className="text-white/60">Manage your financial data</p>
            </div>

            {/* Export Data */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Export Data</h3>
              <p className="text-white/60 mb-4">Download your financial data in various formats</p>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold hover:shadow-lg hover:shadow-[#6366F1]/50 transition-all"
                >
                  <Download className="size-4" />
                  Export as CSV
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  <Download className="size-4" />
                  Export as PDF
                </motion.button>
              </div>
            </div>

            {/* Import Data */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Import Data</h3>
              <p className="text-white/60 mb-4">Import financial data from external sources</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
              >
                <FileUp className="size-4" />
                Import CSV File
              </motion.button>
            </div>

            {/* Backup & Restore */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Backup & Restore</h3>
              <p className="text-white/60 mb-4">Create a backup or restore from previous backup</p>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all"
                >
                  <Database className="size-4" />
                  Create Backup
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  <Upload className="size-4" />
                  Restore Backup
                </motion.button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="size-5 text-red-400 mt-0.5" />
                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-1">Danger Zone</h3>
                  <p className="text-white/60 text-sm">These actions cannot be undone</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-semibold hover:bg-red-500/30 transition-all"
              >
                <Trash2 className="size-4" />
                Reset All Financial Data
              </motion.button>
            </div>
          </motion.div>
        );

      case 'subscription':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Subscription & Billing</h2>
              <p className="text-white/60">Manage your subscription plan</p>
            </div>

            {/* Current Plan */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 border border-[#6366F1]/30">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-sm text-white/60 mb-1">Current Plan</div>
                  <h3 className="text-3xl font-bold mb-2">Pro Plan</h3>
                  <p className="text-white/60">Full access to all features</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">₹499</div>
                  <div className="text-sm text-white/60">/month</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="size-4 text-green-400" />
                  Unlimited expense tracking
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="size-4 text-green-400" />
                  Advanced financial calculators
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="size-4 text-green-400" />
                  AI-powered insights
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="size-4 text-green-400" />
                  Priority support
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold hover:shadow-lg hover:shadow-[#6366F1]/50 transition-all"
              >
                Upgrade to Premium
              </motion.button>
            </div>

            {/* Payment Method */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <CreditCard className="size-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">•••• •••• •••• 4242</div>
                    <div className="text-sm text-white/60">Expires 12/2026</div>
                  </div>
                </div>
                <button className="text-sm text-[#6366F1] hover:text-[#8B5CF6] transition-colors">
                  Edit
                </button>
              </div>
            </div>

            {/* Billing History */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Billing History</h3>
              <div className="space-y-3">
                {[
                  { date: 'Feb 1, 2026', amount: '₹499', status: 'Paid' },
                  { date: 'Jan 1, 2026', amount: '₹499', status: 'Paid' },
                  { date: 'Dec 1, 2025', amount: '₹499', status: 'Paid' },
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Calendar className="size-5 text-white/60" />
                      <div>
                        <div className="font-semibold">{invoice.date}</div>
                        <div className="text-sm text-white/60">{invoice.amount}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        {invoice.status}
                      </span>
                      <button className="text-sm text-[#6366F1] hover:text-[#8B5CF6] transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Floating decorative icon */}
      <motion.div
        className="fixed top-8 right-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 border border-[#6366F1]/30 flex items-center justify-center z-10"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <SettingsIcon className="size-8 text-[#6366F1]" />
      </motion.div>

      {/* Header */}
      <div className="border-b border-white/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
            >
              <ChevronRight className="size-5 rotate-180" />
            </button>
            <Logo />
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left Navigation */}
        <motion.aside
          className="w-80 min-h-[calc(100vh-89px)] border-r border-white/10 p-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Settings</h1>
            <p className="text-white/60 text-sm">Manage your account preferences</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 border border-[#6366F1]/50 text-white shadow-lg shadow-[#6366F1]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                whileHover={{ x: activeSection === item.id ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className={`size-5 ${activeSection === item.id ? 'text-[#6366F1]' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-[#6366F1]"
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
