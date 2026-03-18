'use client';
import { useRouter } from 'next/navigation';
import { Table, Thead, Th, Td, Tr } from '@/components/ui/table';
import { RfqStatusBadge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';
import { FileText, ChevronRight } from 'lucide-react';

interface RfqTableProps {
  rfqs:      any[];
  isLoading: boolean;
}

export function RfqTable({ rfqs, isLoading }: RfqTableProps) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <Thead>
          <tr>
            <Th>Number</Th><Th>Title</Th><Th>Status</Th>
            <Th>Suppliers</Th><Th>Bids</Th><Th>Deadline</Th>
            <Th>Created by</Th><Th/>
          </tr>
        </Thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading && (
            <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">Loading…</td></tr>
          )}
          {!isLoading && rfqs.length === 0 && (
            <tr><td colSpan={8}>
              <EmptyState icon={<FileText size={32}/>} title="No RFQs found"
                description="Create your first RFQ to start sourcing."
                action={<a href="/rfqs/new" className="text-sm text-[#2563a8] font-medium hover:underline">Create RFQ →</a>}/>
            </td></tr>
          )}
          {rfqs.map((rfq: any) => (
            <Tr key={rfq.id} onClick={() => router.push(`/rfqs/${rfq.id}`)}>
              <Td><span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{rfq.number}</span></Td>
              <Td>
                <p className="font-medium text-slate-900 text-sm">{rfq.title}</p>
                {rfq.auctionEnabled && <span className="text-xs text-purple-600">⚡ Auction</span>}
              </Td>
              <Td><RfqStatusBadge status={rfq.status}/></Td>
              <Td className="text-slate-600">{rfq.suppliers?.length ?? 0}</Td>
              <Td className="text-slate-600">{rfq.bids?.length ?? 0}</Td>
              <Td className="text-slate-500 text-xs whitespace-nowrap">{formatDate(rfq.deadline)}</Td>
              <Td className="text-slate-500 text-xs">{rfq.createdBy?.firstName} {rfq.createdBy?.lastName?.[0]}.</Td>
              <Td><ChevronRight size={15} className="text-slate-300"/></Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
