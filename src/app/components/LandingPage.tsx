import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
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
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { FloatingElements } from './FloatingElements';
import { StarField } from './StarField';
import { GlassCard } from './ui/GlassCard';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const CYAN = '#00f2ff';
const EMERALD = '#10b981';
const headingFont: React.CSSProperties = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  letterSpacing: '-0.02em',
};
const bodyFont: React.CSSProperties = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
};
const monoFont: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, "Courier New", monospace',
};

// ─── Glassmorphism helpers (spec-compliant) ──────────────────────────────────
// Outer frame glass (nav, overlays)
const glassFrame = (): React.CSSProperties => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(15px) saturate(180%)',
  WebkitBackdropFilter: 'blur(15px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
});

// Card glass — slightly more presence
const glassCard = (accent = false): React.CSSProperties => ({
  background: accent ? 'rgba(0, 242, 255, 0.04)' : 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(15px) saturate(180%)',
  WebkitBackdropFilter: 'blur(15px) saturate(180%)',
  border: accent
    ? '1px solid rgba(0, 242, 255, 0.15)'
    : '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: accent
    ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 242, 255, 0.08)'
    : '0 8px 32px rgba(0, 0, 0, 0.6)',
});

// ─── Tilt Animation Card Wrapper has been removed; using GlassCard globally.
// ─── Section wrapper with scroll-reveal ──────────────────────────────────────
function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      className={`relative z-10 max-w-[1280px] mx-auto px-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.section>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen text-white overflow-hidden relative"
      style={{ background: '#000000', ...bodyFont }}
    >
      {/* ── Ambient radial glow — very low opacity ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(0, 242, 255, 0.06) 0%, transparent 70%)',
        }}
      />
      {/* ── Subtle noise texture ── */}
      <div
        className="fixed inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' /%3E%3C/svg%3E")',
        }}
      />

      <StarField count={140} />
      <FloatingElements />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ NAVIGATION ━━━━━━━━━━━━━━━━ */}
      <motion.nav
        className="sticky top-0 z-50 w-full"
        style={{
          ...glassFrame(),
          borderRadius: 0,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
        }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0, 242, 255, 0.3) 50%, transparent 100%)',
          }}
        />

        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-10 items-center">
            {['Overview', 'Features', 'Pricing'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm transition-colors duration-200"
                style={{ color: '#a1a1aa', ...bodyFont }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1aa')}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Desktop action buttons */}
          <div className="hidden md:flex gap-3 items-center">
            <button
              onClick={onLogin}
              className="px-5 py-2 rounded-lg text-sm transition-all duration-200"
              style={{ color: '#a1a1aa', background: 'transparent', ...bodyFont }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#a1a1aa';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Login
            </button>
            <motion.button
              onClick={onGetStarted}
              className="px-5 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: CYAN,
                color: '#000000',
                ...headingFont,
                boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: '0 0 32px rgba(0, 242, 255, 0.5)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden px-6 pb-6 flex flex-col gap-4"
            style={{ background: 'rgba(0, 0, 0, 0.96)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {['Overview', 'Features', 'Pricing'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm py-1"
                style={{ color: '#a1a1aa', ...bodyFont }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <button
              onClick={() => { setMobileMenuOpen(false); onLogin(); }}
              className="text-sm text-left py-1"
              style={{ color: '#a1a1aa', ...bodyFont }}
            >
              Login
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onGetStarted(); }}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-center"
              style={{ background: CYAN, color: '#000000', ...headingFont }}
            >
              Get Started
            </button>
          </motion.div>
        )}
      </motion.nav>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━ */}
      <section
        id="overview"
        className="relative z-10 max-w-[1280px] mx-auto px-6"
        style={{ paddingTop: '120px', paddingBottom: '80px' }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Status badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-10"
            style={{ ...glassFrame(), color: CYAN, ...bodyFont }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: CYAN }}
            />
            AI-powered finance, built for India
          </motion.div>

          {/* Primary heading */}
          <h1
            className="font-black mb-8 text-white tracking-tighter"
            style={{
              ...headingFont,
              fontSize: 'clamp(3rem, 10vw, 6.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
            }}
          >
            Your finances,
            <br />
            <span
              style={{
                color: CYAN,
                textShadow: '0 0 40px rgba(0, 242, 255, 0.45)',
              }}
            >
              finally clear.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg mb-12 max-w-[520px] mx-auto"
            style={{ color: '#a1a1aa', lineHeight: 1.7, ...bodyFont }}
          >
            Budget smarter, track every rupee, and get AI-powered insights — all in one clean, focused platform.
          </p>

          {/* CTA buttons */}
          <div className="flex gap-4 justify-center flex-wrap mb-20">
            <motion.button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2"
              style={{
                background: CYAN,
                color: '#000000',
                ...headingFont,
                boxShadow: '0 0 32px rgba(0, 242, 255, 0.35)',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 48px rgba(0, 242, 255, 0.55)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              Get started free
              <ArrowRight className="size-4" />
            </motion.button>
            <motion.button
              onClick={onLogin}
              className="px-8 py-4 rounded-xl text-base font-semibold"
              style={{ ...glassCard(), color: '#ffffff', ...headingFont }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Sign in
            </motion.button>
          </div>
        </motion.div>

        {/* ── Hero Visual — Generated 3D Abstract ── */}
        <motion.div
          className="relative w-full rounded-[40px] overflow-hidden"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 40px 100px rgba(0, 0, 0, 0.9)',
            maxHeight: '600px',
          }}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/hero-city.png"
            alt="Premium finance visualization"
            className="w-full object-cover object-center"
            style={{ height: '600px', display: 'block' }}
          />
          {/* Gradient overlay — blends image into page */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%, rgba(0,0,0,0.9) 100%)',
            }}
          />
          {/* Floating stats overlay */}
          <div className="absolute bottom-8 left-8 right-8 flex gap-6 flex-wrap">
            {[
              { label: 'Active Users', value: '24K+' },
              { label: 'Avg Monthly Savings', value: '₹8,400' },
              { label: 'Transactions Tracked', value: '1.2M+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col"
                style={glassFrame()}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              >
                <div
                  style={{
                    ...glassFrame(),
                    padding: '12px 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: CYAN, ...headingFont, textShadow: '0 0 16px rgba(0, 242, 255, 0.4)' }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs" style={{ color: '#a1a1aa', ...bodyFont }}>
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FEATURES ━━━━━━━━━━━━━━━━━━ */}
      <Section id="features" className="py-32">
        <div className="text-center mb-20">
          <h2 className="font-bold text-white mb-4" style={{ ...headingFont, fontSize: '2.25rem' }}>
            Built for how you actually spend
          </h2>
          <p style={{ color: '#a1a1aa', ...bodyFont, maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            A focused financial toolkit — no clutter, no noise. Just the features that matter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Wallet, title: 'Budget Planner', desc: 'Set spending limits by category and stay on track — automatically updated as you spend.', accent: false },
            { icon: TrendingUp, title: 'Expense Tracking', desc: 'Log every transaction and see where your money actually goes, in real time.', accent: false },
            { icon: Zap, title: 'AI Insights', desc: 'Contextual, data-driven advice based on your spending patterns — not generic tips.', accent: true },
            { icon: PieChart, title: 'Visual Analytics', desc: 'Clean charts that make your financial picture easy to read at a glance.', accent: false },
            { icon: Bell, title: 'Bill Reminders', desc: 'Set reminders for recurring bills and subscriptions. Never miss a due date.', accent: false },
            { icon: Shield, title: 'Secure by Design', desc: 'AES-256 encryption. Your data stays private — always.', accent: false },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlassCard
                rounded="apple"
                className="p-8 h-full relative overflow-hidden group border-white/5 transition-all duration-500"
                active={f.accent}
                interactive={true}
                spacing="lg"
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: f.accent ? 'rgba(0, 242, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: f.accent ? '1px solid rgba(0, 242, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: f.accent ? '0 0 20px rgba(0, 242, 255, 0.15)' : 'none',
                  }}
                >
                  <f.icon className="size-7" style={{ color: f.accent ? CYAN : 'rgba(255,255,255,0.45)' }} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white tracking-tight" style={headingFont}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-50 group-hover:opacity-100 transition-opacity duration-500" style={{ ...bodyFont }}>
                  {f.desc}
                </p>
                {/* Subtle hover indicator */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.accent ? CYAN : 'rgba(255,255,255,0.4)'}, transparent)` }}
                />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ SPLIT KRO PREMIUM ━━━━━━━━━━━━ */}
      <Section className="py-32">
        <GlassCard rounded="apple" className="overflow-hidden" spacing="lg" style={{ boxShadow: '0 60px 120px -20px rgba(0,0,0,0.9)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="p-4 lg:p-12">
              <div className="text-xs font-bold mb-6 tracking-[0.2em] uppercase" style={{ color: CYAN }}>Split Kro</div>
              <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter leading-[0.95]" style={headingFont}>
                Split expenses<br />
                <span className="opacity-40">without the awkwardness.</span>
              </h2>
              <p className="text-lg mb-10 opacity-60 leading-relaxed" style={bodyFont}>
                The smart companion for trips, flatmates, and group dinners. Split Kro handles the numbers so you can focus on the moment.
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Fair splitting', desc: 'Equal or custom splits — works for any group, any scenario.' },
                  { title: 'One-tap settlement', desc: 'Resolve balances instantly. No back-and-forth required.' },
                  { title: 'Real-time sync', desc: 'Everyone in the group sees the same numbers, always.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ background: `${CYAN}20`, border: `1px solid ${CYAN}40` }}>
                      <Check className="size-3" style={{ color: CYAN }} />
                    </div>
                    <div>
                      <div className="font-bold text-white mb-1" style={headingFont}>{item.title}</div>
                      <div className="text-sm opacity-40" style={bodyFont}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-video rounded-[32px] overflow-hidden border border-white/10 group">
              <img
                src="/split-kro.png"
                alt="Split Kro interface"
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8 right-8">
                <GlassCard rounded="apple" spacing="md" className="border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs opacity-50 mb-1 uppercase tracking-widest" style={monoFont}>Goa Trip · 2025</div>
                      <div className="text-xl font-bold" style={headingFont}>You are owed ₹4,200</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-cyan-500/50 flex items-center justify-center animate-spin-slow">
                      <Star className="size-5 text-cyan-500" />
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </GlassCard>
      </Section>



      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ TESTIMONIALS ━━━━━━━━━━━━━━━━ */}
      <Section className="py-32">
        <div className="text-center mb-20">
          <h2 className="font-bold text-white mb-4" style={{ ...headingFont, fontSize: '2.25rem' }}>
            Trusted by thousands
          </h2>
          <p style={{ color: '#a1a1aa', ...bodyFont, maxWidth: '400px', margin: '0 auto', lineHeight: 1.7 }}>
            People building better financial habits with FinMax every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Aditi Sharma', role: 'Freelance Designer', content: 'FinMax changed how I think about money. The AI insights actually make sense for my situation.', rating: 5 },
            { name: 'Sudeh Jaswal', role: 'Software Engineer', content: 'Clean, fast, and genuinely useful. The Split Kro feature alone makes it worth it.', rating: 5 },
            { name: 'Krishu', role: 'Tech Lead', content: 'Saved over ₹2 lakh in 3 months — just by being more aware of where my money was going.', rating: 5 },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlassCard rounded="apple" className="p-8 h-full border-white/5" interactive={true} spacing="lg">
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="size-4 fill-cyan-400 text-cyan-400" />
                  ))}
                </div>
                <p className="text-base leading-relaxed mb-8 opacity-60 italic" style={bodyFont}>
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex-shrink-0" />
                  <div>
                    <div className="text-base font-bold text-white tracking-tight" style={headingFont}>{t.name}</div>
                    <div className="text-xs uppercase tracking-widest opacity-40 font-bold" style={monoFont}>{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ PRICING ━━━━━━━━━━━━━━━━━━ */}
      <Section id="pricing" className="py-32">
        <div className="text-center mb-20">
          <h2 className="font-bold text-white mb-4" style={{ ...headingFont, fontSize: '2.25rem' }}>
            Simple, honest pricing
          </h2>
          <p style={{ color: '#a1a1aa', ...bodyFont, maxWidth: '400px', margin: '0 auto', lineHeight: 1.7 }}>
            Free to start. Upgrade only when you're ready for more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { plan: 'Basic', price: 'Free', features: ['Manual tracking', 'Basic budgets', 'Weekly summaries'], accent: false },
            { plan: 'Pro', price: '₹199/mo', features: ['AI insights', 'Split Kro suite', 'Real-time sync', 'Priority support'], accent: true },
            { plan: 'Elite', price: '₹499/mo', features: ['Family sharing', 'Personal advisor', 'Advanced analytics', 'Early access'], accent: false },
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlassCard
                rounded="apple"
                active={p.accent}
                interactive={true}
                spacing="lg"
                className={`flex flex-col h-full border-white/5 ${p.accent ? 'ring-2 ring-cyan-500/20' : ''}`}
                style={p.accent ? { boxShadow: '0 40px 100px -12px rgba(0,242,255,0.15)' } : {}}
              >
                <div className="mb-8">
                  <div className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: p.accent ? CYAN : 'rgba(255,255,255,0.4)' }}>{p.plan}</div>
                  <div className="text-4xl font-black text-white tracking-tighter" style={headingFont}>{p.price}</div>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check className="size-4" style={{ color: p.accent ? CYAN : 'rgba(255,255,255,0.2)' }} />
                      <span className="text-sm opacity-60" style={bodyFont}>{f}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  onClick={onGetStarted}
                  className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-[0.1em] transition-all"
                  style={{
                    background: p.accent ? CYAN : 'rgba(255,255,255,0.05)',
                    color: p.accent ? '#000' : '#fff',
                    border: p.accent ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    ...headingFont,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get started with {p.plan}
                </motion.button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FINAL CTA ━━━━━━━━━━━━━━━━━━━━ */}
      <Section className="py-48 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Background glow */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[300px] w-[300px] md:h-[600px] md:w-[600px] mx-auto bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />

          <h2 className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none mb-12 relative z-10" style={headingFont}>
            Take control<br />
            <span style={{ color: CYAN, textShadow: '0 0 60px rgba(0, 242, 255, 0.5)' }}>today.</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center relative z-10">
            <motion.button
              onClick={onGetStarted}
              className="px-12 py-6 rounded-full text-xl font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(0,242,255,0.4)]"
              style={{ background: CYAN, color: '#000', ...headingFont }}
              whileHover={{ scale: 1.1, boxShadow: '0 0 80px rgba(0,242,255,0.6)' }}
              whileTap={{ scale: 0.9 }}
            >
              Get started free
            </motion.button>
            <motion.button
              onClick={onLogin}
              className="px-12 py-6 rounded-full text-xl font-black uppercase tracking-[0.2em] border border-white/20"
              style={{ ...glassFrame(), color: '#fff', ...headingFont }}
              whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in
            </motion.button>
          </div>
        </motion.div>
      </Section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="py-20 border-t border-white/5 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo />
            <p className="text-sm opacity-40 max-w-xs text-center md:text-left" style={bodyFont}>
              Smart money management for how India actually earns, spends, and saves.
            </p>
          </div>
          <div className="flex gap-12 text-sm font-bold uppercase tracking-widest" style={monoFont}>
            <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">Terms</a>
            <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">Status</a>
          </div>
          <div className="text-xs opacity-20" style={monoFont}>
            © 2026 FinMax. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}