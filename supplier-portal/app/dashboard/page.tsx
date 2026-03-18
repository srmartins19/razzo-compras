'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FileText, Clock, CheckCircle, Trophy } from 'lucide-react';
import { PortalHeader } from '@/components/layout/header';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SupplierDashboard() {
  const router = useRouter();
  const [supplier, setSupplier] = useState<any>(null);
  const [rfqs,     setRfqs]     = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const sd = localStorage.getItem('supplier_data');
    if (!sd) { router.push('/auth/login'); return; }
    setSupplier(JSON.parse(sd));
    api.get('/rfqs?status=OPEN&limit=30')
      .then(r => setRfqs(r.data.data || []))
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <PortalHeader />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good day{supplier ? `, ${supplier.name}` : ''}! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here are the RFQs awaiting your response.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Open RFQs',       value: rfqs.length,  icon: FileText,   color: 'text-blue-600',  bg: 'bg-blue-50'  },
            { label: 'Bids Submitted',  value: 0,            icon: CheckCircle,color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Awaiting Response',value: rfqs.length,  icon: Clock,      color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center`}>
                <c.icon size={20} className={c.color}/>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{c.value}</p>
                <p className="text-xs text-slate-500">{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RFQ list */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Open RFQs — Awaiting Your Bid</h2>
            <span className="text-xs text-slate-400">{rfqs.length} available</span>
          </div>
          {loading && <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>}
          {!loading && rfqs.length === 0 && (
            <div className="p-12 text-center">
              <FileText size={32} className="mx-auto text-slate-300 mb-3"/>
              <p className="text-slate-500 text-sm">No open RFQs at this time.</p>
            </div>
          )}
          <div className="divide-y divide-slate-100">
            {rfqs.map((rfq: any) => {
              const deadline   = new Date(rfq.deadline);
              const isUrgent   = (deadline.getTime() - Date.now()) < 48 * 60 * 60 * 1000;
              return (
                <a key={rfq.id} href={`/rfqs/${rfq.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">{rfq.title}</p>
                      {rfq.auctionEnabled && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">⚡ Auction</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-xs text-slate-400">{rfq.number}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400">{rfq.items?.length || 0} items</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className={`text-xs font-medium ${isUrgent ? 'text-red-500' : 'text-slate-500'}`}>
                        {isUrgent ? '⏰ ' : ''}Due {formatDate(rfq.deadline)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">OPEN</span>
                    <span className="text-sm text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">Submit bid →</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
