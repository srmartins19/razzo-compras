'use client';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Trophy } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: kpis }     = useQuery({ queryKey: ['dashboard'], queryFn: () => analyticsApi.dashboard().then(r => r.data) });
  const { data: monthly }  = useQuery({ queryKey: ['monthly-12'], queryFn: () => analyticsApi.monthly(12).then(r => r.data) });
  const { data: ranking }  = useQuery({ queryKey: ['supplier-ranking'], queryFn: () => analyticsApi.ranking().then(r => r.data) });
  const { data: participation } = useQuery({ queryKey: ['participation'], queryFn: () => analyticsApi.getSupplierParticipation?.() ?? Promise.resolve({ data: null }) });

  const radarData = ranking?.slice(0, 1).map((s: any) => [
    { subject: 'Price',    A: s.priceScore    },
    { subject: 'Delivery', A: s.deliveryScore },
    { subject: 'Quality',  A: s.qualityScore  },
    { subject: 'Service',  A: s.serviceScore  },
  ])[0] || [];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar title="Analytics" subtitle="Procurement intelligence & insights" />
        <main className="flex-1 p-6 space-y-6">

          {/* Summary KPIs */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Savings', value: formatCurrency(kpis?.totalSavings || 0), sub: `${kpis?.totalSavingsPct || 0}% savings rate`, color: 'border-t-green-500' },
              { label: 'Active Suppliers', value: kpis?.activeSuppliers || 0, sub: 'Approved & active', color: 'border-t-blue-500' },
              { label: 'Open RFQs', value: kpis?.openRfqs || 0, sub: 'Awaiting bids', color: 'border-t-purple-500' },
              { label: 'Avg Cycle Time', value: `${kpis?.avgCycleTimeDays?.toFixed(1) || 0} days`, sub: 'RFQ → PO', color: 'border-t-amber-500' },
            ].map(card => (
              <div key={card.label} className={`bg-white rounded-xl border border-slate-200 border-t-4 ${card.color} p-5 shadow-sm`}>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-1">Spend vs Savings — 12 months</h3>
              <p className="text-xs text-slate-500 mb-4">Monthly procurement spend and realized savings</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthly || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }}/>
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `${v/1000}K`}/>
                  <Tooltip formatter={(v: number) => formatCurrency(v)}/>
                  <Bar dataKey="totalSpend"   name="Spend"   fill="#1e3a5f" radius={[3,3,0,0]}/>
                  <Bar dataKey="totalSavings" name="Savings" fill="#22c55e" radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-1">RFQ Volume Trend</h3>
              <p className="text-xs text-slate-500 mb-4">RFQs created and orders generated per month</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthly || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }}/>
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }}/>
                  <Tooltip/>
                  <Line type="monotone" dataKey="rfqsCreated"   name="RFQs"   stroke="#2563a8" strokeWidth={2} dot={{ r: 3 }}/>
                  <Line type="monotone" dataKey="ordersCreated" name="Orders" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Supplier ranking */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
              <Trophy size={16} className="text-amber-500"/> Supplier Performance Ranking
            </h3>
            <p className="text-xs text-slate-500 mb-4">Score = 0.4 × Price + 0.3 × Delivery + 0.2 × Quality + 0.1 × Service</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Rank','Supplier','Overall','Price','Delivery','Quality','Service','Orders'].map(h => (
                      <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ranking?.map((s: any) => (
                    <tr key={s.supplierId} className="hover:bg-slate-50">
                      <td className="px-3 py-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.ranking===1?'bg-yellow-400 text-yellow-900':s.ranking===2?'bg-slate-300 text-slate-700':s.ranking===3?'bg-amber-600 text-white':'bg-slate-100 text-slate-500'}`}>{s.ranking}</span>
                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-slate-900">{s.supplierName}</td>
                      {[s.overallScore, s.priceScore, s.deliveryScore, s.qualityScore, s.serviceScore].map((v, i) => (
                        <td key={i} className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#1e3a5f] rounded-full" style={{ width: `${(v/10)*100}%` }}/>
                            </div>
                            <span className="text-xs font-semibold text-slate-700">{v.toFixed(1)}</span>
                          </div>
                        </td>
                      ))}
                      <td className="px-3 py-3 text-sm text-slate-600">{s.totalOrders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
