'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Clock, Package, Send, CheckCircle } from 'lucide-react';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface BidItem {
  rfqItemId: string;
  unitPrice: string;
  totalPrice: number;
  notes: string;
}

export default function SupplierRfqDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [rfq,      setRfq]      = useState<any>(null);
  const [supplier, setSupplier] = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,    setError]    = useState('');

  // Bid form state
  const [deliveryDays,  setDeliveryDays]  = useState('');
  const [paymentTerms,  setPaymentTerms]  = useState('');
  const [warranty,      setWarranty]      = useState('');
  const [notes,         setNotes]         = useState('');
  const [bidItems,      setBidItems]      = useState<BidItem[]>([]);

  useEffect(() => {
    const sd = localStorage.getItem('supplier_data');
    if (!sd) { router.push('/auth/login'); return; }
    setSupplier(JSON.parse(sd));

    api.get(`/rfqs/${params.id}`)
      .then(r => {
        const rfqData = r.data;
        setRfq(rfqData);
        // init bid items
        setBidItems(rfqData.items.map((item: any) => ({
          rfqItemId: item.id,
          unitPrice: '',
          totalPrice: 0,
          notes: '',
        })));
      })
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const updateBidItem = (idx: number, field: keyof BidItem, value: string) => {
    setBidItems(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      if (field === 'unitPrice') {
        const qty = rfq.items[idx]?.quantity || 1;
        updated[idx].totalPrice = parseFloat(value || '0') * parseFloat(qty);
      }
      return updated;
    });
  };

  const totalBidPrice = bidItems.reduce((sum, bi) => sum + (bi.totalPrice || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDays) { setError('Delivery days is required'); return; }
    if (bidItems.some(bi => !bi.unitPrice || parseFloat(bi.unitPrice) <= 0)) {
      setError('Please fill in unit prices for all items'); return;
    }
    setError(''); setSubmitting(true);
    try {
      await api.post(`/rfqs/${params.id}/bids`, {
        deliveryDays: parseInt(deliveryDays),
        paymentTerms: paymentTerms || undefined,
        warranty:     warranty     || undefined,
        notes:        notes        || undefined,
        currency:     rfq.currency || 'BRL',
        items: bidItems.map(bi => ({
          rfqItemId:  bi.rfqItemId,
          unitPrice:  parseFloat(bi.unitPrice),
          totalPrice: bi.totalPrice,
          notes:      bi.notes || undefined,
        })),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit bid');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-400">Loading RFQ…</p>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600"/>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Bid Submitted!</h2>
        <p className="text-slate-500 text-sm mb-6">
          Your bid for <strong>{rfq?.title}</strong> has been received by the procurement team.
        </p>
        <button onClick={() => router.push('/dashboard')}
          className="bg-[#1e3a5f] hover:bg-[#163050] text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0d2040] text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={20}/>
          </button>
          <div>
            <p className="font-bold text-sm">BidFlow Supplier Portal</p>
            {supplier && <p className="text-xs text-white/50">{supplier.name}</p>}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left: RFQ info */}
          <div className="col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                {rfq?.status}
              </span>
              <h1 className="text-lg font-bold text-slate-900 mb-1">{rfq?.title}</h1>
              <p className="font-mono text-xs text-slate-400 mb-3">{rfq?.number}</p>
              {rfq?.description && (
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{rfq.description}</p>
              )}
              <dl className="space-y-2">
                {[
                  ['Deadline',       rfq?.deadline     ? formatDate(rfq.deadline)     : '—'],
                  ['Delivery Date',  rfq?.deliveryDate ? formatDate(rfq.deliveryDate) : '—'],
                  ['Payment Terms',  rfq?.paymentTerms || '—'],
                  ['Currency',       rfq?.currency     || 'BRL'],
                  ['Items',          `${rfq?.items?.length || 0} items`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <dt className="text-xs text-slate-500">{k}</dt>
                    <dd className="text-xs font-medium text-slate-700 text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              {rfq?.auctionEnabled && (
                <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-purple-800">⚡ Reverse Auction</p>
                  <p className="text-xs text-purple-600 mt-0.5">
                    You can update your bid until: {rfq.auctionEndTime ? formatDate(rfq.auctionEndTime) : '—'}
                  </p>
                </div>
              )}
            </div>

            {/* Items summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Package size={15}/> Items Requested
              </h3>
              <div className="space-y-2">
                {rfq?.items?.map((item: any, i: number) => (
                  <div key={item.id} className="flex justify-between items-start gap-2 text-sm">
                    <div>
                      <p className="font-medium text-slate-900 text-xs">{item.name}</p>
                      {item.description && <p className="text-slate-400 text-xs">{item.description}</p>}
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded whitespace-nowrap">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Bid form */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 text-lg mb-1">Submit Your Bid</h2>
              <p className="text-slate-500 text-sm mb-6">Fill in your prices and commercial terms below.</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Item prices */}
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-3">Item Prices *</h3>
                  <div className="space-y-3">
                    {rfq?.items?.map((item: any, i: number) => (
                      <div key={item.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity} {item.unit}</p>
                          </div>
                          {item.estimatedPrice && (
                            <span className="text-xs text-slate-400">Est. {item.estimatedPrice.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-1">
                            <label className="block text-xs text-slate-500 mb-1">Unit Price *</label>
                            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 bg-white">
                              <span className="px-2 text-xs text-slate-400 bg-slate-50 border-r border-slate-300 py-2">
                                {rfq.currency}
                              </span>
                              <input
                                type="number" min="0.01" step="0.01" required
                                value={bidItems[i]?.unitPrice || ''}
                                onChange={e => updateBidItem(i, 'unitPrice', e.target.value)}
                                className="flex-1 px-2 py-2 text-sm outline-none"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div className="col-span-1">
                            <label className="block text-xs text-slate-500 mb-1">Total</label>
                            <div className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-100 text-slate-600 font-medium">
                              {bidItems[i]?.totalPrice?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <label className="block text-xs text-slate-500 mb-1">Notes</label>
                            <input
                              type="text"
                              value={bidItems[i]?.notes || ''}
                              onChange={e => updateBidItem(i, 'notes', e.target.value)}
                              placeholder="Optional"
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Total */}
                  <div className="mt-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#1e3a5f]">Total Bid Value</span>
                    <span className="text-lg font-bold text-[#1e3a5f]">
                      {rfq?.currency} {totalBidPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Commercial terms */}
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-3">Commercial Terms</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Delivery Days *</label>
                      <input
                        type="number" min="1" required
                        value={deliveryDays} onChange={e => setDeliveryDays(e.target.value)}
                        placeholder="e.g. 15"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Payment Terms</label>
                      <input
                        type="text"
                        value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}
                        placeholder="e.g. 30 days net"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Warranty</label>
                      <input
                        type="text"
                        value={warranty} onChange={e => setWarranty(e.target.value)}
                        placeholder="e.g. 12 months"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">General Notes</label>
                      <input
                        type="text"
                        value={notes} onChange={e => setNotes(e.target.value)}
                        placeholder="Optional observations"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => router.push('/dashboard')}
                    className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#163050] text-white font-medium rounded-lg transition-colors disabled:opacity-60">
                    <Send size={15}/>
                    {submitting ? 'Submitting…' : 'Submit Bid'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
