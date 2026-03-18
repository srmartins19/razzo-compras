'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Plus, Search, Package } from 'lucide-react';

export default function ItemsPage() {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', code:'', category:'', unit:'UN', description:'' });
  const [error, setError] = useState('');
  const qc = useQueryClient();

  const { data: categories } = useQuery({ queryKey:['item-categories'], queryFn:()=>api.get('/items/categories').then(r=>r.data) });
  const { data, isLoading  } = useQuery({
    queryKey: ['items', search, category],
    queryFn: () => api.get('/items', { params: { search: search||undefined, category: category||undefined } }).then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (dto: object) => api.post('/items', dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['items'] }); setShowForm(false); setForm({ name:'', code:'', category:'', unit:'UN', description:'' }); },
    onError: (e: any) => setError(e.response?.data?.message || 'Failed'),
  });

  const inp = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar
          title="Item Catalog"
          subtitle={`${data?.length || 0} items`}
          action={
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#163050] text-white text-sm font-medium px-4 py-2 rounded-lg">
              <Plus size={15}/> New Item
            </button>
          }
        />
        <main className="flex-1 p-6">
          {/* Create form */}
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-5">
              <h3 className="font-semibold text-slate-900 mb-4">New Catalog Item</h3>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm mb-3">{error}</div>}
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs text-slate-700 mb-1">Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={inp}/></div>
                <div><label className="block text-xs text-slate-700 mb-1">Code</label><input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} className={inp}/></div>
                <div><label className="block text-xs text-slate-700 mb-1">Category</label><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={inp}/></div>
                <div>
                  <label className="block text-xs text-slate-700 mb-1">Unit</label>
                  <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} className={inp}>
                    {['UN','KG','G','L','ML','M','M2','CX','PC','H'].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="block text-xs text-slate-700 mb-1">Description</label><input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className={inp}/></div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={()=>setShowForm(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={()=>createMutation.mutate(form)} disabled={!form.name||createMutation.isPending} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium disabled:opacity-60">
                  {createMutation.isPending ? 'Saving…' : 'Create Item'}
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items…" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"/>
            </div>
            <select value={category} onChange={e=>setCategory(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
              <option value="">All categories</option>
              {categories?.map((c: string) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Code','Name','Category','Unit','Last Price',''].map(h=>(
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm">Loading…</td></tr>}
                {!isLoading && (!data || data.length === 0) && (
                  <tr><td colSpan={6} className="text-center py-16">
                    <Package size={28} className="mx-auto text-slate-300 mb-2"/>
                    <p className="text-sm text-slate-500">No items found</p>
                  </td></tr>
                )}
                {data?.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.code || '—'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{item.category || '—'}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.unit}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.lastPrice ? `R$ ${Number(item.lastPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}</td>
                    <td className="px-4 py-3">
                      <a href={`/analytics/item-price-history?itemId=${item.id}`} className="text-xs text-blue-600 hover:underline">Price history</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
