'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { rfqsApi, suppliersApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { Check, Search, Users, ArrowLeft, Send } from 'lucide-react';

export default function InviteSuppliersPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [success, setSuccess] = useState(false);
  const dSearch = useDebounce(search, 300);

  const { data: rfq } = useQuery({
    queryKey: ['rfq-meta', params.id],
    queryFn: () => rfqsApi.get(params.id).then(r => r.data),
  });

  const { data: suppliersData } = useQuery({
    queryKey: ['suppliers-invite', dSearch],
    queryFn: () => suppliersApi.list({ search: dSearch || undefined, limit: 50 }).then(r => r.data),
  });

  // Pre-select already invited suppliers
  const alreadyInvited = new Set<string>(rfq?.suppliers?.map((s: any) => s.supplierId) ?? []);

  const inviteMutation = useMutation({
    mutationFn: (supplierIds: string[]) => rfqsApi.invite(params.id, supplierIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rfq', params.id] });
      setSuccess(true);
      setTimeout(() => router.push(`/rfqs/${params.id}`), 1500);
    },
  });

  const toggleSupplier = (id: string) => {
    if (alreadyInvited.has(id)) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const suppliers = suppliersData?.data ?? [];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar
          title="Invite Suppliers"
          subtitle={rfq ? `${rfq.number} — ${rfq.title}` : '…'}
          action={
            <div className="flex gap-2">
              <Button variant="secondary" icon={<ArrowLeft size={14}/>} onClick={() => router.back()}>
                Back
              </Button>
              <Button
                icon={<Send size={14}/>}
                disabled={selected.size === 0}
                loading={inviteMutation.isPending}
                onClick={() => inviteMutation.mutate([...selected])}
              >
                Send Invites ({selected.size})
              </Button>
            </div>
          }
        />

        <main className="flex-1 p-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4 mb-5 flex items-center gap-3">
              <Check size={18} className="text-green-600 flex-shrink-0"/>
              <span className="font-medium">Invitations sent! Redirecting…</span>
            </div>
          )}

          {inviteMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-5">
              Failed to send invitations. Please try again.
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            {/* Supplier list */}
            <div className="col-span-2">
              <div className="mb-4">
                <Input
                  prefix={<Search size={14}/>}
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                {suppliers.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    <Users size={28} className="mx-auto mb-2 text-slate-300"/>
                    No suppliers found
                  </div>
                )}
                {suppliers.map((s: any) => {
                  const isInvited  = alreadyInvited.has(s.id);
                  const isSelected = selected.has(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleSupplier(s.id)}
                      className={`flex items-center gap-4 px-5 py-4 transition-colors ${isInvited ? 'opacity-50 cursor-default' : 'cursor-pointer hover:bg-slate-50'}`}
                    >
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                        isInvited  ? 'bg-green-500 border-green-500' :
                        isSelected ? 'bg-[#1e3a5f] border-[#1e3a5f]' :
                        'border-slate-300'
                      }`}>
                        {(isInvited || isSelected) && <Check size={11} className="text-white"/>}
                      </div>

                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-sm font-bold text-[#1e3a5f] flex-shrink-0">
                        {s.name?.[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">{s.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s.email}</p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex gap-1 flex-wrap justify-end">
                          {s.categories?.slice(0, 2).map((c: string) => (
                            <span key={c} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{c}</span>
                          ))}
                        </div>
                        {isInvited && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Already invited</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900 text-sm mb-4">Invitation Summary</h3>
                <dl className="space-y-3">
                  {[
                    ['RFQ',             rfq?.number ?? '…'],
                    ['Status',          rfq?.status  ?? '…'],
                    ['Deadline',        rfq ? new Date(rfq.deadline).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '…'],
                    ['Already invited', `${alreadyInvited.size} supplier${alreadyInvited.size !== 1 ? 's' : ''}`],
                    ['To invite now',   `${selected.size} supplier${selected.size !== 1 ? 's' : ''}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <dt className="text-xs text-slate-500">{k}</dt>
                      <dd className="text-xs font-medium text-slate-800 text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {selected.size > 0 && (
                <div className="bg-[#1e3a5f] rounded-xl p-5 text-white">
                  <p className="font-semibold mb-3">Ready to invite:</p>
                  <div className="space-y-2">
                    {suppliers
                      .filter((s: any) => selected.has(s.id))
                      .map((s: any) => (
                        <div key={s.id} className="flex items-center gap-2 text-sm text-white/80">
                          <Check size={12} className="text-green-400 flex-shrink-0"/>
                          {s.name}
                        </div>
                      ))}
                  </div>
                  <Button
                    className="w-full mt-4"
                    icon={<Send size={14}/>}
                    loading={inviteMutation.isPending}
                    onClick={() => inviteMutation.mutate([...selected])}
                  >
                    Send {selected.size} Invitation{selected.size !== 1 ? 's' : ''}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
