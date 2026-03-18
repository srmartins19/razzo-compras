'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PortalHeader } from '@/components/layout/header';
import { FileText, Clock, ChevronRight } from 'lucide-react';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATUS_TABS = ['OPEN', 'ANALYSIS', 'CLOSED'];
const STATUS_LABELS: Record<string, string> = { OPEN: 'Open', ANALYSIS: 'Under Review', CLOSED: 'Closed' };

export default function SupplierRfqsPage() {
  const router = useRouter();
  const [rfqs,      setRfqs]      = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('OPEN');
  const [supplier,  setSupplier]  = useState<any>(null);

  useEffect(() => {
    const sd = localStorage.getItem('supplier_data');
    if (!sd) { router.push('/auth/login'); return; }
    setSupplier(JSON.parse(sd));

    Promise.all(STATUS_TABS.map(s => api.get(`/rfqs?status=${s}&limit=50`)))
      .then(([open, analysis, closed]) => {
        setRfqs([
          ...(open.data.data     || []).map((r: any) => ({ ...r, _tab: 'OPEN'     })),
          ...(analysis.data.data || []).map((r: any) => ({ ...r, _tab: 'ANALYSIS' })),
          ...(closed.data.data   || []).map((r: any) => ({ ...r, _tab: 'CLOSED'   })),
        ]);
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = rfqs.filter(r => r._tab === activeTab);
  const counts   = STATUS_TABS.reduce((acc, s) => ({ ...acc, [s]: rfqs.filter(r => r._tab === s).length }), {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-50">
      <PortalHeader />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">RFQs</h1>
          <p className="text-slate-500 text-sm mt-1">All procurement requests you've been invited to bid on.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit shadow-sm">
          {STATUS_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab ? 'bg-[#1e3a5f] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
              {STATUS_LABELS[tab]}
              <span className={`text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {counts[tab] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading && <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>}
          {!loading && filtered.length === 0 && (
            <div className="p-12 text-center">
              <FileText size={32} className="mx-auto text-slate-300 mb-3"/>
              <p className="text-slate-500 text-sm">No {STATUS_LABELS[activeTab].toLowerCase()} RFQs.</p>
            </div>
          )}
          <div className="divide-y divide-slate-100">
            {filtered.map((rfq: any) => {
              const deadline  = new Date(rfq.deadline);
              const isUrgent  = activeTab === 'OPEN' && (deadline.getTime() - Date.now()) < 48*3600*1000;
              const isPast    = deadline < new Date();
              return (
                <a key={rfq.id} href={activeTab === 'OPEN' ? `/rfqs/${rfq.id}` : '#'}
                  className={`flex items-center gap-4 px-5 py-4 group transition-colors ${activeTab === 'OPEN' ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${activeTab === 'OPEN' ? 'bg-blue-100' : activeTab === 'ANALYSIS' ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    <FileText size={16} className={activeTab === 'OPEN' ? 'text-blue-600' : activeTab === 'ANALYSIS' ? 'text-amber-600' : 'text-slate-400'}/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium text-sm text-slate-900 ${activeTab === 'OPEN' ? 'group-hover:text-blue-700' : ''} transition-colors`}>{rfq.title}</p>
                      {rfq.auctionEnabled && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">⚡</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="font-mono text-xs text-slate-400">{rfq.number}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400">{rfq.items?.length || 0} items</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className={`text-xs font-medium flex items-center gap-1 ${isUrgent ? 'text-red-500' : isPast ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Clock size={10}/>
                        {isPast ? `Closed ${formatDate(rfq.deadline)}` : `Due ${formatDate(rfq.deadline)}`}
                      </span>
                    </div>
                  </div>
                  {activeTab === 'OPEN' && (
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"/>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
