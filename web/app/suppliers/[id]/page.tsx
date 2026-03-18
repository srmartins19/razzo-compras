'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { suppliersApi, analyticsApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { formatDate } from '@/lib/utils';
import { CheckCircle, Star, TrendingUp, Package, ArrowLeft, ExternalLink, Mail, Phone } from 'lucide-react';

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 8 ? '#16a34a' : value >= 6 ? '#d97706' : '#dc2626';
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-20">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-2 rounded-full transition-all" style={{ width: `${(value / 10) * 100}%`, background: color }}/>
      </div>
      <span className="text-xs font-bold w-6 text-right" style={{ color }}>{value.toFixed(1)}</span>
    </div>
  );
}

export default function SupplierDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const qc = useQueryClient();

  const { data: suppliers } = useQuery({
    queryKey: ['supplier', params.id],
    queryFn: () => suppliersApi.list({ limit: 200 }).then(r => r.data.data?.find((s: any) => s.id === params.id)),
  });

  const { data: ranking } = useQuery({
    queryKey: ['supplier-ranking'],
    queryFn: () => analyticsApi.ranking().then(r => r.data),
  });

  const approveMutation = useMutation({
    mutationFn: () => suppliersApi.approve(params.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['supplier'] }),
  });

  const supplier = suppliers;
  const perf = ranking?.find((r: any) => r.supplierId === params.id);

  if (!supplier) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <div className="flex-1 ml-60 flex items-center justify-center">
        <p className="text-slate-400">Loading supplier…</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar
          title={supplier.name}
          subtitle={supplier.email}
          action={
            <div className="flex gap-2">
              <button onClick={() => router.back()} className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <ArrowLeft size={15}/> Back
              </button>
              {!supplier.isApproved && (
                <button onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                  <CheckCircle size={15}/> Approve
                </button>
              )}
            </div>
          }
        />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left column */}
            <div className="space-y-5">
              {/* Basic info card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {supplier.name?.[0]}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">{supplier.name}</h2>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${supplier.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {supplier.isApproved ? '✓ Approved' : 'Pending Approval'}
                    </span>
                  </div>
                </div>

                <dl className="space-y-3">
                  {[
                    [<Mail size={13} className="text-slate-400"/>, supplier.email],
                    [<Phone size={13} className="text-slate-400"/>, supplier.phone || '—'],
                  ].map(([icon, val], i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">{icon as any} {val as string}</div>
                  ))}
                  {supplier.website && (
                    <a href={supplier.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <ExternalLink size={13}/> {supplier.website}
                    </a>
                  )}
                </dl>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-2">Categories</p>
                  <div className="flex flex-wrap gap-1.5">
                    {supplier.categories?.map((c: string) => (
                      <span key={c} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                </div>

                {supplier.portalAccess && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-green-700 font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"/>
                      Portal access active
                    </div>
                  </div>
                )}
              </div>

              {/* Contact person */}
              {supplier.contactName && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 text-sm mb-3">Contact Person</h3>
                  <p className="text-sm text-slate-700 font-medium">{supplier.contactName}</p>
                  {supplier.email && <p className="text-xs text-slate-500 mt-0.5">{supplier.email}</p>}
                </div>
              )}
            </div>

            {/* Right: Performance */}
            <div className="col-span-2 space-y-5">
              {/* Score card */}
              {perf ? (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="font-semibold text-slate-900">Performance Score</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Based on {perf.totalOrders} completed orders</p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-[#1e3a5f]">{perf.overallScore.toFixed(1)}</p>
                      <p className="text-xs text-slate-500">/10 · Rank #{perf.ranking}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <ScoreBar label="Price"    value={perf.priceScore}    />
                    <ScoreBar label="Delivery" value={perf.deliveryScore} />
                    <ScoreBar label="Quality"  value={perf.qualityScore}  />
                    <ScoreBar label="Service"  value={perf.serviceScore}  />
                  </div>
                  <p className="text-xs text-slate-400 mt-4">
                    Formula: 0.4 × Price + 0.3 × Delivery + 0.2 × Quality + 0.1 × Service
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center">
                  <Star size={28} className="mx-auto text-slate-300 mb-2"/>
                  <p className="text-sm text-slate-500">No performance data yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Scores are calculated after orders are received.</p>
                </div>
              )}

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Orders',  value: perf?.totalOrders || 0,              icon: Package,    color: 'bg-blue-50 text-blue-600'   },
                  { label: 'Overall Score', value: perf ? perf.overallScore.toFixed(1) : '—', icon: Star, color: 'bg-amber-50 text-amber-600' },
                  { label: 'Ranking',       value: perf ? `#${perf.ranking}` : '—',     icon: TrendingUp, color: 'bg-purple-50 text-purple-600'},
                ].map(c => (
                  <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color}`}>
                      <c.icon size={18}/>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">{c.value}</p>
                      <p className="text-xs text-slate-500">{c.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
