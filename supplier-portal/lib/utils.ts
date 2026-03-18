import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatCurrency(value: number, currency = 'BRL', locale = 'pt-BR') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}
export function formatDate(date: string | Date, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
}
