import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Calculator, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface LoanCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
}

type InterestType = 'simple' | 'compound';
type DurationType = 'months' | 'years';

export function LoanCalculator({ isOpen, onClose, currencySymbol }: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState('100000');
  const [interestRate, setInterestRate] = useState('10');
  const [duration, setDuration] = useState('12');
  const [durationType, setDurationType] = useState<DurationType>('months');
  const [interestType, setInterestType] = useState<InterestType>('compound');
  const [showResults, setShowResults] = useState(false);
  
  const [results, setResults] = useState({
    totalInterest: 0,
    totalAmount: 0,
    monthlyEMI: 0,
    principal: 0,
  });

  // Animated counter hook
  const useCounter = (end: number, duration: number = 1000) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!showResults) return;
      
      let startTime: number;
      let animationFrame: number;
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, showResults]);
    
    return count;
  };

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const time = durationType === 'years' ? parseFloat(duration) : parseFloat(duration) / 12;
    const timeInMonths = durationType === 'months' ? parseFloat(duration) : parseFloat(duration) * 12;

    let totalInterest = 0;
    let totalAmount = 0;
    let monthlyEMI = 0;

    if (interestType === 'simple') {
      // Simple Interest: SI = P * R * T
      totalInterest = principal * rate * time;
      totalAmount = principal + totalInterest;
      monthlyEMI = totalAmount / timeInMonths;
    } else {
      // Compound Interest (Monthly): A = P(1 + r/12)^(12t)
      // EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
      const monthlyRate = rate / 12;
      const numberOfPayments = timeInMonths;
      
      // EMI Formula
      if (monthlyRate === 0) {
        monthlyEMI = principal / numberOfPayments;
      } else {
        monthlyEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      }
      
      totalAmount = monthlyEMI * numberOfPayments;
      totalInterest = totalAmount - principal;
    }

    setResults({
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      monthlyEMI: Math.round(monthlyEMI),
      principal: principal,
    });
    
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setLoanAmount('100000');
    setInterestRate('10');
    setDuration('12');
    setDurationType('months');
    setInterestType('compound');
  };

  const animatedInterest = useCounter(results.totalInterest, 1500);
  const animatedTotal = useCounter(results.totalAmount, 1500);
  const animatedEMI = useCounter(results.monthlyEMI, 1500);

  const chartData = [
    { name: 'Principal Amount', value: results.principal },
    { name: 'Total Interest', value: results.totalInterest },
  ];

  const COLORS = ['#6366F1', '#EC4899'];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          className="relative w-full max-w-5xl my-8"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Floating decorative coins */}
          <motion.div
            className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ boxShadow: '0 0 40px rgba(234, 179, 8, 0.6)' }}
          >
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
              <span className="text-yellow-900 font-bold text-lg">{currencySymbol}</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-8 -left-8 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -360],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            style={{ boxShadow: '0 0 30px rgba(234, 179, 8, 0.5)' }}
          >
            <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
              <span className="text-yellow-900 font-bold text-xs">{currencySymbol}</span>
            </div>
          </motion.div>

          {/* Main Card */}
          <div className="relative bg-[#111827]/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="relative border-b border-white/10 p-6">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              >
                <X className="size-6" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                  <Calculator className="size-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Loan Interest Calculator</h2>
                  <p className="text-white/60 mt-1">Calculate your loan EMI and interest breakdown</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Loan Details</h3>
                  
                  {/* Loan Amount */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Loan Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#6366F1] transition-all"
                        placeholder="100000"
                      />
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Interest Rate (% per annum)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#6366F1] transition-all"
                        placeholder="10"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">%</span>
                    </div>
                  </div>

                  {/* Loan Duration */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Loan Duration</label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#6366F1] transition-all"
                        placeholder="12"
                      />
                      <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                        <button
                          onClick={() => setDurationType('months')}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            durationType === 'months'
                              ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          Months
                        </button>
                        <button
                          onClick={() => setDurationType('years')}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            durationType === 'years'
                              ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          Years
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interest Type Toggle */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Interest Type</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setInterestType('simple')}
                        className={`flex-1 py-3 rounded-xl border transition-all ${
                          interestType === 'simple'
                            ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] border-transparent text-white'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        Simple Interest
                      </button>
                      <button
                        onClick={() => setInterestType('compound')}
                        className={`flex-1 py-3 rounded-xl border transition-all ${
                          interestType === 'compound'
                            ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] border-transparent text-white'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        Compound Interest
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      onClick={calculateLoan}
                      className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold hover:shadow-lg hover:shadow-[#6366F1]/50 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calculator className="size-5" />
                      Calculate
                    </motion.button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Results Section */}
                <div>
                  {!showResults ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <TrendingUp className="size-24 text-[#6366F1]/20 mb-6" />
                      </motion.div>
                      <p className="text-white/40 text-lg">
                        Enter loan details and click Calculate to see results
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-white mb-4">Loan Breakdown</h3>
                      
                      {/* Result Cards */}
                      <div className="space-y-4">
                        <motion.div
                          className="p-5 rounded-xl bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 border border-[#6366F1]/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="text-sm text-white/60 mb-1">Monthly EMI</div>
                          <div className="text-3xl font-bold text-white">
                            {currencySymbol}{animatedEMI.toLocaleString()}
                          </div>
                        </motion.div>

                        <motion.div
                          className="p-5 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="text-sm text-white/60 mb-1">Total Interest Payable</div>
                          <div className="text-3xl font-bold text-white">
                            {currencySymbol}{animatedInterest.toLocaleString()}
                          </div>
                        </motion.div>

                        <motion.div
                          className="p-5 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="text-sm text-white/60 mb-1">Total Amount Payable</div>
                          <div className="text-3xl font-bold text-white">
                            {currencySymbol}{animatedTotal.toLocaleString()}
                          </div>
                        </motion.div>
                      </div>

                      {/* Pie Chart */}
                      <motion.div
                        className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h4 className="text-sm font-semibold text-white/80 mb-3">Principal vs Interest</h4>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={1000}
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#111827', 
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '8px',
                                  color: '#fff'
                                }}
                                formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`}
                              />
                              <Legend 
                                wrapperStyle={{ color: '#fff' }}
                                iconType="circle"
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
