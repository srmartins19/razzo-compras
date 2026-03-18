'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, User, Mail, Phone, Building, Tag, Save, Key } from 'lucide-react';

export default function SupplierProfilePage() {
  const router = useRouter();
  const [supplier, setSupplier] = useState<any>(null);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [pwForm,   setPwForm]   = useState({ current: '', next: '', confirm: '' });
  const [pwError,  setPwError]  = useState('');
  const [pwSaved,  setPwSaved]  = useState(false);

  useEffect(() => {
    const sd = localStorage.getItem('supplier_data');
    if (!sd) { router.push('/auth/login'); return; }
    setSupplier(JSON.parse(sd));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // In a real implementation this would call PATCH /suppliers/:id
      // For now just update localStorage
      localStorage.setItem('supplier_data', JSON.stringify(supplier));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const handlePwChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.next.length < 8)   { setPwError('New password must be at least 8 characters'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match'); return; }
    // TODO: call POST /auth/change-password
    setPwSaved(true);
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwSaved(false), 3000);
  };

  if (!supplier) return null;

  const inp = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]';

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#0d2040] text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="text-white/60 hover:text-white">
            <ArrowLeft size={20}/>
          </button>
          <div>
            <p className="font-bold text-sm">My Profile</p>
            <p className="text-xs text-white/50">{supplier.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Company info */}
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <Building size={20} className="text-white"/>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Company Information</h2>
              <p className="text-xs text-slate-500">Update your contact details</p>
            </div>
          </div>

          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">
              ✓ Profile saved successfully
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Building size={12}/> Company Name
              </label>
              <input value={supplier.name || ''} onChange={e => setSupplier({...supplier, name: e.target.value})} className={inp}/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail size={12}/> Email
              </label>
              <input type="email" value={supplier.email || ''} onChange={e => setSupplier({...supplier, email: e.target.value})} className={inp}/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone size={12}/> Phone
              </label>
              <input value={supplier.phone || ''} onChange={e => setSupplier({...supplier, phone: e.target.value})} placeholder="(11) 9xxxx-xxxx" className={inp}/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <User size={12}/> Contact Name
              </label>
              <input value={supplier.contactName || ''} onChange={e => setSupplier({...supplier, contactName: e.target.value})} className={inp}/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tax ID (CNPJ)</label>
              <input value={supplier.taxId || ''} onChange={e => setSupplier({...supplier, taxId: e.target.value})} placeholder="XX.XXX.XXX/XXXX-XX" className={inp}/>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Website</label>
              <input value={supplier.website || ''} onChange={e => setSupplier({...supplier, website: e.target.value})} placeholder="https://yourcompany.com" className={inp}/>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 flex items-center gap-1.5">
              <Tag size={12}/> Supply Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {['MRO','TI & Tecnologia','Serviços','Logística','Equipamentos','Materiais','Outros'].map(cat => {
                const active = supplier.categories?.includes(cat);
                return (
                  <button key={cat} type="button"
                    onClick={() => {
                      const cats = supplier.categories || [];
                      setSupplier({...supplier, categories: active ? cats.filter((c: string) => c !== cat) : [...cats, cat]});
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${active ? 'bg-[#1e3a5f] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#163050] text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60">
              <Save size={14}/> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Change password */}
        <form onSubmit={handlePwChange} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Key size={18} className="text-amber-600"/>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Change Password</h2>
              <p className="text-xs text-slate-500">Minimum 8 characters</p>
            </div>
          </div>

          {pwError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">{pwError}</div>}
          {pwSaved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">✓ Password updated</div>}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Current Password</label>
            <input type="password" required value={pwForm.current} onChange={e => setPwForm({...pwForm, current: e.target.value})} className={inp}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">New Password</label>
              <input type="password" required value={pwForm.next} onChange={e => setPwForm({...pwForm, next: e.target.value})} className={inp}/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input type="password" required value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} className={inp}/>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors">
              <Key size={14}/> Update Password
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
