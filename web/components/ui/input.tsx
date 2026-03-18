import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:   string;
  error?:   string;
  hint?:    string;
  prefix?:  React.ReactNode;
  suffix?:  React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>}
      <div className={cn('flex items-center border rounded-lg overflow-hidden transition-colors', error ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-300' : 'border-slate-300 focus-within:ring-2 focus-within:ring-[#2563a8]/30 focus-within:border-[#2563a8]')}>
        {prefix && <span className="px-3 py-2 text-sm text-slate-500 bg-slate-50 border-r border-slate-200 flex-shrink-0">{prefix}</span>}
        <input ref={ref} {...props} className={cn('flex-1 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400', className)}/>
        {suffix && <span className="px-3 py-2 text-sm text-slate-500 bg-slate-50 border-l border-slate-200 flex-shrink-0">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint  && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
);
Input.displayName = 'Input';
