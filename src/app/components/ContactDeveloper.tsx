import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  User,
  Send,
  Github,
  Linkedin,
  Twitter,
  Heart,
  ArrowLeft,
  MessageSquare,
  Code,
} from 'lucide-react';
import { Logo } from './Logo';

interface ContactDeveloperProps {
  onBack: () => void;
}

export function ContactDeveloper({ onBack }: ContactDeveloperProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success toast
    setShowSuccess(true);
    
    // Reset form
    setName('');
    setEmail('');
    setMessage('');
    
    // Hide toast after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/akshu0605',
      color: 'from-gray-500 to-gray-700',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://in.linkedin.com/in/akshit-jaswal-7554172b7',
      color: 'from-blue-500 to-blue-700',
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: 'https://x.com/im__akshit',
      color: 'from-sky-500 to-sky-700',
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:replyakshit@gmail.com',
      color: 'from-purple-500 to-purple-700',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#6366F1] rounded-full filter blur-[150px] opacity-10" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8B5CF6] rounded-full filter blur-[150px] opacity-10" />
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Send className="size-4 text-white" />
            </div>
            <span className="font-semibold">Message sent successfully 🎉</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="relative border-b border-white/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group"
            >
              <ArrowLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <Logo />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-8 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Facing issues, bugs, or have suggestions? Let's improve FinMax together 🚀
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Left Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                  <MessageSquare className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Send a Message</h2>
                  <p className="text-white/60 text-sm">I'll get back to you soon</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Your Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    placeholder="Tell me about your experience, report a bug, or suggest a feature..."
                    className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold hover:shadow-lg hover:shadow-[#6366F1]/50 transition-all flex items-center justify-center gap-2"
                >
                  <span>Send Message</span>
                  <span>🚀</span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right Side - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-12 lg:col-span-5 space-y-6"
          >
            {/* Developer Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#6366F1]/50 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                  <Code className="size-8 text-white" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Developer</div>
                  <div className="text-2xl font-bold">Akshit Jaswal</div>
                </div>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              <motion.div
                whileHover={{ y: -4 }}
                className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#6366F1]/30 hover:shadow-lg hover:shadow-[#6366F1]/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                    <Mail className="size-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Email</div>
                    <a
                      href="mailto:replyakshit@gmail.com"
                      className="font-semibold hover:text-[#6366F1] transition-colors"
                    >
                      replyakshit@gmail.com
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#6366F1]/30 hover:shadow-lg hover:shadow-[#6366F1]/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                    <Phone className="size-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Phone</div>
                    <a
                      href="tel:+916230585298"
                      className="font-semibold hover:text-[#6366F1] transition-colors"
                    >
                      +91 6230585298
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#6366F1]/30 hover:shadow-lg hover:shadow-[#6366F1]/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                    <MapPin className="size-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Location</div>
                    <div className="font-semibold">Una, Himachal Pradesh, India</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Connect With Me Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Connect With Me 🌐</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`p-5 rounded-xl bg-gradient-to-br ${link.color} bg-opacity-10 border border-white/10 hover:border-white/30 hover:shadow-lg transition-all group`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <link.icon className="size-6 text-white" />
                  </div>
                  <span className="font-semibold">{link.name}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 flex items-center justify-center gap-2">
            <span>Made with</span>
            <Heart className="size-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <span className="font-semibold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
              Akshit Jaswal
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
