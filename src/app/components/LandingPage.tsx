import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Logo } from './Logo';
import { FloatingElements } from './FloatingElements';
import { StarField } from './StarField';
import {
  Wallet,
  TrendingUp,
  PieChart,
  Bell,
  Shield,
  Zap,
  Check,
  Star,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

// ─── Design tokens ────────────────────────────────────────────────
const TEAL = '#00F2EA';
const TEAL_GLOW = '0 0 20px rgba(0,242,234,0.4)';
const headingFont = { fontFamily: 'Inter, Geist, SF Pro, sans-serif' };
const monoFont = { fontFamily: 'JetBrains Mono, "Courier New", monospace' };

// ─── Liquid Glass style helper ─────────────────────────────────────
const glass = (tintStrength = 0.05, blurPx = 24): React.CSSProperties => ({
  background: `rgba(255,255,255,${tintStrength})`,
  backdropFilter: `blur(${blurPx}px) saturate(200%) brightness(1.08)`,
  WebkitBackdropFilter: `blur(${blurPx}px) saturate(200%) brightness(1.08)`,
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow:
    '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.15)',
});

const glassCard = (teal = false): React.CSSProperties => ({
  background: teal
    ? 'rgba(0,242,234,0.05)'
    : 'rgba(255,255,255,0.045)',
  backdropFilter: 'blur(28px) saturate(220%) brightness(1.06)',
  WebkitBackdropFilter: 'blur(28px) saturate(220%) brightness(1.06)',
  border: teal
    ? '1px solid rgba(0,242,234,0.18)'
    : '1px solid rgba(255,255,255,0.09)',
  boxShadow:
    '0 12px 40px rgba(0,0,0,0.6), inset 0 1.5px 0 rgba(255,255,255,0.13), inset 0 -1px 0 rgba(0,0,0,0.18)',
});

// ─── 3D tilt card ─────────────────────────────────────────────────
function TiltCard({ children, className = '', style = {}, teal = false }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; teal?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...glassCard(teal),
        ...style,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        rotateX: rotX,
        rotateY: rotY,
        willChange: 'transform',
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.03, z: 30 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Glass reflection sheen */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%, rgba(0,242,234,0.04) 100%)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen text-white overflow-hidden relative"
      style={{ background: '#000000', ...monoFont, perspective: 1200 }}
    >
      {/* Radial hero glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(0,242,234,0.09) 0%, transparent 70%)',
        }}
      />
      {/* Noise */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' /%3E%3C/svg%3E")',
        }}
      />

      <StarField count={180} />
      <FloatingElements />

      {/* ─── NAVIGATION — liquid glass ─── */}
      <motion.nav
        className="sticky top-0 z-50 w-full"
        style={{
          ...glass(0.04, 20),
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: '1px solid rgba(0,242,234,0.12)',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,242,234,0.4), transparent)' }} />

        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />
          <div className="hidden md:flex gap-10 items-center">
            {['Overview', 'Features', 'Pricing'].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`}
                className="text-sm transition-colors duration-200"
                style={{ color: '#A1A1A1', ...monoFont }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A1A1A1')}
              >{link}</a>
            ))}
          </div>
          <div className="hidden md:flex gap-3 items-center">
            <button onClick={onLogin}
              className="px-5 py-2 rounded-lg text-sm transition-all duration-200"
              style={{ color: '#A1A1A1', ...monoFont, background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#A1A1A1'; e.currentTarget.style.background = 'transparent'; }}
            >Login</button>
            <motion.button onClick={onGetStarted}
              className="px-5 py-2 rounded-lg text-sm font-semibold"
              style={{ background: TEAL, color: '#000', ...headingFont, boxShadow: '0 0 20px rgba(0,242,234,0.35), inset 0 1px 0 rgba(255,255,255,0.3)' }}
              whileHover={{ scale: 1.06, boxShadow: '0 0 35px rgba(0,242,234,0.6), inset 0 1px 0 rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.97 }}
            >Get Started</motion.button>
          </div>
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div className="md:hidden px-6 pb-4 flex flex-col gap-4"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          >
            {['Overview', 'Features', 'Pricing'].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm"
                style={{ color: '#A1A1A1', ...monoFont }} onClick={() => setMobileMenuOpen(false)}>{link}</a>
            ))}
            <button onClick={() => { setMobileMenuOpen(false); onLogin(); }} className="text-sm text-left" style={{ color: '#A1A1A1', ...monoFont }}>Login</button>
            <button onClick={() => { setMobileMenuOpen(false); onGetStarted(); }}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-left"
              style={{ background: TEAL, color: '#000', ...headingFont }}>Get Started</button>
          </motion.div>
        )}
      </motion.nav>

      {/* ─── HERO ─── */}
      <section id="overview" className="relative z-10 max-w-[1280px] mx-auto px-6 py-[120px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8"
            style={{ ...glass(0.06, 16), color: TEAL, ...monoFont }}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
            AI-Powered Finance Platform
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight text-white" style={headingFont}>
            Take Control of Your
            <br />
            <span style={{
              color: TEAL,
              textShadow: '0 0 40px rgba(0,242,234,0.5), 0 0 80px rgba(0,242,234,0.2)',
              WebkitTextStroke: '0.5px rgba(0,242,234,0.3)',
            }}>
              Money with FinMax
            </span>
          </h1>
          <p className="text-xl mb-12 max-w-[600px] mx-auto" style={{ color: '#A1A1A1', ...monoFont }}>
            Smart AI-powered budgeting and expense tracking platform.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <motion.button onClick={onGetStarted}
              className="px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2"
              style={{
                background: TEAL, color: '#000', ...headingFont,
                boxShadow: '0 0 40px rgba(0,242,234,0.4), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.35)',
              }}
              whileHover={{ scale: 1.07, boxShadow: '0 0 60px rgba(0,242,234,0.65), 0 25px 70px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.35)' }}
              whileTap={{ scale: 0.96 }}
            >
              Get Started <ArrowRight className="size-5" />
            </motion.button>
            <motion.button onClick={onLogin}
              className="px-8 py-4 rounded-xl text-lg font-semibold"
              style={{ ...glass(0.05, 18), color: TEAL, ...headingFont }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(0,242,234,0.2), 0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.97 }}
            >
              Login
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ─── FEATURES — 3D tilt glass cards ─── */}
      <section id="features" className="relative z-10 max-w-[1280px] mx-auto px-6 py-[80px]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl font-bold text-center mb-4 text-white" style={headingFont}>Powerful Features</h2>
          <p className="text-center mb-16 max-w-[600px] mx-auto" style={{ color: '#A1A1A1', ...monoFont }}>
            Everything you need to manage your finances in one place
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: 1200 }}>
            {[
              { icon: Wallet, title: 'Smart Budget Planner', desc: 'Set intelligent budgets based on your income and spending patterns.' },
              { icon: TrendingUp, title: 'Real-time Expense Tracking', desc: 'Track every expense automatically and see where your money goes.' },
              { icon: Zap, title: 'AI Spending Insights', desc: 'Get personalized insights powered by advanced AI algorithms.' },
              { icon: PieChart, title: 'Animated Pie Chart Analytics', desc: 'Visualize your spending with beautiful, interactive charts.' },
              { icon: Bell, title: 'Financial Reminders', desc: 'Never miss a bill or payment with smart notifications.' },
              { icon: Shield, title: 'Bank-Level Security', desc: 'Your financial data is protected with enterprise-grade encryption.' },
            ].map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <TiltCard className="p-8 rounded-2xl h-full relative overflow-hidden group">
                  {/* Teal corner glow on hover */}
                  <motion.div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                    style={{ background: 'rgba(0,242,234,0)', filter: 'blur(30px)' }}
                    whileHover={{ background: 'rgba(0,242,234,0.12)' }}
                  />
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: 'rgba(0,242,234,0.10)',
                      border: '1px solid rgba(0,242,234,0.25)',
                      boxShadow: '0 4px 20px rgba(0,242,234,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}>
                    <f.icon className="size-7" style={{ color: TEAL, filter: 'drop-shadow(0 0 8px rgba(0,242,234,0.8))' }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white" style={headingFont}>{f.title}</h3>
                  <p style={{ color: '#A1A1A1', ...monoFont }}>{f.desc}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 py-[80px]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl font-bold text-center mb-4 text-white" style={headingFont}>How It Works</h2>
          <p className="text-center mb-16 max-w-[600px] mx-auto" style={{ color: '#A1A1A1', ...monoFont }}>Get started in three simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" style={{ perspective: 1200 }}>
            {[
              { step: '01', title: 'Enter your salary', desc: 'Start by adding your monthly income to set up your budget baseline.' },
              { step: '02', title: 'Track your spending', desc: 'Add expenses as they happen or connect your accounts for automatic tracking.' },
              { step: '03', title: 'Analyze & grow', desc: 'Review insights, adjust budgets, and watch your savings grow over time.' },
            ].map((item, i) => (
              <motion.div key={i}
                className="text-center p-8 rounded-2xl relative"
                style={glassCard(true)}
                initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.2 }}
                whileHover={{ scale: 1.04, translateY: -8 }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,242,234,0.04) 50%, transparent 100%)' }} />
                <motion.div className="text-7xl font-bold mb-6 block relative"
                  style={{ color: TEAL, ...headingFont }}
                  animate={{ textShadow: ['0 0 20px rgba(0,242,234,0.3)', '0 0 50px rgba(0,242,234,0.7)', '0 0 20px rgba(0,242,234,0.3)'] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >{item.step}</motion.div>
                <h3 className="text-2xl font-semibold mb-4 text-white" style={headingFont}>{item.title}</h3>
                <p style={{ color: '#A1A1A1', ...monoFont }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 py-[80px]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl font-bold text-center mb-4 text-white" style={headingFont}>Trusted by Thousands</h2>
          <p className="text-center mb-16 max-w-[600px] mx-auto" style={{ color: '#A1A1A1', ...monoFont }}>See what our users have to say about FinMax</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: 1200 }}>
            {[
              { name: 'Sarah Johnson', role: 'Freelance Designer', content: 'FinMax transformed how I manage my finances. The AI insights are incredibly accurate!', rating: 5 },
              { name: 'Michael Chen', role: 'Software Engineer', content: "Best budgeting app I've ever used. Clean interface, powerful features, and great analytics.", rating: 5 },
              { name: 'Emily Rodriguez', role: 'Marketing Manager', content: "Finally, a finance app that makes sense! I've saved over $2,000 in just 3 months.", rating: 5 },
            ].map((t, i) => (
              <TiltCard key={i} className="p-8 rounded-2xl relative">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="size-5 fill-yellow-400 text-yellow-400" style={{ filter: 'drop-shadow(0 0 5px rgba(234,179,8,0.6))' }} />
                  ))}
                </div>
                <p className="mb-6 text-white/80" style={monoFont}>{t.content}</p>
                <div>
                  <div className="font-semibold text-white" style={headingFont}>{t.name}</div>
                  <div className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>{t.role}</div>
                </div>
              </TiltCard>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="relative z-10 max-w-[1280px] mx-auto px-6 py-[80px]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl font-bold text-center mb-4 text-white" style={headingFont}>Simple Pricing</h2>
          <p className="text-center mb-16 max-w-[600px] mx-auto" style={{ color: '#A1A1A1', ...monoFont }}>Choose the plan that works for you</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" style={{ perspective: 1200 }}>
            {[
              { name: 'Basic', price: 'Free', badge: null, features: ['Budget tracking', 'Up to 50 transactions/mo', 'Basic analytics', 'Email support'] },
              { name: 'Pro', price: '$9/mo', badge: 'Most Popular', features: ['Unlimited transactions', 'AI spending insights', 'Advanced analytics', 'Priority support', 'Reminders'] },
              { name: 'Enterprise', price: 'Custom', badge: null, features: ['Everything in Pro', 'Multi-user access', 'Custom integrations', 'Dedicated support', 'SLA guarantee'] },
            ].map((plan, i) => {
              const isPro = plan.badge === 'Most Popular';
              return (
                <motion.div key={i}
                  className="relative p-8 rounded-2xl flex flex-col"
                  style={{
                    ...(isPro ? {
                      background: 'rgba(0,242,234,0.07)',
                      backdropFilter: 'blur(32px) saturate(220%)',
                      WebkitBackdropFilter: 'blur(32px) saturate(220%)',
                      border: '1px solid rgba(0,242,234,0.3)',
                      boxShadow: '0 0 40px rgba(0,242,234,0.15), 0 20px 60px rgba(0,0,0,0.6), inset 0 1.5px 0 rgba(0,242,234,0.25)',
                    } : glassCard()),
                  }}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, translateY: -8 }}
                >
                  {/* Glass sheen */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 60%)' }} />
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                      style={{ background: TEAL, color: '#000', ...headingFont, boxShadow: '0 0 15px rgba(0,242,234,0.5)' }}>
                      {plan.badge}
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 text-white relative" style={headingFont}>{plan.name}</h3>
                  <div className="text-4xl font-bold mb-8 relative" style={{ color: isPro ? TEAL : '#fff', ...headingFont, textShadow: isPro ? TEAL_GLOW : 'none' }}>{plan.price}</div>
                  <ul className="space-y-3 flex-1 mb-8 relative">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <Check className="size-4 shrink-0" style={{ color: TEAL, filter: 'drop-shadow(0 0 5px #00F2EA)' }} />
                        <span style={{ color: '#A1A1A1', ...monoFont }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button onClick={onGetStarted}
                    className="w-full py-3 rounded-xl font-semibold relative"
                    style={isPro
                      ? { background: TEAL, color: '#000', ...headingFont, boxShadow: '0 0 25px rgba(0,242,234,0.4), inset 0 1px 0 rgba(255,255,255,0.3)' }
                      : { ...glass(0.05, 16), color: TEAL, ...headingFont }
                    }
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  >Get Started</motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 py-[80px] mb-20">
        <motion.div
          className="relative overflow-hidden rounded-3xl p-16 text-center"
          style={{
            background: 'rgba(0,242,234,0.06)',
            backdropFilter: 'blur(40px) saturate(220%)',
            WebkitBackdropFilter: 'blur(40px) saturate(220%)',
            border: '1px solid rgba(0,242,234,0.22)',
            boxShadow: '0 0 80px rgba(0,242,234,0.1), 0 30px 80px rgba(0,0,0,0.7), inset 0 1.5px 0 rgba(0,242,234,0.3)',
          }}
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,242,234,0.04) 50%, transparent 100%)' }} />
          <motion.div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,242,234,0.07), transparent)' }}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
          <div className="relative z-10">
            <h2 className="text-5xl font-bold mb-6 text-white" style={headingFont}>
              Start Managing Your{' '}
              <span style={{ color: TEAL, textShadow: '0 0 30px rgba(0,242,234,0.6)' }}>Money Now</span>
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#A1A1A1', ...monoFont }}>
              Join thousands of smart users who have taken control of their financial future.
            </p>
            <motion.button onClick={onGetStarted}
              className="px-10 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 mx-auto"
              style={{ background: TEAL, color: '#000', ...headingFont, boxShadow: '0 0 40px rgba(0,242,234,0.5), inset 0 1px 0 rgba(255,255,255,0.35)' }}
              whileHover={{ scale: 1.07, boxShadow: '0 0 60px rgba(0,242,234,0.75), inset 0 1px 0 rgba(255,255,255,0.35)' }}
              whileTap={{ scale: 0.96 }}
            >
              Get Started Free <Check className="size-5" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 py-12" style={{ borderTop: '1px solid rgba(0,242,234,0.1)' }}>
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo />
          <p className="text-sm" style={{ color: '#A1A1A1', ...monoFont }}>© 2026 FinMax. All rights reserved.</p>
          <div className="flex gap-8 text-sm">
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <a key={link} href="#" style={{ color: '#A1A1A1', ...monoFont }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A1A1A1')}
                className="transition-colors duration-200">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}