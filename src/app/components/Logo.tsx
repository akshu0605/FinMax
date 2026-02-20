import { TrendingUp } from 'lucide-react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <TrendingUp className="size-8 text-transparent bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text" style={{ 
          filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))'
        }} />
      </div>
      <span className="text-2xl font-bold">
        <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
          Fin
        </span>
        <span className="text-white font-light">Max</span>
      </span>
    </div>
  );
}
