'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface SpendBarChartProps {
  data:    { month: string; totalSpend: number; totalSavings: number }[];
  height?: number;
}

export function SpendBarChart({ data, height = 240 }: SpendBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`}/>
        <Tooltip
          formatter={(v: number, name: string) => [formatCurrency(v), name === 'totalSpend' ? 'Spend' : 'Savings']}
          labelStyle={{ fontWeight: 600, color: '#1e293b' }}
          contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
        />
        <Legend formatter={v => v === 'totalSpend' ? 'Spend' : 'Savings'} iconSize={10} wrapperStyle={{ fontSize: 12 }}/>
        <Bar dataKey="totalSpend"   name="totalSpend"   fill="#1e3a5f" radius={[4,4,0,0]}/>
        <Bar dataKey="totalSavings" name="totalSavings" fill="#22c55e" radius={[4,4,0,0]}/>
      </BarChart>
    </ResponsiveContainer>
  );
}
