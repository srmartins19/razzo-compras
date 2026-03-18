import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label:      string;
  value:      string | number;
  sub?:       string;
  trend?:     'up' | 'down' | 'neutral';
  icon?:      React.ReactNode;
  colorClass?: string;
  topColor?:  string;
}

export function StatCard({ label, value, sub, trend, icon, colorClass = 'bg-blue-50', topColor = 'bg-[#1e3a5f]' }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400';

  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative overflow-hidden')}>
      <div className={cn('absolute top-0 left-0 right-0 h-1', topColor)} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && (
            <p className={cn('text-xs mt-1 flex items-center gap-1', trendColor)}>
              <TrendIcon size={11} />
              {sub}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
