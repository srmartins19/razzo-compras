'use client';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { useAuthStore } from '@/lib/store';
import { Check, Zap, Building2, Rocket } from 'lucide-react';

const PLANS = [
  {
    id:       'BASIC',
    name:     'Basic',
    price:    0,
    period:   'Free forever',
    icon:     Zap,
    color:    'border-slate-200',
    badge:    '',
    features: ['10 RFQs / month','20 suppliers','3 users','Email support','Basic analytics'],
  },
  {
    id:       'PRO',
    name:     'Pro',
    price:    299,
    period:   '/month',
    icon:     Rocket,
    color:    'border-blue-500',
    badge:    'Most popular',
    features: ['100 RFQs / month','200 suppliers','15 users','Reverse auctions','Price intelligence','Advanced analytics','Priority support'],
  },
  {
    id:       'ENTERPRISE',
    name:     'Enterprise',
    price:    999,
    period:   '/month',
    icon:     Building2,
    color:    'border-purple-500',
    badge:    '',
    features: ['Unlimited RFQs','Unlimited suppliers','Unlimited users','Custom integrations','ERP connectors','Dedicated CSM','SLA guarantee'],
  },
];

export default function BillingPage() {
  const user = useAuthStore(s => s.user);
  const currentPlan = user?.company?.plan || 'BASIC';

  const checkout = async (planId: string) => {
    if (planId === currentPlan) return;
    // TODO: call billing API to get Stripe checkout URL
    alert(`Redirecting to Stripe checkout for ${planId} plan… (not yet wired)`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar title="Billing" subtitle="Manage your plan and subscription"/>
        <main className="flex-1 p-6">
          {/* Current plan banner */}
          <div className="bg-[#1e3a5f] rounded-xl p-5 mb-8 flex items-center justify-between text-white">
            <div>
              <p className="text-white/60 text-xs">Current plan</p>
              <p className="text-xl font-bold mt-0.5">{currentPlan}</p>
              <p className="text-white/60 text-sm mt-1">
                {currentPlan === 'BASIC' ? 'Free tier' : 'Active subscription'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Company</p>
              <p className="font-semibold mt-0.5">{user?.company?.name}</p>
            </div>
          </div>

          {/* Plans grid */}
          <h2 className="text-lg font-bold text-slate-900 mb-5">Choose a plan</h2>
          <div className="grid grid-cols-3 gap-6">
            {PLANS.map(plan => {
              const isCurrent = plan.id === currentPlan;
              const Icon = plan.icon;
              return (
                <div key={plan.id} className={`bg-white rounded-2xl border-2 p-6 shadow-sm relative flex flex-col ${plan.color}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{plan.badge}</span>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Current</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.id === 'PRO' ? 'bg-blue-100' : plan.id === 'ENTERPRISE' ? 'bg-purple-100' : 'bg-slate-100'}`}>
                      <Icon size={20} className={plan.id === 'PRO' ? 'text-blue-600' : plan.id === 'ENTERPRISE' ? 'text-purple-600' : 'text-slate-600'}/>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                  </div>

                  <div className="mb-5">
                    <span className="text-3xl font-bold text-slate-900">
                      {plan.price === 0 ? 'Free' : `R$ ${plan.price.toLocaleString('pt-BR')}`}
                    </span>
                    {plan.price > 0 && <span className="text-slate-500 text-sm">{plan.period}</span>}
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Check size={14} className="text-green-500 flex-shrink-0"/>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => checkout(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : plan.id === 'PRO'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : plan.id === 'ENTERPRISE'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}>
                    {isCurrent ? 'Current plan' : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="mt-10 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Frequently asked questions</h3>
            <div className="space-y-4">
              {[
                ['Can I change plans later?', 'Yes, you can upgrade or downgrade at any time. Changes take effect on the next billing cycle.'],
                ['Is billing monthly or annually?', 'Plans are billed monthly. Annual plans with 2 months free are coming soon.'],
                ['What payment methods are accepted?', 'We accept credit cards, debit cards, and bank transfers via Stripe.'],
              ].map(([q, a]) => (
                <div key={q}>
                  <p className="font-medium text-slate-900 text-sm">{q}</p>
                  <p className="text-slate-500 text-sm mt-1">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
