'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CheckCircle, Clock, XCircle, Trophy, ArrowLeft } from 'lucide-react';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatCurrency(v: number, cur = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: cur }).format(v);
}

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  OPEN:     { label: 'RFQ Open',     icon: Clock,        color: 'text-blue-600 bg-blue-50'   },
  ANALYSIS: { label: 'Under Review', icon: Clock,        color: 'text-amber-600 bg-amber-50' },
  CLOSED:   { label: 'Closed',       icon: CheckCircle,  color: 'text-green-600 bg-green-50' },
};

export default function BidsHistoryPage() {
  const router = useRouter();
  const [bids,    setBids]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supplier,setSupplier]= useState<any>(null);

  useEffect(() => {
    const sd = localStorage.getItem('supplier_data');
    if (!sd) { router.push('/auth/login'); return; }
    setSupplier(JSON.parse(sd));

    // Fetch all RFQs where this supplier has submitted bids
    // We fetch open+analysis+closed RFQs and filter by bid presence
    Promise.all([
      api.get('/rfqs?status=OPEN&limit=50'),
      api.get('/rfqs?status=ANALYSIS&limit=50'),
      api.get('/rfqs?status=CLOSED&limit=50'),
    ])
      .then(([open, analysis, closed]) => {
        const all = [
          ...(open.data.data     || []),
          ...(analysis.data.data || []),
          ...(closed.data.data   || []),
        ];
        // filter those where supplier has a bid
        const withBids = all.filter(rfq =>
          rfq.bids?.some((b: any) => b.supplierId === JSON.parse(sd).id)
        );
        setBids(withBids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0d2040] text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="text-white/60 hover:text-white">
            <ArrowLeft size={20}/>
          </button>
          <div>
            <p className="font-bold text-sm">My Bids</p>
            {supplier && <p className="text-xs text-white/50">{supplier.name}</p>}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Bid History</h2>
            <p className="text-xs text-slate-500 mt-0.5">All RFQs where you have submitted a bid</p>
          </div>

          {loading && <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>}

          {!loading && bids.length === 0 && (
            <div className="p-12 text-center">
              <CheckCircle size={32} className="mx-auto text-slate-300 mb-3"/>
              <p className="text-slate-500 text-sm">No bids submitted yet.</p>
              <a href="/dashboard" className="text-blue-600 text-sm font-medium mt-1 inline-block hover:underline">
                Browse open RFQs →
              </a>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {bids.map((rfq: any) => {
              const myBid = rfq.bids?.find((b: any) => b.supplierId === supplier?.id);
              const isWinner = myBid?.isWinner;
              const stConf = statusConfig[rfq.status] || statusConfig.CLOSED;
              const StatusIcon = stConf.icon;

              return (
                <div key={rfq.id} className={`px-5 py-4 ${isWinner ? 'bg-green-50/40' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-900">{rfq.title}</p>
                        {isWinner && (
                          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                            <Trophy size={10}/> Winner
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400">{rfq.number}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">
                          Bid submitted: {myBid ? formatDate(myBid.submittedAt) : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      {myBid && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{formatCurrency(myBid.totalPrice, myBid.currency)}</p>
                          <p className="text-xs text-slate-400">{myBid.deliveryDays}d delivery</p>
                        </div>
                      )}
                      <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${stConf.color}`}>
                        <StatusIcon size={12}/>
                        {stConf.label}
                      </span>
                      {rfq.status === 'OPEN' && (
                        <a href={`/rfqs/${rfq.id}`}
                          className="text-xs text-blue-600 border border-blue-200 px-2.5 py-1 rounded hover:bg-blue-50 font-medium">
                          Update bid
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
