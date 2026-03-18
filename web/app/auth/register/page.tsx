'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, 'Min 8 characters'),
  companyName: z.string().min(3),
  companySlug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await authApi.register(data);
      router.push('/auth/login?registered=true');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl text-[#1e3a5f]">BidFlow</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Start your free trial</h2>
          <p className="text-slate-500 text-sm mb-6">No credit card required</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                <input {...register('firstName')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]" />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                <input {...register('lastName')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work email</label>
              <input {...register('email')} type="email" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input {...register('password')} type="password" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company name</label>
              <input {...register('companyName')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563a8]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company slug <span className="text-slate-400 font-normal">(URL identifier)</span></label>
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#2563a8]">
                <span className="bg-slate-50 px-3 py-2.5 text-sm text-slate-500 border-r border-slate-300">bidflow.app/</span>
                <input {...register('companySlug')} placeholder="my-company" className="flex-1 px-3 py-2.5 text-sm outline-none" />
              </div>
              {errors.companySlug && <p className="text-red-500 text-xs mt-1">{errors.companySlug.message}</p>}
            </div>
            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-[#1e3a5f] hover:bg-[#163050] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60 mt-2"
            >
              {isSubmitting ? 'Creating account...' : 'Create free account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <a href="/auth/login" className="text-[#2563a8] font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
