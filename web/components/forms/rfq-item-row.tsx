'use client';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Trash2 } from 'lucide-react';

const UNITS = ['UN','KG','G','L','ML','M','M2','M3','CX','PC','PAR','H'];

interface RfqItemRowProps {
  index:      number;
  register:   UseFormRegister<any>;
  errors?:    FieldErrors<any>;
  onRemove:   () => void;
  canRemove:  boolean;
  showLabels: boolean;
}

export function RfqItemRow({ index, register, errors, onRemove, canRemove, showLabels }: RfqItemRowProps) {
  const inp = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]/30';
  const err = errors?.items?.[index];

  return (
    <div className="grid grid-cols-12 gap-2 items-start">
      <div className="col-span-5">
        {showLabels && <label className="block text-xs text-slate-500 mb-1">Item description *</label>}
        <input {...register(`items.${index}.name`)} placeholder="Item name or description" className={inp}/>
        {err?.name && <p className="text-red-500 text-xs mt-0.5">{err.name.message as string}</p>}
      </div>
      <div className="col-span-2">
        {showLabels && <label className="block text-xs text-slate-500 mb-1">Quantity *</label>}
        <input {...register(`items.${index}.quantity`)} type="number" min="0.001" step="any" placeholder="1" className={inp}/>
      </div>
      <div className="col-span-2">
        {showLabels && <label className="block text-xs text-slate-500 mb-1">Unit</label>}
        <select {...register(`items.${index}.unit`)} className={inp}>
          {UNITS.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
      <div className="col-span-2">
        {showLabels && <label className="block text-xs text-slate-500 mb-1">Est. price</label>}
        <input {...register(`items.${index}.estimatedPrice`)} type="number" step="0.01" min="0" placeholder="0.00" className={inp}/>
      </div>
      <div className={`col-span-1 flex items-end ${showLabels ? 'pb-0.5' : ''}`}>
        {showLabels && <div className="h-5 mb-1"/>}
        <button type="button" onClick={onRemove} disabled={!canRemove}
          className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors rounded-lg hover:bg-red-50">
          <Trash2 size={14}/>
        </button>
      </div>
    </div>
  );
}
