'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { rfqsApi } from '@/lib/api';
import { Topbar } from '@/components/layout/topbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Plus, Trash2 } from 'lucide-react';

const itemSchema = z.object({
  name: z.string().min(1, 'Required'),
  quantity: z.number({ coerce: true }).positive(),
  unit: z.string().default('UN'),
  estimatedPrice: z.number({ coerce: true }).optional(),
});

const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  deadline: z.string().min(1, 'Required'),
  deliveryDate: z.string().optional(),
  deliveryAddress: z.string().optional(),
  paymentTerms: z.string().optional(),
  currency: z.string().default('BRL'),
  auctionEnabled: z.boolean().default(false),
  auctionEndTime: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one item required'),
});

type FormData = z.infer<typeof schema>;

export default function NewRfqPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'BRL', auctionEnabled: false, items: [{ name: '', quantity: 1, unit: 'UN' }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const auctionEnabled = watch('auctionEnabled');

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await rfqsApi.create(data);
      router.push(`/rfqs/${res.data.id}`);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create RFQ');
    }
  };

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar title="New RFQ" subtitle="Create a request for quotation" />
        <main className="flex-1 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

            {/* Basic info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-slate-900">RFQ Details</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input {...register('title')} placeholder="e.g. IT Equipment Q3 2024" className={inputClass} />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea {...register('description')} rows={3} placeholder="Describe the procurement scope..." className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bid Deadline *</label>
                  <input {...register('deadline')} type="datetime-local" className={inputClass} />
                  {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expected Delivery</label>
                  <input {...register('deliveryDate')} type="date" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payment Terms</label>
                  <input {...register('paymentTerms')} placeholder="e.g. 30 days net" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                  <select {...register('currency')} className={inputClass}>
                    {['BRL','USD','EUR'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
                <input {...register('deliveryAddress')} placeholder="Delivery location" className={inputClass} />
              </div>
            </div>

            {/* Auction settings */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">Reverse Auction</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Allow suppliers to update bids until auction ends</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('auctionEnabled')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-checked:bg-blue-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
              {auctionEnabled && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Auction End Time *</label>
                  <input {...register('auctionEndTime')} type="datetime-local" className={inputClass} />
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">Items ({fields.length})</h2>
                <button type="button" onClick={() => append({ name: '', quantity: 1, unit: 'UN' })}
                  className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:text-blue-700">
                  <Plus size={15} /> Add item
                </button>
              </div>
              {errors.items?.root && <p className="text-red-500 text-xs mb-3">{errors.items.root.message}</p>}

              <div className="space-y-3">
                {fields.map((field, i) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-5">
                      {i === 0 && <label className="block text-xs text-slate-500 mb-1">Item name *</label>}
                      <input {...register(`items.${i}.name`)} placeholder="Description" className={inputClass} />
                    </div>
                    <div className="col-span-2">
                      {i === 0 && <label className="block text-xs text-slate-500 mb-1">Qty *</label>}
                      <input {...register(`items.${i}.quantity`)} type="number" min="0.001" step="0.001" placeholder="1" className={inputClass} />
                    </div>
                    <div className="col-span-2">
                      {i === 0 && <label className="block text-xs text-slate-500 mb-1">Unit</label>}
                      <select {...register(`items.${i}.unit`)} className={inputClass}>
                        {['UN','KG','L','M','M2','CX','PC','H'].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      {i === 0 && <label className="block text-xs text-slate-500 mb-1">Est. price</label>}
                      <input {...register(`items.${i}.estimatedPrice`)} type="number" placeholder="0.00" step="0.01" className={inputClass} />
                    </div>
                    <div className="col-span-1 flex items-end pb-0.5">
                      {i === 0 && <div className="h-5 mb-1" />}
                      <button type="button" onClick={() => fields.length > 1 && remove(i)}
                        disabled={fields.length <= 1}
                        className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button type="button" onClick={() => router.back()} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#163050] text-white rounded-lg text-sm font-medium disabled:opacity-60">
                {isSubmitting ? 'Creating...' : 'Create RFQ'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
