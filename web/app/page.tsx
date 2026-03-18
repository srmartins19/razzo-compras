'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfqsApi, ordersApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { formatDate, formatCurrency, getRfqStatusColor } from '@/lib/utils';
import { Trophy, Clock, CheckCircle, Users, ArrowRight, Zap, Star } from 'lucide-react';
import type { BidComparisonRow } from '@bidflow/types';

const STATUS_ACTIONS: Record<string, { label: string; next: string; color: string }> = {
  DRAFT:    { label: 'Open for Bidding', next: 'OPEN',     color: 'bg-blue-600 hover:bg-blue-700' },
  OPEN:     { label: 'Move to Analysis', next: 'ANALYSIS', color: 'bg-amber-600 hover:bg-amber-700' },
  ANALYSIS: { label: 'Close RFQ',        next: 'CLOSED',   color: 'bg-slate-600 hover:bg-slate-700' },
};

export default function RfqDetailPage({ params }: { params: { id: string } }) {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview'|'bids'|'comparison'|'suppliers'>('overview');
  const [selectedWinner, setSelectedWinner] = useState<string>('');

  const { data: rfq, isLoading } = useQuery({
    queryKey: ['rfq', params.id],
    queryFn: () => rfqsApi.get(params.id).then(r => r.data),
  });

  const { data: comparison } = useQuery({
    queryKey: ['rfq-comparison', params.id],
    queryFn: () => rfqsApi.comparison(params.id).then(r => r.data),
    enabled: activeTab === 'comparison' && !!rfq?.bids?.length,
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => rfqsApi.updateStatus(params.id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rfq', params.id] }),
  });

  const winnerMutation = useMutation({
    mutationFn: (supplierId: string) => rfqsApi.selectWinner(params.id, supplierId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rfq', params.id] });
      setSelectedWinner('');
    },
  });

  const generatePoMutation = useMutation({
    mutationFn: () => ordersApi.generateFromRfq(params.id),
    onSuccess: (res) => { window.location.href = `/orders`; },
  });

  if (isLoading) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>
    </div>
  );
  if (!rfq) return null;

  const currentAction = STATUS_ACTIONS[rfq.status];
  const tabs = ['overview', 'bids', 'comparison', 'suppliers'] as const;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar
          title={rfq.title}
          subtitle={`${rfq.number} · Created ${formatDate(rfq.createdAt)}`}
          action={
            <div className="flex items-center gap-2">
              {rfq.status === 'CLOSED' && rfq.winningSupplierId && (
                <button
                  onClick={() => generatePoMutation.mutate()}
                  disabled={generatePoMutation.isPending}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <CheckCircle size={15} /> Generate PO
                </button>
              )}
              {currentAction && (
                <button
                  onClick={() => statusMutation.mutate(currentAction.next)}
                  disabled={statusMutation.isPending}
                  className={`flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${currentAction.color}`}
                >
                  <ArrowRight size={15} /> {currentAction.label}
                </button>
              )}
            </div>
          }
        />

        {/* Status bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-6">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRfqStatusColor(rfq.status)}`}>{rfq.status}</span>
          <span className="text-sm text-slate-500 flex items-center gap-1.5"><Clock size={14}/> Deadline: {formatDate(rfq.deadline)}</span>
          <span className="text-sm text-slate-500 flex items-center gap-1.5"><Users size={14}/> {rfq.suppliers?.length || 0} suppliers invited</span>
          <span className="text-sm text-slate-500">{rfq.bids?.length || 0} bids received</span>
          {rfq.auctionEnabled && <span className="text-sm text-purple-600 font-medium flex items-center gap-1"><Zap size={14}/> Auction enabled</span>}
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-slate-200 px-6">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
                {tab === 'bids' && rfq.bids?.length > 0 && (
                  <span className="ml-1.5 bg-blue-100 text-blue-700 text-xs rounded-full px-1.5 py-0.5">{rfq.bids.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-6">
          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-5">
                {/* Description */}
                {rfq.description && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{rfq.description}</p>
                  </div>
                )}
                {/* Items */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Items ({rfq.items?.length})</h3>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['Item', 'Qty', 'Unit', 'Est. Price'].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rfq.items?.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{item.unit}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{item.estimatedPrice ? formatCurrency(item.estimatedPrice, rfq.currency) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar info */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900 mb-3">Details</h3>
                  <dl className="space-y-2.5">
                    {[
                      ['Currency', rfq.currency],
                      ['Payment Terms', rfq.paymentTerms || '—'],
                      ['Delivery Date', rfq.deliveryDate ? formatDate(rfq.deliveryDate) : '—'],
                      ['Delivery Address', rfq.deliveryAddress || '—'],
                      ['Created by', `${rfq.createdBy?.firstName} ${rfq.createdBy?.lastName}`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3">
                        <dt className="text-xs text-slate-500">{k}</dt>
                        <dd className="text-xs font-medium text-slate-700 text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {rfq.winningSupplierId && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy size={16} className="text-green-600" />
                      <h3 className="font-semibold text-green-900">Winner Selected</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      {rfq.bids?.find((b: any) => b.isWinner)?.supplier?.name || 'Supplier selected'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bids tab */}
          {activeTab === 'bids' && (
            <div className="space-y-4">
              {rfq.bids?.length === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <p className="text-slate-400">No bids received yet</p>
                </div>
              )}
              {rfq.bids?.map((bid: any) => (
                <div key={bid.id} className={`bg-white rounded-xl border p-5 ${bid.isWinner ? 'border-green-300 bg-green-50/30' : 'border-slate-200'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{bid.supplier?.name}</h3>
                        {bid.isWinner && <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full"><Trophy size={11}/> Winner</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Submitted {formatDate(bid.submittedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-slate-900">{formatCurrency(bid.totalPrice, bid.currency)}</p>
                      <p className="text-xs text-slate-500">{bid.deliveryDays} days delivery</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                    <div><span className="text-slate-500 text-xs">Payment:</span><p className="font-medium text-xs mt-0.5">{bid.paymentTerms || '—'}</p></div>
                    <div><span className="text-slate-500 text-xs">Warranty:</span><p className="font-medium text-xs mt-0.5">{bid.warranty || '—'}</p></div>
                    <div><span className="text-slate-500 text-xs">Notes:</span><p className="font-medium text-xs mt-0.5">{bid.notes || '—'}</p></div>
                  </div>
                  {!rfq.winningSupplierId && rfq.status !== 'DRAFT' && rfq.status !== 'OPEN' && (
                    <button
                      onClick={() => winnerMutation.mutate(bid.supplierId)}
                      disabled={winnerMutation.isPending}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Select as Winner
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Comparison Matrix tab */}
          {activeTab === 'comparison' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Bid Comparison Matrix</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ranked by weighted score (price 60% + delivery 40%)</p>
              </div>
              {!comparison || comparison.length === 0 ? (
                <p className="text-slate-400 text-sm p-8 text-center">No bids to compare yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Rank</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Supplier</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Total Price</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Delivery</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">vs Avg</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Score</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(comparison as BidComparisonRow[]).map((row) => (
                        <tr key={row.supplierId} className={row.ranking === 1 ? 'bg-green-50/50' : 'hover:bg-slate-50'}>
                          <td className="px-4 py-4">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${row.ranking === 1 ? 'bg-yellow-400 text-yellow-900' : row.ranking === 2 ? 'bg-slate-300 text-slate-700' : row.ranking === 3 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              {row.ranking}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {row.ranking === 1 && <Trophy size={14} className="text-yellow-500"/>}
                              <div>
                                <p className="text-sm font-medium text-slate-900">{row.supplierName}</p>
                                <p className="text-xs text-slate-500">{row.paymentTerms || 'Standard terms'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <p className="text-sm font-bold text-slate-900">{formatCurrency(row.totalPrice, row.currency)}</p>
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-slate-600">{row.deliveryDays}d</td>
                          <td className="px-4 py-4 text-right">
                            <span className={`text-xs font-medium ${row.savingsVsAverage >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {row.savingsVsAverage >= 0 ? '-' : '+'}{formatCurrency(Math.abs(row.savingsVsAverage))}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(row.score / 10) * 100}%` }} />
                              </div>
                              <span className="text-xs font-semibold text-slate-700">{row.score}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {!rfq.winningSupplierId && rfq.status === 'ANALYSIS' && (
                              <button
                                onClick={() => winnerMutation.mutate(row.supplierId)}
                                disabled={winnerMutation.isPending}
                                className="text-xs text-blue-600 hover:text-blue-700 border border-blue-200 px-2.5 py-1 rounded hover:bg-blue-50 font-medium"
                              >
                                Select
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Suppliers tab */}
          {activeTab === 'suppliers' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Invited Suppliers</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Supplier', 'Email', 'Invited', 'Viewed', 'Responded'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rfq.suppliers?.map((rs: any) => (
                    <tr key={rs.id}>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{rs.supplier?.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{rs.supplier?.email}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(rs.invitedAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${rs.viewedAt ? 'text-green-600' : 'text-slate-400'}`}>{rs.viewedAt ? '✓ Yes' : '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${rs.respondedAt ? 'text-green-600' : 'text-slate-400'}`}>{rs.respondedAt ? '✓ Yes' : 'Pending'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
