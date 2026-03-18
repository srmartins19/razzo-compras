'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await authApi.login(data);
      setAuth(res.data.user, res.data.accessToken);
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#1e3a5f]">BidFlow</h1>
              <p className="text-xs text-slate-500">Procurement Platform</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8] focus:border-transparent"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8] focus:border-transparent"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1e3a5f] hover:bg-[#163050] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{' '}
            <a href="/auth/register" className="text-[#2563a8] font-medium hover:underline">
              Start free trial
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
