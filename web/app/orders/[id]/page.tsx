'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { formatDate, formatCurrency, getOrderStatusColor } from '@/lib/utils';
import { ArrowLeft, CheckCircle, Send, Package, Clock, XCircle, FileText, Truck } from 'lucide-react';

const STEPS = [
  { key: 'DRAFT',            label: 'Created',    icon: FileText   },
  { key: 'PENDING_APPROVAL', label: 'Approval',   icon: Clock      },
  { key: 'APPROVED',         label: 'Approved',   icon: CheckCircle},
  { key: 'SENT',             label: 'Sent',        icon: Send       },
  { key: 'RECEIVED',         label: 'Received',   icon: Package    },
];

const ORDER_FLOW: Record<string, { next: string; label: string; color: string } | null> = {
  DRAFT:            { next: 'PENDING_APPROVAL', label: 'Submit for Approval', color: 'bg-blue-600 hover:bg-blue-700'   },
  PENDING_APPROVAL: { next: 'APPROVED',         label: 'Approve Order',       color: 'bg-green-600 hover:bg-green-700' },
  APPROVED:         { next: 'SENT',             label: 'Mark as Sent',        color: 'bg-purple-600 hover:bg-purple-700'},
  SENT:             { next: 'RECEIVED',         label: 'Confirm Receipt',     color: 'bg-green-600 hover:bg-green-700' },
  RECEIVED:         null,
  CANCELLED:        null,
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const qc     = useQueryClient();

  const { data: orders } = useQuery({
    queryKey: ['order', params.id],
    queryFn: () => ordersApi.list({ limit: 200 }).then(r => r.data.data?.find((o: any) => o.id === params.id)),
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => ordersApi.updateStatus(params.id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['order', params.id] }),
  });

  const cancelMutation = useMutation({
    mutationFn: () => ordersApi.updateStatus(params.id, 'CANCELLED'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['order', params.id] }),
  });

  const order = orders;
  if (!order) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <div className="flex-1 ml-60 flex items-center justify-center">
        <p className="text-slate-400">Loading order…</p>
      </div>
    </div>
  );

  const flow   = ORDER_FLOW[order.status];
  const stepIdx = STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar
          title={order.number}
          subtitle={`${order.supplier?.name} · ${formatCurrency(order.totalAmount, order.currency)}`}
          action={
            <div className="flex gap-2">
              <button onClick={() => router.back()} className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <ArrowLeft size={15}/> Back
              </button>
              {!['RECEIVED','CANCELLED'].includes(order.status) && (
                <button onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}
                  className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 text-sm font-medium">
                  <XCircle size={15}/> Cancel
                </button>
              )}
              {flow && (
                <button onClick={() => statusMutation.mutate(flow.next)} disabled={statusMutation.isPending}
                  className={`flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${flow.color}`}>
                  <CheckCircle size={15}/> {flow.label}
                </button>
              )}
            </div>
          }
        />

        <main className="flex-1 p-6">
          {/* Status tracker */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 mx-8" style={{ zIndex: 0 }}/>
              {STEPS.map((step, i) => {
                const done    = i < stepIdx || order.status === 'RECEIVED';
                const current = step.key === order.status;
                const Icon    = step.icon;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      order.status === 'CANCELLED' ? 'bg-red-100 border-red-300 text-red-500'
                      : done    ? 'bg-green-500 border-green-500 text-white'
                      : current ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white ring-4 ring-[#1e3a5f]/20'
                      : 'bg-white border-slate-300 text-slate-400'
                    }`}>
                      <Icon size={16}/>
                    </div>
                    <span className={`text-xs font-medium ${current ? 'text-[#1e3a5f]' : done ? 'text-green-600' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left: Order info */}
            <div className="col-span-2 space-y-5">
              {/* Main card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{order.number}</span>
                    <p className="font-bold text-slate-900 text-lg mt-2">{order.rfq?.title || 'Direct Order'}</p>
                    {order.rfq?.number && <p className="text-xs text-slate-500">From RFQ {order.rfq.number}</p>}
                  </div>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Supplier',       order.supplier?.name || '—'],
                    ['Total Amount',   formatCurrency(order.totalAmount, order.currency)],
                    ['Currency',       order.currency],
                    ['Payment Terms',  order.paymentTerms || '—'],
                    ['Delivery Date',  order.deliveryDate ? formatDate(order.deliveryDate) : '—'],
                    ['Created',        formatDate(order.createdAt)],
                    ['Created by',     `${order.createdBy?.firstName} ${order.createdBy?.lastName}`],
                    ['Approved by',    order.approvedBy ? `${order.approvedBy.firstName} ${order.approvedBy.lastName}` : '—'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-xs text-slate-500">{k}</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>

                {order.deliveryAddress && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Delivery Address</p>
                    <p className="text-sm text-slate-700">{order.deliveryAddress}</p>
                  </div>
                )}
                {order.notes && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Notes</p>
                    <p className="text-sm text-slate-700">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Timeline */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900 text-sm mb-4">Timeline</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Order Created',   date: order.createdAt,   done: true               },
                    { label: 'Approved',        date: order.approvedAt,  done: !!order.approvedAt },
                    { label: 'Sent to Supplier',date: order.sentAt,      done: !!order.sentAt     },
                    { label: 'Received',        date: order.receivedAt,  done: !!order.receivedAt },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-start gap-3 ${!item.done ? 'opacity-40' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.done ? 'bg-green-100' : 'bg-slate-100'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.done ? 'bg-green-500' : 'bg-slate-400'}`}/>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.date ? formatDate(item.date) : 'Pending'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#1e3a5f] rounded-xl p-5 text-white">
                <p className="text-white/60 text-xs mb-1">Order Total</p>
                <p className="text-2xl font-bold">{formatCurrency(order.totalAmount, order.currency)}</p>
                <p className="text-white/60 text-xs mt-3">{order.paymentTerms || 'Standard terms'}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
