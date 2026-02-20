import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
  initialMode?: 'signin' | 'signup';
}

const TEAL = '#00F2EA';
const monoFont = { fontFamily: 'JetBrains Mono, "Courier New", monospace' };
const headingFont = { fontFamily: 'Inter, Geist, SF Pro, sans-serif' };

export function AuthModal({ isOpen, onClose, onLogin, onSignup, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match!');
          setLoading(false);
          return;
        }
        onSignup(formData.email, formData.password, formData.fullName);
      } else {
        onLogin(formData.email, formData.password);
      }
    } catch (error: any) {
      alert(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  const inputClass =
    'peer w-full px-4 py-3 rounded-xl text-white placeholder-transparent focus:outline-none transition-all';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="relative w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {/* Glow halos */}
          <motion.div
            className="absolute -top-6 -left-6 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: 'rgba(0,242,234,0.15)', filter: 'blur(30px)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: 'rgba(0,242,234,0.1)', filter: 'blur(40px)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />

          {/* Card — Liquid Glass */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(0,0,0,0.52)',
              backdropFilter: 'blur(36px) saturate(220%) brightness(1.08)',
              WebkitBackdropFilter: 'blur(36px) saturate(220%) brightness(1.08)',
              border: '1px solid rgba(0,242,234,0.22)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.85), 0 0 50px rgba(0,242,234,0.07), inset 0 1.5px 0 rgba(0,242,234,0.22), inset 0 -1px 0 rgba(0,0,0,0.3)',
            }}
          >
            {/* Glass sheen */}
            <div className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(0,242,234,0.04) 40%, transparent 70%)' }} />
            {/* Subtle inner glow top */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`, opacity: 0.5 }}
            />

            <div className="relative p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                <X className="size-6" />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-8">
                <Logo />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white text-center mb-2" style={headingFont}>
                {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-center mb-8 text-sm" style={{ color: '#A1A1A1', ...monoFont }}>
                {mode === 'signup'
                  ? 'Start your journey to financial freedom'
                  : 'Sign in to continue to FinMax'}
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      className={inputClass}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(0,242,234,0.18)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
                        ...monoFont,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = TEAL;
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0,242,234,0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0,242,234,0.15)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <label
                      className="absolute left-4 -top-2.5 text-sm px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm"
                      style={{ color: '#A1A1A1', background: 'transparent', ...monoFont }}
                    >
                      Full Name
                    </label>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className={inputClass}
                    style={{
                      background: 'rgba(0,242,234,0.04)',
                      border: '1px solid rgba(0,242,234,0.15)',
                      ...monoFont,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = TEAL;
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0,242,234,0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,242,234,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <label
                    className="absolute left-4 -top-2.5 text-sm px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm"
                    style={{ color: '#A1A1A1', background: 'transparent', ...monoFont }}
                  >
                    Email
                  </label>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className={inputClass + ' pr-12'}
                    style={{
                      background: 'rgba(0,242,234,0.04)',
                      border: '1px solid rgba(0,242,234,0.15)',
                      ...monoFont,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = TEAL;
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0,242,234,0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,242,234,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <label
                    className="absolute left-4 -top-2.5 text-sm px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm"
                    style={{ color: '#A1A1A1', background: 'transparent', ...monoFont }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>

                {mode === 'signup' && (
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      className={inputClass + ' pr-12'}
                      style={{
                        background: 'rgba(0,242,234,0.04)',
                        border: '1px solid rgba(0,242,234,0.15)',
                        ...monoFont,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = TEAL;
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0,242,234,0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0,242,234,0.15)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <label
                      className="absolute left-4 -top-2.5 text-sm px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm"
                      style={{ color: '#A1A1A1', background: 'transparent', ...monoFont }}
                    >
                      Confirm Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                    >
                      {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold transition-all"
                  style={{
                    background: loading ? 'rgba(0,242,234,0.5)' : TEAL,
                    color: '#000',
                    boxShadow: loading ? 'none' : '0 0 24px rgba(0,242,234,0.4), inset 0 1.5px 0 rgba(255,255,255,0.35)',
                    ...headingFont,
                  }}
                  whileHover={!loading ? { scale: 1.03, boxShadow: '0 0 40px rgba(0,242,234,0.65), inset 0 1.5px 0 rgba(255,255,255,0.35)' } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                >
                  {loading ? 'Processing...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                </motion.button>
              </form>

              {/* Toggle */}
              <div className="mt-6 text-center text-sm" style={{ ...monoFont }}>
                <span style={{ color: '#A1A1A1' }}>
                  {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                </span>{' '}
                <button
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                  className="font-semibold transition-colors duration-200"
                  style={{ color: TEAL }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}