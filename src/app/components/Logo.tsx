import { TrendingUp } from 'lucide-react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <TrendingUp
          className="size-8"
          style={{
            color: '#00F2EA',
            filter: 'drop-shadow(0 0 8px rgba(0, 242, 234, 0.7))',
          }}
        />
      </div>
      <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, Geist, SF Pro, sans-serif' }}>
        <span style={{ color: '#00F2EA', textShadow: '0 0 12px rgba(0,242,234,0.5)' }}>
          Fin
        </span>
        <span className="text-white font-light">Max</span>
      </span>
    </div>
  );
}
