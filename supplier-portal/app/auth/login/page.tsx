'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function SupplierLoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState('');
  const [pass,  setPass]      = useState('');
  const [error, setError]     = useState('');
  const [busy,  setBusy]      = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000/api/v1'}/auth/supplier/login`,
        { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password:pass}) }
      );
      const d = await res.json();
      if (!res.ok) throw new Error(Array.isArray(d.message)?d.message[0]:d.message);
      localStorage.setItem('supplier_token', d.accessToken);
      localStorage.setItem('supplier_data',  JSON.stringify(d.supplier));
      router.push('/dashboard');
    } catch(err:any) { setError(err.message||'Login failed'); }
    finally { setBusy(false); }
  };
  const inp = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]';
  return (
    <div className="min-h-screen bg-[#0d2040] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Supplier Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to view RFQs and submit bids</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className={inp}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" required value={pass} onChange={e=>setPass(e.target.value)} className={inp}/>
          </div>
          <button type="submit" disabled={busy}
            className="w-full bg-[#1e3a5f] hover:bg-[#163050] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-6">Portal access provided by your procurement team.</p>
      </div>
    </div>
  );
}
