import { motion } from 'motion/react';
import { Logo } from './Logo';
import { FloatingElements } from './FloatingElements';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Bell, 
  Shield, 
  Zap,
  Check,
  Star,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden relative" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Background gradient mesh */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />
      
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }}
      />

      <FloatingElements />

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 container mx-auto px-6 py-8 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo />
        <div className="flex gap-4">
          <button
            onClick={onLogin}
            className="px-6 py-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            Login
          </button>
          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:shadow-lg hover:shadow-[#6366F1]/50 transition-all duration-300 hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Take Control of Your
            <br />
            <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
              Money with FinMax
            </span>
          </h1>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            Smart AI-powered budgeting and expense tracking platform.
          </p>
          <div className="flex gap-6 justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-lg font-semibold hover:shadow-2xl hover:shadow-[#6366F1]/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Get Started <ArrowRight className="size-5" />
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-lg font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Login
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-white/60 text-center mb-16 max-w-2xl mx-auto">
            Everything you need to manage your finances in one place
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Wallet,
                title: 'Smart Budget Planner',
                description: 'Set intelligent budgets based on your income and spending patterns.',
              },
              {
                icon: TrendingUp,
                title: 'Real-time Expense Tracking',
                description: 'Track every expense automatically and see where your money goes.',
              },
              {
                icon: Zap,
                title: 'AI Spending Insights',
                description: 'Get personalized insights powered by advanced AI algorithms.',
              },
              {
                icon: PieChart,
                title: 'Animated Pie Chart Analytics',
                description: 'Visualize your spending with beautiful, interactive charts.',
              },
              {
                icon: Bell,
                title: 'Financial Reminders',
                description: 'Never miss a bill or payment with smart notifications.',
              },
              {
                icon: Shield,
                title: 'Bank-Level Security',
                description: 'Your financial data is protected with enterprise-grade encryption.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#6366F1]/50 transition-all duration-300">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6366F1]/0 to-[#8B5CF6]/0 group-hover:from-[#6366F1]/10 group-hover:to-[#8B5CF6]/10 transition-all duration-300" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="size-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-white/60">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-white/60 text-center mb-16 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Enter your salary',
                description: 'Start by adding your monthly income to set up your budget baseline.',
              },
              {
                step: '02',
                title: 'Track your spending',
                description: 'Add expenses as they happen or connect your accounts for automatic tracking.',
              },
              {
                step: '03',
                title: 'Analyze & grow',
                description: 'Review insights, adjust budgets, and watch your savings grow over time.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative inline-block mb-6">
                  <motion.div
                    className="text-6xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent"
                    animate={{
                      textShadow: [
                        '0 0 20px rgba(99, 102, 241, 0.3)',
                        '0 0 40px rgba(99, 102, 241, 0.5)',
                        '0 0 20px rgba(99, 102, 241, 0.3)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {item.step}
                  </motion.div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-white/60">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">Trusted by Thousands</h2>
          <p className="text-white/60 text-center mb-16 max-w-2xl mx-auto">
            See what our users have to say about FinMax
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Freelance Designer',
                content: 'FinMax transformed how I manage my finances. The AI insights are incredibly accurate!',
                rating: 5,
              },
              {
                name: 'Michael Chen',
                role: 'Software Engineer',
                content: 'Best budgeting app I\'ve ever used. Clean interface, powerful features, and great analytics.',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Marketing Manager',
                content: 'Finally, a finance app that makes sense! I\'ve saved over $2,000 in just 3 months.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="size-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-white/80 mb-6">{testimonial.content}</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-white/60">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 mb-20">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] p-16 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] opacity-0"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <div className="relative z-10">
            <h2 className="text-5xl font-bold mb-6">
              Start Managing Your Money Now
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of smart users who have taken control of their financial future.
            </p>
            <button
              onClick={onGetStarted}
              className="px-10 py-4 rounded-xl bg-white text-[#6366F1] text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              Get Started Free <Check className="size-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo />
            <p className="text-white/60 text-sm">
              © 2026 FinMax. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}