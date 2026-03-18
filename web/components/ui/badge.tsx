import { cn } from '@/lib/utils';

type Variant = 'default'|'success'|'warning'|'danger'|'info'|'purple'|'gray';

const variants: Record<Variant, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-green-100  text-green-700',
  warning: 'bg-amber-100  text-amber-700',
  danger:  'bg-red-100    text-red-700',
  info:    'bg-blue-100   text-blue-700',
  purple:  'bg-purple-100 text-purple-700',
  gray:    'bg-slate-100  text-slate-500',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
}

export function RfqStatusBadge({ status }: { status: string }) {
  const map: Record<string, Variant> = {
    DRAFT: 'gray', OPEN: 'info', ANALYSIS: 'warning', CLOSED: 'success',
  };
  return <Badge variant={map[status] ?? 'gray'}>{status}</Badge>;
}

export function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, Variant> = {
    DRAFT: 'gray', PENDING_APPROVAL: 'warning', APPROVED: 'info',
    SENT: 'purple', RECEIVED: 'success', CANCELLED: 'danger',
  };
  return <Badge variant={map[status] ?? 'gray'}>{status.replace(/_/g, ' ')}</Badge>;
}
