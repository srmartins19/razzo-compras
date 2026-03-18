'use client';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi, rfqsApi, ordersApi } from '@/lib/api';
import { Topbar } from '@/components/layout/topbar';
import { formatCurrency, formatDate, getRfqStatusColor, getOrderStatusColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Users, FileText, ShoppingCart, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ label, value, sub, trend, icon: Icon, color }: {
  label: string; value: string; sub?: string; trend?: 'up' | 'down' | 'neutral';
  icon?: React.ElementType; color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-slate-500'}`}>
              {trend === 'up' && <TrendingUp size={12} />}
              {trend === 'down' && <TrendingDown size={12} />}
              {sub}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color || 'bg-blue-50'}`}>
            <Icon size={20} className="text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ status, getColor }: { status: string; getColor: (s: string) => string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getColor(status)}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function DashboardPage() {
  const { data: kpis }    = useQuery({ queryKey: ['dashboard'], queryFn: () => analyticsApi.dashboard().then(r => r.data) });
  const { data: rfqsData }= useQuery({ queryKey: ['rfqs', 'recent'], queryFn: () => rfqsApi.list({ page: 1, limit: 5, status: 'OPEN' }).then(r => r.data) });
  const { data: ordersData} = useQuery({ queryKey: ['orders', 'pending'], queryFn: () => ordersApi.list({ status: 'PENDING_APPROVAL', limit: 5 }).then(r => r.data) });
  const { data: monthly } = useQuery({ queryKey: ['analytics', 'monthly'], queryFn: () => analyticsApi.monthly(6).then(r => r.data) });

  return (
    <>
      <Topbar title="Dashboard" subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`} />

      <main className="flex-1 p-6 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Savings"
            value={formatCurrency(kpis?.totalSavings || 0)}
            sub={`${kpis?.totalSavingsPct?.toFixed(1) || 0}% vs avg bid`}
            trend="up"
            icon={DollarSign}
            color="bg-green-50"
          />
          <StatCard
            label="Active Suppliers"
            value={String(kpis?.activeSuppliers || 0)}
            sub="Approved & active"
            trend="neutral"
            icon={Users}
            color="bg-blue-50"
          />
          <StatCard
            label="RFQs This Month"
            value={String(kpis?.rfqsThisMonth || 0)}
            sub={`${kpis?.openRfqs || 0} currently open`}
            trend="up"
            icon={FileText}
            color="bg-purple-50"
          />
          <StatCard
            label="Avg Cycle Time"
            value={`${kpis?.avgCycleTimeDays?.toFixed(1) || 0}d`}
            sub="RFQ to PO"
            trend="down"
            icon={Clock}
            color="bg-amber-50"
          />
        </div>

        {/* Alerts */}
        {(kpis?.pendingApprovals || 0) > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>{kpis?.pendingApprovals}</strong> purchase order{kpis?.pendingApprovals !== 1 ? 's' : ''} awaiting your approval.{' '}
              <a href="/orders?status=PENDING_APPROVAL" className="underline font-medium">Review now →</a>
            </p>
          </div>
        )}

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly spend chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Monthly Spend & Savings</h3>
            <p className="text-xs text-slate-500 mb-4">Last 6 months</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthly || []} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v/1000}K`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} labelStyle={{ fontWeight: 600 }} />
                <Bar dataKey="totalSpend"   name="Spend"   fill="#1e3a5f" radius={[3,3,0,0]} />
                <Bar dataKey="totalSavings" name="Savings" fill="#22c55e" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* RFQs trend */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">RFQs Created</h3>
            <p className="text-xs text-slate-500 mb-4">Monthly volume</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthly || []} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip labelStyle={{ fontWeight: 600 }} />
                <Line type="monotone" dataKey="rfqsCreated" name="RFQs" stroke="#2563a8" strokeWidth={2} dot={{ fill: '#2563a8', r: 3 }} />
                <Line type="monotone" dataKey="ordersCreated" name="Orders" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Open RFQs + Pending Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Open RFQs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Open RFQs</h3>
              <a href="/rfqs" className="text-xs text-blue-600 font-medium hover:underline">View all →</a>
            </div>
            <div className="divide-y divide-slate-100">
              {rfqsData?.data?.length === 0 && (
                <p className="text-sm text-slate-500 p-5">No open RFQs</p>
              )}
              {rfqsData?.data?.map((rfq: any) => (
                <a key={rfq.id} href={`/rfqs/${rfq.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{rfq.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{rfq.number} · {rfq.bids?.length || 0} bids · Due {formatDate(rfq.deadline)}</p>
                  </div>
                  <Badge status={rfq.status} getColor={getRfqStatusColor} />
                </a>
              ))}
            </div>
          </div>

          {/* Pending approvals */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Pending Approvals</h3>
              <a href="/orders" className="text-xs text-blue-600 font-medium hover:underline">View all →</a>
            </div>
            <div className="divide-y divide-slate-100">
              {ordersData?.data?.length === 0 && (
                <p className="text-sm text-slate-500 p-5">No pending approvals</p>
              )}
              {ordersData?.data?.map((order: any) => (
                <a key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{order.number}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{order.supplier?.name} · {formatCurrency(order.totalAmount)}</p>
                  </div>
                  <Badge status={order.status} getColor={getOrderStatusColor} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
