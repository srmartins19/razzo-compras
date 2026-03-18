import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Variant = 'primary'|'secondary'|'ghost'|'danger'|'success';
type Size    = 'sm'|'md'|'lg';

const variants: Record<Variant, string> = {
  primary:   'bg-[#1e3a5f] hover:bg-[#163050] text-white',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200',
  ghost:     'bg-transparent hover:bg-slate-100 text-slate-600',
  danger:    'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
  success:   'bg-green-600 hover:bg-green-700 text-white',
};
const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-2.5 text-sm rounded-xl',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  icon?:     React.ReactNode;
}

export function Button({ variant='primary', size='md', loading, icon, children, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className,
      )}
    >
      {loading ? <Loader2 size={14} className="animate-spin"/> : icon}
      {children}
    </button>
  );
}
