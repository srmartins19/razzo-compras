'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersApi, analyticsApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Plus, Search, CheckCircle, Trophy } from 'lucide-react';

function ScoreBar({ value, color = '#1e3a5f' }: { value: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${(value / 10) * 100}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold text-slate-600 w-6">{value.toFixed(1)}</span>
    </div>
  );
}

export default function SuppliersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [showRanking, setShowRanking] = useState(false);

  const { data } = useQuery({
    queryKey: ['suppliers', search],
    queryFn: () => suppliersApi.list({ search: search || undefined, limit: 50 }).then(r => r.data),
  });
  const { data: ranking } = useQuery({
    queryKey: ['supplier-ranking'],
    queryFn: () => analyticsApi.ranking().then(r => r.data),
    enabled: showRanking,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => suppliersApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar
          title="Suppliers"
          subtitle={`${data?.total || 0} total`}
          action={
            <div className="flex gap-2">
              <button onClick={() => setShowRanking(!showRanking)} className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${showRanking ? 'bg-amber-50 border-amber-300 text-amber-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <Trophy size={15}/> Ranking
              </button>
              <button className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#163050] text-white text-sm font-medium px-4 py-2 rounded-lg">
                <Plus size={15}/> Add Supplier
              </button>
            </div>
          }
        />
        <main className="flex-1 p-6">
          {/* Ranking panel */}
          {showRanking && ranking && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Trophy size={16} className="text-amber-500"/> Supplier Ranking (Score = 0.4×Price + 0.3×Delivery + 0.2×Quality + 0.1×Service)</h3>
              <div className="space-y-3">
                {ranking.slice(0, 8).map((s: any, i: number) => (
                  <div key={s.supplierId} className="flex items-center gap-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-slate-300 text-slate-700' : i === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{s.ranking}</span>
                    <span className="text-sm font-medium text-slate-900 w-40 truncate">{s.supplierName}</span>
                    <div className="flex-1"><ScoreBar value={s.overallScore} /></div>
                    <span className="text-sm font-bold text-[#1e3a5f] w-10 text-right">{s.overallScore}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers..."
              className="w-full max-w-sm pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"/>
          </div>

          {/* Suppliers table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Supplier', 'Email', 'Categories', 'Score', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.data?.map((s: any) => {
                  const score = s.performance?.overallScore || 5;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{s.name}</p>
                          {s.contactName && <p className="text-xs text-slate-500">{s.contactName}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">{s.email}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1 flex-wrap">
                          {s.categories?.slice(0, 3).map((c: string) => (
                            <span key={c} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 w-36"><ScoreBar value={score} /></td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${s.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {s.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {!s.isApproved && (
                          <button onClick={() => approveMutation.mutate(s.id)} disabled={approveMutation.isPending}
                            className="text-xs text-green-600 hover:text-green-700 border border-green-200 px-2.5 py-1 rounded hover:bg-green-50 font-medium flex items-center gap-1">
                            <CheckCircle size={11}/> Approve
                          </button>
                        )}
                      </td>
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
