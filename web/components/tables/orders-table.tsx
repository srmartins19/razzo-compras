'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Table, Thead, Th, Td, Tr } from '@/components/ui/table';
import { OrderStatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ordersApi } from '@/lib/api';
import { ShoppingCart, ChevronRight } from 'lucide-react';

const ACTIONS: Record<string, { next: string; label: string }> = {
  DRAFT:            { next: 'PENDING_APPROVAL', label: 'Submit'  },
  PENDING_APPROVAL: { next: 'APPROVED',         label: 'Approve' },
  APPROVED:         { next: 'SENT',             label: 'Send'    },
  SENT:             { next: 'RECEIVED',         label: 'Receive' },
};

interface OrdersTableProps {
  orders:    any[];
  isLoading: boolean;
  queryKey:  unknown[];
}

export function OrdersTable({ orders, isLoading, queryKey }: OrdersTableProps) {
  const router = useRouter();
  const qc     = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => ordersApi.updateStatus(id, status),
    onSuccess:  () => qc.invalidateQueries({ queryKey }),
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <Thead>
          <tr>
            <Th>PO Number</Th><Th>Supplier</Th><Th>Amount</Th>
            <Th>Status</Th><Th>Delivery</Th><Th>Action</Th><Th/>
          </tr>
        </Thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading && <tr><td colSpan={7} className="text-center py-12 text-slate-400 text-sm">Loading…</td></tr>}
          {!isLoading && orders.length === 0 && (
            <tr><td colSpan={7}>
              <EmptyState icon={<ShoppingCart size={32}/>} title="No purchase orders"
                description="Close an RFQ with a winner to generate a PO."/>
            </td></tr>
          )}
          {orders.map((o: any) => {
            const action = ACTIONS[o.status];
            return (
              <Tr key={o.id} onClick={() => router.push(`/orders/${o.id}`)}>
                <Td><span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{o.number}</span></Td>
                <Td className="font-medium text-slate-900">{o.supplier?.name}</Td>
                <Td className="font-semibold">{formatCurrency(o.totalAmount, o.currency)}</Td>
                <Td><OrderStatusBadge status={o.status}/></Td>
                <Td className="text-slate-500 text-xs">{o.deliveryDate ? formatDate(o.deliveryDate) : '—'}</Td>
                <Td onClick={e => e.stopPropagation()}>
                  {action && (
                    <Button size="sm" variant="secondary"
                      loading={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: o.id, status: action.next })}>
                      {action.label}
                    </Button>
                  )}
                </Td>
                <Td><ChevronRight size={15} className="text-slate-300"/></Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
