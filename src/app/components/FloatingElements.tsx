import { motion } from 'motion/react';

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Coin 1 */}
      <motion.div
        className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          boxShadow: '0 0 40px rgba(234, 179, 8, 0.6)',
        }}
      >
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
          <span className="text-yellow-900 font-bold text-xl">$</span>
        </div>
      </motion.div>

      {/* Floating Coin 2 */}
      <motion.div
        className="absolute top-[60%] right-[15%] w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl"
        animate={{
          y: [0, 40, 0],
          rotate: [0, -360],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          boxShadow: '0 0 30px rgba(234, 179, 8, 0.5)',
        }}
      >
        <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
          <span className="text-yellow-900 font-bold text-sm">$</span>
        </div>
      </motion.div>

      {/* 3D Credit Card */}
      <motion.div
        className="absolute top-[40%] right-[8%] w-64 h-40 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-2xl"
        animate={{
          rotateY: [0, 15, 0],
          rotateX: [0, -10, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: '0 25px 50px rgba(99, 102, 241, 0.4)',
        }}
      >
        <div className="absolute inset-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded"></div>
            <div className="text-white/80 text-xs">PREMIUM</div>
          </div>
          <div className="space-y-2">
            <div className="text-white text-lg tracking-wider">•••• •••• •••• 4242</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-white/60 text-xs">Card Holder</div>
                <div className="text-white text-sm">JOHN DOE</div>
              </div>
              <div className="text-white text-xs">12/28</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Chart Icon */}
      <motion.div
        className="absolute top-[25%] left-[20%] w-32 h-32 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-2xl backdrop-blur-sm border border-white/10"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)',
        }}
      >
        <div className="absolute inset-0 flex items-end justify-around p-4 gap-2">
          <motion.div 
            className="w-4 bg-gradient-to-t from-[#6366F1] to-[#8B5CF6] rounded-t"
            style={{ height: '40%' }}
            animate={{ height: ['40%', '60%', '40%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="w-4 bg-gradient-to-t from-[#6366F1] to-[#8B5CF6] rounded-t"
            style={{ height: '70%' }}
            animate={{ height: ['70%', '50%', '70%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.div 
            className="w-4 bg-gradient-to-t from-[#6366F1] to-[#8B5CF6] rounded-t"
            style={{ height: '55%' }}
            animate={{ height: ['55%', '80%', '55%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
        </div>
      </motion.div>

      {/* Gradient Blobs */}
      <motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6366F1]/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8B5CF6]/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}