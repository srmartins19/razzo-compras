'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suppliersApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

const schema = z.object({
  name:          z.string().min(2),
  email:         z.string().email(),
  contactName:   z.string().optional(),
  phone:         z.string().optional(),
  taxId:         z.string().optional(),
  website:       z.string().url().optional().or(z.literal('')),
  country:       z.string().optional(),
  enablePortal:  z.boolean().default(false),
});
type FormData = z.infer<typeof schema>;

const CATS = ['MRO','TI & Tecnologia','Serviços','Logística','Equipamentos','Materiais','Outros'];

export default function NewSupplierPage() {
  const router = useRouter();
  const [cats,  setCats]  = useState<string[]>([]);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { enablePortal: false },
  });
  const enablePortal = watch('enablePortal');

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await suppliersApi.create({ ...data, categories: cats });
      router.push('/suppliers');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create supplier');
    }
  };

  const inp = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar title="Add Supplier" subtitle="Register a new supplier in your base" />
        <main className="flex-1 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-slate-900">Company Information</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                <input {...register('name')} className={inp}/>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input {...register('email')} type="email" className={inp}/>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input {...register('phone')} className={inp} placeholder="(11) 9xxxx-xxxx"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                  <input {...register('contactName')} className={inp}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ / Tax ID</label>
                  <input {...register('taxId')} className={inp} placeholder="XX.XXX.XXX/XXXX-XX"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                  <input {...register('website')} className={inp} placeholder="https://"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                  <input {...register('country')} className={inp} defaultValue="Brazil"/>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-3">Supply Categories</h2>
              <div className="flex flex-wrap gap-2">
                {CATS.map(cat => (
                  <button key={cat} type="button"
                    onClick={() => setCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${cats.includes(cat) ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Portal access */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">Portal Access</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Allow this supplier to submit bids through the portal</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('enablePortal')} className="sr-only peer"/>
                  <div className="w-11 h-6 bg-slate-200 peer-checked:bg-blue-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"/>
                </label>
              </div>
              {enablePortal && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <p className="font-medium">Portal access will be activated</p>
                  <p className="text-xs mt-0.5 text-blue-600">Default password: <code className="bg-blue-100 px-1 rounded">supplier123!</code> — supplier should change on first login.</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => router.back()} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#163050] text-white rounded-lg text-sm font-medium disabled:opacity-60">
                {isSubmitting ? 'Saving…' : 'Add Supplier'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
