import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'BRL', locale = 'pt-BR') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatDate(date: string | Date, locale = 'pt-BR') {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
}

export function formatRelative(date: string | Date) {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
}

export function getRfqStatusColor(status: string) {
  const map: Record<string, string> = {
    DRAFT:    'bg-slate-100 text-slate-600',
    OPEN:     'bg-blue-100 text-blue-700',
    ANALYSIS: 'bg-amber-100 text-amber-700',
    CLOSED:   'bg-green-100 text-green-700',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600';
}

export function getOrderStatusColor(status: string) {
  const map: Record<string, string> = {
    DRAFT:            'bg-slate-100 text-slate-600',
    PENDING_APPROVAL: 'bg-amber-100 text-amber-700',
    APPROVED:         'bg-blue-100 text-blue-700',
    SENT:             'bg-purple-100 text-purple-700',
    RECEIVED:         'bg-green-100 text-green-700',
    CANCELLED:        'bg-red-100 text-red-700',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600';
}
