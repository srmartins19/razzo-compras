'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineTrendChartProps {
  data:    { month: string; rfqsCreated: number; ordersCreated: number }[];
  height?: number;
}

export function LineTrendChart({ data, height = 240 }: LineTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
          labelStyle={{ fontWeight: 600, color: '#1e293b' }}
        />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }}/>
        <Line type="monotone" dataKey="rfqsCreated"   name="RFQs"   stroke="#2563a8" strokeWidth={2.5} dot={{ r: 3, fill: '#2563a8' }} activeDot={{ r: 5 }}/>
        <Line type="monotone" dataKey="ordersCreated" name="Orders" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3, fill: '#7c3aed' }} activeDot={{ r: 5 }}/>
      </LineChart>
    </ResponsiveContainer>
  );
}
