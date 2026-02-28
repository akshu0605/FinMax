import { useState } from 'react';
import { motion } from 'motion/react';
import {
  User, Wallet, Bell, Palette, Shield, Database, CreditCard, ChevronRight,
  Upload, Lock, Mail, Phone, Calendar, Globe, Download, FileUp, Trash2,
  LogOut, Check, AlertTriangle, Smartphone, Monitor, Settings as SettingsIcon, Save, ArrowLeft,
} from 'lucide-react';
import { Logo } from './Logo';
import { StarField } from './StarField';

import { GlassCard } from './ui/GlassCard';
import { NeonButton } from './ui/NeonButton';

// ─── Design tokens ────────────────────────────────────────────────
const TEAL = '#00f2ff';
const headingFont: React.CSSProperties = { fontFamily: 'Inter, Geist, SF Pro, sans-serif' };
const monoFont: React.CSSProperties = { fontFamily: 'JetBrains Mono, "Courier New", monospace' };

const inputBase: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(0,242,234,0.18)',
  borderRadius: '12px', color: '#fff', outline: 'none', ...monoFont,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};

const sheen = (
  <div className="absolute inset-0 pointer-events-none rounded-[inherit]"
    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
);

// ─── Teal toggle switch ───────────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="relative w-14 h-8 rounded-full transition-all shrink-0"
      style={on ? {
        background: TEAL,
        boxShadow: `0 0 14px rgba(0,242,234,0.4)`,
      } : {
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <motion.div
        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
        animate={{ left: on ? '24px' : '4px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ boxShadow: on ? '0 0 8px rgba(0,242,234,0.5)' : '0 2px 6px rgba(0,0,0,0.4)' }}
      />
    </button>
  );
}

// ─── Row with toggle ──────────────────────────────────────────────
function ToggleRow({ icon: Icon, iconColor, label, description, on, onToggle }: {
  icon: any; iconColor: string; label: string; description: string; on: boolean; onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `rgba(${iconColor === TEAL ? '0,242,234' : iconColor === '#34D399' ? '52,211,153' : iconColor === '#F87171' ? '248,113,113' : iconColor === '#60A5FA' ? '96,165,250' : iconColor === '#FBBF24' ? '251,191,36' : '167,139,250'},0.1)`,
            border: `1px solid ${iconColor}25`,
          }}>
          <Icon className="size-5" style={{ color: iconColor }} />
        </div>
        <div>
          <div className="font-semibold text-white text-sm" style={headingFont}>{label}</div>
          <div className="text-xs mt-0.5" style={{ color: '#A1A1A1', ...monoFont }}>{description}</div>
        </div>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}


// ─── Types ────────────────────────────────────────────────────────
interface SettingsProps { userEmail: string; onBack: () => void; onLogout: () => void; currency: string; onCurrencyChange: (c: string) => void; }
type SettingsSection = 'profile' | 'financial' | 'notifications' | 'appearance' | 'security' | 'data' | 'subscription';

export function Settings({ userEmail, onBack, onLogout, currency, onCurrencyChange }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState('John Doe');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [salaryCreditDate, setSalaryCreditDate] = useState('1');
  const [financialYear, setFinancialYear] = useState('April-March');
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [overBudgetWarning, setOverBudgetWarning] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetAlertsNotif, setBudgetAlertsNotif] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [emiReminders, setEmiReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const activeSessions = [
    { device: 'Chrome on Windows', location: 'Mumbai, India', lastActive: '5 minutes ago', current: true },
    { device: 'Safari on iPhone', location: 'Mumbai, India', lastActive: '2 hours ago', current: false },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onloadend = () => setProfileImage(r.result as string); r.readAsDataURL(file); }
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

  const sectionTitles: Record<SettingsSection, { title: string; sub: string }> = {
    profile: { title: 'Profile Settings', sub: 'Manage your personal information' },
    financial: { title: 'Financial Preferences', sub: 'Customize your financial settings' },
    notifications: { title: 'Notification Settings', sub: 'Manage how you receive notifications' },
    appearance: { title: 'Appearance Settings', sub: 'Customize your interface' },
    security: { title: 'Security Settings', sub: 'Manage your account security' },
    data: { title: 'Data Management', sub: 'Manage your financial data' },
    subscription: { title: 'Subscription & Billing', sub: 'Manage your subscription plan' },
  };

  const selectStyle: React.CSSProperties = {
    ...inputBase,
    appearance: 'none', cursor: 'pointer',
    paddingLeft: '2.75rem',
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Avatar */}
            <GlassCard rounded="apple">
              <div className="flex items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: 'rgba(0,242,234,0.1)', border: '2px solid rgba(0,242,234,0.3)', boxShadow: '0 0 20px rgba(0,242,234,0.15)' }}>
                    {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User className="size-12" style={{ color: TEAL }} />}
                  </div>
                  <label className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ background: 'rgba(0,0,0,0.65)' }}>
                    <Upload className="size-6 text-white" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1" style={headingFont}>{fullName}</h3>
                  <p className="text-sm mb-3" style={{ color: '#A1A1A1', ...monoFont }}>{userEmail}</p>
                  <label className="text-sm font-semibold transition-colors cursor-pointer" style={{ color: TEAL, ...monoFont }}>
                    Upload new photo
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </GlassCard>

            {/* Personal info */}
            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-5" style={headingFont}>Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputBase}
                    onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = '0 0 16px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.07)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.07)'; }} />
                </div>
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4" style={{ color: '#A1A1A1' }} />
                    <input type="email" value={userEmail} disabled style={{ ...inputBase, paddingLeft: '2.75rem', color: '#A1A1A1', cursor: 'not-allowed' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4" style={{ color: '#A1A1A1' }} />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ ...inputBase, paddingLeft: '2.75rem' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = '0 0 16px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.07)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.07)'; }} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <NeonButton><Save className="size-4" /> Save Changes</NeonButton>
                </div>
              </div>
            </GlassCard>

            {/* Security quick actions */}
            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-4" style={headingFont}>Quick Security</h3>
              <div className="space-y-3">
                <motion.button className="w-full flex items-center justify-between px-4 py-3 rounded-xl group relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}
                  whileHover={{ borderColor: 'rgba(0,242,234,0.3)' }}>
                  <div className="flex items-center gap-3">
                    <Lock className="size-5" style={{ color: '#A1A1A1' }} />
                    <span className="text-white text-sm" style={headingFont}>Change Password</span>
                  </div>
                  <ChevronRight className="size-4" style={{ color: '#A1A1A1' }} />
                </motion.button>
                <motion.button className="w-full flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.22)', backdropFilter: 'blur(10px)' }}
                  whileHover={{ background: 'rgba(248,113,113,0.12)' }}>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="size-5 text-red-400" />
                    <span className="text-red-400 text-sm" style={headingFont}>Delete Account</span>
                  </div>
                  <ChevronRight className="size-4 text-red-400/60" />
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        );

      case 'financial':
        return (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-5" style={headingFont}>Financial Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Default Currency</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 z-10" style={{ color: TEAL }} />
                    <select value={currency} onChange={(e) => onCurrencyChange(e.target.value)} style={selectStyle}>
                      {['INR - Indian Rupee (₹)', 'USD - US Dollar ($)', 'EUR - Euro (€)', 'GBP - British Pound (£)', 'JPY - Japanese Yen (¥)', 'AUD - Australian Dollar (A$)'].map((o) => (
                        <option key={o} value={o.split(' ')[0]} style={{ background: '#0A0A0A' }}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Salary Credit Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 z-10" style={{ color: TEAL }} />
                    <select value={salaryCreditDate} onChange={(e) => setSalaryCreditDate(e.target.value)} style={selectStyle}>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d} style={{ background: '#0A0A0A' }}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'} of every month</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#A1A1A1', ...monoFont }}>Financial Year</label>
                  <select value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} style={inputBase as any}
                    onFocus={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = '0 0 16px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.07)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,242,234,0.18)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.07)'; }}>
                    <option value="April-March" style={{ background: '#0A0A0A' }}>April – March (India)</option>
                    <option value="January-December" style={{ background: '#0A0A0A' }}>January – December (Calendar Year)</option>
                    <option value="July-June" style={{ background: '#0A0A0A' }}>July – June (Australia)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(0,242,234,0.08)' }}>
                <ToggleRow icon={Bell} iconColor={TEAL} label="Enable Budget Alerts" description="Get notified when approaching budget limits" on={budgetAlerts} onToggle={() => setBudgetAlerts(!budgetAlerts)} />
                <ToggleRow icon={AlertTriangle} iconColor="#FBBF24" label="Over-Budget Warning" description="Alert when expenses exceed budget" on={overBudgetWarning} onToggle={() => setOverBudgetWarning(!overBudgetWarning)} />
              </div>
              <div className="mt-5">
                <NeonButton className="w-full py-3">Save Preferences</NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-2" style={headingFont}>Notification Settings</h3>
              <p className="text-sm mb-5" style={{ color: '#A1A1A1', ...monoFont }}>Manage how you receive notifications</p>
              <div>
                <ToggleRow icon={Mail} iconColor="#60A5FA" label="Email Notifications" description="Receive updates via email" on={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} />
                <ToggleRow icon={AlertTriangle} iconColor="#FBBF24" label="Budget Alerts" description="Notify when approaching limits" on={budgetAlertsNotif} onToggle={() => setBudgetAlertsNotif(!budgetAlertsNotif)} />
                <ToggleRow icon={Calendar} iconColor="#F87171" label="Bill Reminders" description="Get reminded before bill due dates" on={billReminders} onToggle={() => setBillReminders(!billReminders)} />
                <ToggleRow icon={CreditCard} iconColor="#A78BFA" label="EMI Reminders" description="Loan payment notifications" on={emiReminders} onToggle={() => setEmiReminders(!emiReminders)} />
                <div className="pt-0">
                  <ToggleRow icon={Bell} iconColor="#34D399" label="Weekly Financial Summary" description="Weekly spending overview" on={weeklySummary} onToggle={() => setWeeklySummary(!weeklySummary)} />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );

      case 'appearance':
        return (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-2" style={headingFont}>Appearance Settings</h3>
              <p className="text-sm mb-5" style={{ color: '#A1A1A1', ...monoFont }}>Customize your interface</p>
              <ToggleRow icon={Palette} iconColor={TEAL} label="Dark Mode" description="Use dark theme across the app" on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
              <ToggleRow icon={Monitor} iconColor="#60A5FA" label="Compact Mode" description="Reduce spacing for more content" on={compactMode} onToggle={() => setCompactMode(!compactMode)} />
              <ToggleRow icon={Smartphone} iconColor="#34D399" label="Enable Animations" description="Smooth transitions and effects" on={animationsEnabled} onToggle={() => setAnimationsEnabled(!animationsEnabled)} />

              {/* Accent color picker */}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,242,234,0.08)' }}>
                <label className="block text-xs mb-4" style={{ color: '#A1A1A1', ...monoFont }}>Accent Color</label>
                <div className="flex gap-3 flex-wrap">
                  {[TEAL, '#34D399', '#60A5FA', '#A78BFA', '#F87171', '#FBBF24'].map(color => (
                    <button key={color} onClick={() => { }}
                      className="w-12 h-12 rounded-xl transition-all relative overflow-hidden"
                      style={{ backgroundColor: color, boxShadow: color === TEAL ? `0 0 16px ${TEAL}60` : 'none', outline: color === TEAL ? `2px solid rgba(255,255,255,0.5)` : 'none', outlineOffset: '3px' }}
                    >
                      {color === TEAL && <Check className="size-6 text-black m-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Status banner */}
            <div className="p-5 rounded-2xl overflow-hidden relative"
              style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.25)', backdropFilter: 'blur(20px)' }}>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
                  <Shield className="size-6" style={{ color: '#34D399' }} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: '#34D399', ...headingFont }}>Account Secure</div>
                  <div className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>Your account security is strong</div>
                </div>
              </div>
            </div>

            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-4" style={headingFont}>Security Options</h3>
              <div className="space-y-3">
                <motion.button className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}
                  whileHover={{ borderColor: `rgba(0,242,234,0.3)`, x: 2 }}>
                  <div className="flex items-center gap-3">
                    <Lock className="size-5" style={{ color: '#A1A1A1' }} />
                    <div className="text-left">
                      <div className="font-semibold text-white text-sm" style={headingFont}>Change Password</div>
                      <div className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}>Update your password</div>
                    </div>
                  </div>
                  <ChevronRight className="size-4" style={{ color: '#A1A1A1' }} />
                </motion.button>

                <div className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}>
                  <div className="flex items-center gap-3">
                    <Shield className="size-5" style={{ color: '#A1A1A1' }} />
                    <div>
                      <div className="font-semibold text-white text-sm" style={headingFont}>Two-Factor Authentication</div>
                      <div className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}>Add extra security layer</div>
                    </div>
                  </div>
                  <Toggle on={twoFactorEnabled} onToggle={() => setTwoFactorEnabled(!twoFactorEnabled)} />
                </div>
              </div>
            </GlassCard>

            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-4" style={headingFont}>Active Sessions</h3>
              <div className="space-y-3">
                {activeSessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3">
                      {s.device.includes('Windows') ? <Monitor className="size-5" style={{ color: '#A1A1A1' }} /> : <Smartphone className="size-5" style={{ color: '#A1A1A1' }} />}
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2" style={{ color: '#fff', ...headingFont }}>
                          {s.device}
                          {s.current && <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)', ...monoFont }}>Current</span>}
                        </div>
                        <div className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}>{s.location} · {s.lastActive}</div>
                      </div>
                    </div>
                    {!s.current && (
                      <button className="text-sm font-semibold transition-colors"
                        style={{ color: '#F87171', ...monoFont }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#FCA5A5')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#F87171')}
                      >Revoke</button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <NeonButton variant="danger"><LogOut className="size-4" /> Logout from All Devices</NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        );

      case 'data':
        return (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-2" style={headingFont}>Export Data</h3>
              <p className="text-sm mb-5" style={{ color: '#A1A1A1', ...monoFont }}>Download your financial data in various formats</p>
              <div className="grid grid-cols-2 gap-3">
                <NeonButton><Download className="size-4" /> Export as CSV</NeonButton>
                <NeonButton variant="ghost"><Download className="size-4" /> Export as PDF</NeonButton>
              </div>
            </GlassCard>

            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-2" style={headingFont}>Import Data</h3>
              <p className="text-sm mb-5" style={{ color: '#A1A1A1', ...monoFont }}>Import financial data from external sources</p>
              <NeonButton variant="ghost"><FileUp className="size-4" /> Import CSV File</NeonButton>
            </GlassCard>

            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-2" style={headingFont}>Backup & Restore</h3>
              <p className="text-sm mb-5" style={{ color: '#A1A1A1', ...monoFont }}>Create a backup or restore from previous backup</p>
              <div className="grid grid-cols-2 gap-3">
                <NeonButton><Database className="size-4" /> Create Backup</NeonButton>
                <NeonButton variant="ghost"><Upload className="size-4" /> Restore Backup</NeonButton>
              </div>
            </GlassCard>

            <div className="p-6 rounded-2xl relative overflow-hidden"
              style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.22)', backdropFilter: 'blur(20px)' }}>
              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="size-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: '#F87171', ...headingFont }}>Danger Zone</h3>
                    <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>These actions cannot be undone</p>
                  </div>
                </div>
                <NeonButton variant="danger"><Trash2 className="size-4" /> Reset All Financial Data</NeonButton>
              </div>
            </div>
          </motion.div>
        );

      case 'subscription':
        return (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Plan card */}
            <div className="p-6 rounded-2xl relative overflow-hidden"
              style={{ background: 'rgba(0,242,234,0.05)', border: '1px solid rgba(0,242,234,0.22)', backdropFilter: 'blur(24px)', boxShadow: '0 0 40px rgba(0,242,234,0.06), inset 0 1.5px 0 rgba(0,242,234,0.2)' }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(0,242,234,0.08) 0%, transparent 60%)' }} />
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(0,242,234,0.6), transparent)' }} />
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <div className="text-xs mb-1 uppercase tracking-widest" style={{ color: '#A1A1A1', ...monoFont }}>Current Plan</div>
                  <h3 className="text-3xl font-bold text-white mb-1" style={headingFont}>Pro Plan</h3>
                  <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>Full access to all features</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: TEAL, ...headingFont, textShadow: `0 0 20px rgba(0,242,234,0.4)` }}>₹499</div>
                  <div className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>/month</div>
                </div>
              </div>
              <div className="space-y-2 mb-6 relative z-10">
                {['Unlimited expense tracking', 'Advanced financial calculators', 'AI-powered insights', 'Priority support'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm" style={{ color: '#A1A1A1', ...monoFont }}>
                    <Check className="size-4 shrink-0" style={{ color: TEAL }} /> {f}
                  </div>
                ))}
              </div>
              <NeonButton className="w-full py-3 relative z-10">Upgrade to Premium</NeonButton>
            </div>

            {/* Payment */}
            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-4" style={headingFont}>Payment Method</h3>
              <div className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 rounded flex items-center justify-center"
                    style={{ background: 'rgba(0,242,234,0.1)', border: '1px solid rgba(0,242,234,0.25)' }}>
                    <CreditCard className="size-5" style={{ color: TEAL }} />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm" style={monoFont}>•••• •••• •••• 4242</div>
                    <div className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}>Expires 12/2026</div>
                  </div>
                </div>
                <button className="text-sm font-semibold" style={{ color: TEAL, ...monoFont }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >Edit</button>
              </div>
            </GlassCard>

            {/* Billing history */}
            <GlassCard rounded="apple">
              <h3 className="text-lg font-bold text-white mb-4" style={headingFont}>Billing History</h3>
              <div className="space-y-3">
                {[{ date: 'Feb 1, 2026', amount: '₹499' }, { date: 'Jan 1, 2026', amount: '₹499' }, { date: 'Dec 1, 2025', amount: '₹499' }].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3">
                      <Calendar className="size-5" style={{ color: '#A1A1A1' }} />
                      <div>
                        <div className="font-semibold text-white text-sm" style={headingFont}>{inv.date}</div>
                        <div className="text-xs" style={{ color: '#A1A1A1', ...monoFont }}>{inv.amount}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-xs rounded-full" style={{ background: 'rgba(52,211,153,0.12)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)', ...monoFont }}>Paid</span>
                      <button className="text-sm font-semibold" style={{ color: TEAL, ...monoFont }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                      >Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#000000', ...monoFont }}>
      <StarField count={160} />

      {/* Floating settings icon */}
      <motion.div className="fixed top-8 right-8 w-14 h-14 rounded-2xl flex items-center justify-center z-20"
        style={{
          background: 'rgba(0,242,234,0.08)', border: '1px solid rgba(0,242,234,0.28)',
          backdropFilter: 'blur(16px)', boxShadow: '0 0 24px rgba(0,242,234,0.12)',
        }}
        animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <SettingsIcon className="size-7" style={{ color: TEAL, filter: 'drop-shadow(0 0 7px #00F2EA)' }} />
      </motion.div>

      {/* Header */}
      <div className="relative z-10 px-8 py-5"
        style={{
          background: 'rgba(0,0,0,0.38)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          borderBottom: '1px solid rgba(0,242,234,0.1)',
          boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04)',
        }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button onClick={onBack}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,242,234,0.18)', backdropFilter: 'blur(12px)', color: '#A1A1A1' }}
              whileHover={{ borderColor: TEAL, color: TEAL, boxShadow: '0 0 14px rgba(0,242,234,0.2)' }}
            ><ArrowLeft className="size-5" /></motion.button>
            <Logo />
          </div>
          <motion.button onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#A1A1A1', backdropFilter: 'blur(12px)', ...monoFont }}
            whileHover={{ color: '#F87171', borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.07)' }}
          ><LogOut className="size-4" /> Logout</motion.button>
        </div>
      </div>

      <div className="flex relative z-10">
        {/* ── Sidebar ── */}
        <motion.aside
          className="w-72 min-h-[calc(100vh-69px)] p-6 flex flex-col"
          style={{
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(28px) saturate(200%)',
            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            borderRight: '1px solid rgba(0,242,234,0.1)',
            boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.03)',
          }}
          initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45 }}
        >
          {/* Sidebar sheen */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 35%)' }} />

          <div className="mb-6 relative z-10">
            <h1 className="text-2xl font-bold text-white mb-1" style={headingFont}>Settings</h1>
            <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>Manage your account preferences</p>
          </div>

          <nav className="space-y-1 relative z-10">
            {menuItems.map(({ id, label, icon: Icon }) => {
              const active = activeSection === id;
              return (
                <motion.button key={id} onClick={() => setActiveSection(id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden"
                  style={active ? {
                    background: 'rgba(0,242,234,0.1)',
                    border: '1px solid rgba(0,242,234,0.28)',
                    color: TEAL,
                    boxShadow: '0 0 18px rgba(0,242,234,0.08), inset 0 1px 0 rgba(0,242,234,0.18)',
                    ...monoFont,
                  } : { border: '1px solid transparent', color: '#A1A1A1', ...monoFont }}
                  whileHover={active ? {} : { x: 4, color: '#fff', background: 'rgba(255,255,255,0.04)' }}
                >
                  {active && <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
                    style={{ background: TEAL, boxShadow: `0 0 8px ${TEAL}` }} />}
                  <Icon className="size-5 shrink-0" style={active ? { color: TEAL, filter: `drop-shadow(0 0 4px ${TEAL})` } : {}} />
                  <span className="text-sm font-medium">{label}</span>
                  {active && (
                    <motion.div layoutId="settingsDot" className="ml-auto w-2 h-2 rounded-full"
                      style={{ background: TEAL, boxShadow: `0 0 6px ${TEAL}` }} />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </motion.aside>

        {/* ── Main content ── */}
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-1" style={headingFont}>{sectionTitles[activeSection].title}</h2>
            <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>{sectionTitles[activeSection].sub}</p>
          </motion.div>
          <div className="max-w-2xl">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
