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
        
        // Sign up via Supabase
        onSignup(formData.email, formData.password, formData.fullName);
      } else {
        onLogin(formData.email, formData.password);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      alert(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="relative w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Floating decorative elements */}
          <motion.div
            className="absolute -top-4 -left-4 w-24 h-24 bg-[#6366F1]/30 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#8B5CF6]/30 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />

          {/* Card */}
          <div className="relative bg-[#111827]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {/* Content */}
            <div className="relative p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              >
                <X className="size-6" />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-8">
                <Logo />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white text-center mb-2">
                {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-white/60 text-center mb-8">
                {mode === 'signup' 
                  ? 'Start your journey to financial freedom' 
                  : 'Sign in to continue to FinMax'
                }
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
                      className="peer w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-[#6366F1] focus:bg-white/10 transition-all"
                    />
                    <label className="absolute left-4 -top-2.5 text-sm text-white/60 bg-[#111827] px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#6366F1] peer-focus:bg-[#111827] transition-all">
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
                    className="peer w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-[#6366F1] focus:bg-white/10 transition-all"
                  />
                  <label className="absolute left-4 -top-2.5 text-sm text-white/60 bg-[#111827] px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#6366F1] peer-focus:bg-[#111827] transition-all">
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
                    className="peer w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-[#6366F1] focus:bg-white/10 transition-all pr-12"
                  />
                  <label className="absolute left-4 -top-2.5 text-sm text-white/60 bg-[#111827] px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#6366F1] peer-focus:bg-[#111827] transition-all">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
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
                      className="peer w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-[#6366F1] focus:bg-white/10 transition-all pr-12"
                    />
                    <label className="absolute left-4 -top-2.5 text-sm text-white/60 bg-[#111827] px-2 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#6366F1] peer-focus:bg-[#111827] transition-all">
                      Confirm Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold hover:shadow-lg hover:shadow-[#6366F1]/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                </motion.button>
              </form>

              {/* Toggle mode */}
              <div className="mt-6 text-center text-sm">
                <span className="text-white/60">
                  {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                </span>
                {' '}
                <button
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                  className="text-[#6366F1] hover:text-[#8B5CF6] font-semibold transition-colors"
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