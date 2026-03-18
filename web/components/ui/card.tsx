import { cn } from '@/lib/utils';

interface CardProps {
  children:  React.ReactNode;
  className?: string;
  padding?:  boolean;
  hover?:    boolean;
}

export function Card({ children, className, padding = true, hover = false }: CardProps) {
  return (
    <div className={cn(
      'bg-white border border-slate-200 rounded-xl shadow-sm',
      padding && 'p-5',
      hover && 'cursor-pointer transition-colors hover:border-[#2563a8]',
      className,
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('font-semibold text-slate-900 text-sm', className)}>{children}</h3>;
}
