import { motion } from 'motion/react';

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated teal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00F2EA, transparent)', opacity: 0.3 }}
        animate={{ top: ['10%', '90%', '10%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating Coin 1 - teal */}
      <motion.div
        className="absolute top-20 left-[10%] w-16 h-16 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #00F2EA, #00b8b3)',
          boxShadow: '0 0 40px rgba(0, 242, 234, 0.5)',
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(0,242,234,0.3), rgba(0,184,179,0.3))' }}
        >
          <span className="font-bold text-xl" style={{ color: '#000', fontFamily: 'JetBrains Mono, monospace' }}>$</span>
        </div>
      </motion.div>

      {/* Floating Coin 2 - smaller teal */}
      <motion.div
        className="absolute top-[60%] right-[15%] w-12 h-12 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #00F2EA, #00b8b3)',
          boxShadow: '0 0 30px rgba(0, 242, 234, 0.4)',
        }}
        animate={{ y: [0, 40, 0], rotate: [0, -360], scale: [1, 0.9, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="absolute inset-1.5 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,242,234,0.2)' }}
        >
          <span className="font-bold text-sm" style={{ color: '#000', fontFamily: 'JetBrains Mono, monospace' }}>$</span>
        </div>
      </motion.div>

      {/* 3D Credit Card - teal */}
      <motion.div
        className="absolute top-[40%] right-[8%] w-64 h-40 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #001a1a, #003333)',
          border: '1px solid #00F2EA',
          boxShadow: '0 25px 50px rgba(0, 242, 234, 0.2)',
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: [0, 15, 0], rotateX: [0, -10, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-10 rounded" style={{ background: 'linear-gradient(135deg, #00F2EA, #00b8b3)' }} />
            <div className="text-xs" style={{ color: '#00F2EA', fontFamily: 'JetBrains Mono, monospace' }}>PREMIUM</div>
          </div>
          <div className="space-y-2">
            <div className="text-lg tracking-wider" style={{ color: '#00F2EA', fontFamily: 'JetBrains Mono, monospace' }}>•••• •••• •••• 4242</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs" style={{ color: 'rgba(0,242,234,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>Card Holder</div>
                <div className="text-sm text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>JOHN DOE</div>
              </div>
              <div className="text-xs text-white/60" style={{ fontFamily: 'JetBrains Mono, monospace' }}>12/28</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Chart - teal bars */}
      <motion.div
        className="absolute top-[25%] left-[20%] w-32 h-32 rounded-2xl"
        style={{
          background: 'rgba(0, 242, 234, 0.05)',
          border: '1px solid rgba(0, 242, 234, 0.15)',
          boxShadow: '0 10px 40px rgba(0, 242, 234, 0.2)',
        }}
        animate={{ y: [0, -25, 0], rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 flex items-end justify-around p-4 gap-2">
          <motion.div
            className="w-4 rounded-t"
            style={{ height: '40%', background: 'linear-gradient(to top, #00F2EA, rgba(0,242,234,0.3))' }}
            animate={{ height: ['40%', '60%', '40%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-4 rounded-t"
            style={{ height: '70%', background: 'linear-gradient(to top, #00F2EA, rgba(0,242,234,0.3))' }}
            animate={{ height: ['70%', '50%', '70%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.div
            className="w-4 rounded-t"
            style={{ height: '55%', background: 'linear-gradient(to top, #00F2EA, rgba(0,242,234,0.3))' }}
            animate={{ height: ['55%', '80%', '55%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
        </div>
      </motion.div>

      {/* Radial glow blob - hero area */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,242,234,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Corner glows */}
      <motion.div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full"
        style={{ background: 'rgba(0,242,234,0.07)', filter: 'blur(100px)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
        style={{ background: 'rgba(0,242,234,0.05)', filter: 'blur(120px)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  );
}