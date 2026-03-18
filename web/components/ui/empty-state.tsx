import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?:       React.ReactNode;
  title:       string;
  description?: string;
  action?:     React.ReactNode;
  className?:  string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}>
      {icon && <div className="text-slate-300 mb-4">{icon}</div>}
      <p className="font-semibold text-slate-700 text-base">{title}</p>
      {description && <p className="text-slate-400 text-sm mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
