'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { formatDate, formatCurrency, getOrderStatusColor } from '@/lib/utils';
import { ChevronRight, ShoppingCart } from 'lucide-react';

const STATUS_TRANSITIONS: Record<string, string> = {
  DRAFT: 'PENDING_APPROVAL',
  PENDING_APPROVAL: 'APPROVED',
  APPROVED: 'SENT',
  SENT: 'RECEIVED',
};
const ACTION_LABELS: Record<string, string> = {
  DRAFT: 'Submit for Approval',
  PENDING_APPROVAL: 'Approve',
  APPROVED: 'Mark as Sent',
  SENT: 'Confirm Receipt',
};

export default function OrdersPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', status],
    queryFn: () => ordersApi.list({ status: status || undefined, limit: 30 }).then(r => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => ordersApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar title="Purchase Orders" subtitle={`${data?.total || 0} total`} />
        <main className="flex-1 p-6">
          {/* Filter */}
          <div className="mb-4">
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              <option value="">All statuses</option>
              {['DRAFT','PENDING_APPROVAL','APPROVED','SENT','RECEIVED','CANCELLED'].map(s => (
                <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['PO Number','Supplier','RFQ','Amount','Status','Delivery','Action',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && <tr><td colSpan={8} className="text-center py-10 text-slate-400 text-sm">Loading...</td></tr>}
                {!isLoading && data?.data?.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-16">
                    <ShoppingCart size={32} className="mx-auto text-slate-300 mb-3"/>
                    <p className="text-sm text-slate-500">No orders yet</p>
                    <p className="text-xs text-slate-400">Close an RFQ with a winner to generate a PO</p>
                  </td></tr>
                )}
                {data?.data?.map((order: any) => {
                  const nextStatus = STATUS_TRANSITIONS[order.status];
                  const actionLabel = ACTION_LABELS[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{order.number}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-900">{order.supplier?.name}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{order.rfq?.number || '—'}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-slate-900">{formatCurrency(order.totalAmount, order.currency)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                          {order.status.replace(/_/g,' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500">{order.deliveryDate ? formatDate(order.deliveryDate) : '—'}</td>
                      <td className="px-4 py-3.5">
                        {nextStatus && actionLabel && (
                          <button
                            onClick={() => statusMutation.mutate({ id: order.id, status: nextStatus })}
                            disabled={statusMutation.isPending}
                            className="text-xs font-medium text-blue-600 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            {actionLabel}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3.5"><ChevronRight size={16} className="text-slate-400"/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
