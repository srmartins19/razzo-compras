'use client';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Save, Building, Bell, Shield, Palette, Globe } from 'lucide-react';

type Tab = 'company' | 'notifications' | 'security' | 'appearance';

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'company',       label: 'Company',       icon: Building },
  { id: 'notifications', label: 'Notifications', icon: Bell     },
  { id: 'security',      label: 'Security',      icon: Shield   },
  { id: 'appearance',    label: 'Appearance',    icon: Palette  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('company');
  const [saved, setSaved] = useState(false);
  const user = useAuthStore(s => s.user);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inp = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <div className="flex-1 ml-60 flex flex-col">
        <Topbar title="Settings" subtitle="Manage your account and workspace"/>
        <main className="flex-1 p-6">
          <div className="flex gap-6 max-w-4xl">
            {/* Tab list */}
            <div className="w-48 flex-shrink-0">
              <nav className="space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === id ? 'bg-[#1e3a5f] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <Icon size={16}/> {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              {saved && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
                  ✓ Settings saved successfully
                </div>
              )}

              {activeTab === 'company' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <h2 className="font-semibold text-slate-900">Company Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Company Name</label>
                      <input defaultValue={user?.company?.name} className={inp}/>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Slug (URL identifier)</label>
                      <input defaultValue={user?.company?.slug} className={inp}/>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Primary Email</label>
                      <input type="email" defaultValue={user?.email} className={inp}/>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                      <input className={inp} placeholder="(11) 3333-4444"/>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Website</label>
                      <input className={inp} placeholder="https://yourcompany.com"/>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleSave} className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#163050] text-white font-medium px-5 py-2.5 rounded-lg text-sm">
                      <Save size={14}/> Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <h2 className="font-semibold text-slate-900">Notification Preferences</h2>
                  {[
                    ['New bid received',         'When a supplier submits a bid on your RFQ'],
                    ['RFQ deadline approaching', '48 hours before RFQ deadline'],
                    ['Order approved',           'When a PO is approved by an approver'],
                    ['Order received',           'When goods are confirmed as received'],
                    ['Supplier invitation',      'When a new supplier is invited to portal'],
                    ['Weekly digest',            'Summary of procurement activity every Monday'],
                  ].map(([label, desc]) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer"/>
                        <div className="w-9 h-5 bg-slate-200 peer-checked:bg-blue-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4"/>
                      </label>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <button onClick={handleSave} className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#163050] text-white font-medium px-5 py-2.5 rounded-lg text-sm">
                      <Save size={14}/> Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <h2 className="font-semibold text-slate-900">Security Settings</h2>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Change Password</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-700 mb-1">Current Password</label>
                        <input type="password" className={inp}/>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-700 mb-1">New Password</label>
                          <input type="password" className={inp}/>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-700 mb-1">Confirm Password</label>
                          <input type="password" className={inp}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Active Sessions</h3>
                    <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                      <div className="flex justify-between items-center">
                        <span>Current session · {navigator.userAgent?.split(' ').pop()?.split('/')[0] || 'Browser'}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleSave} className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#163050] text-white font-medium px-5 py-2.5 rounded-lg text-sm">
                      <Save size={14}/> Update Password
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <h2 className="font-semibold text-slate-900">Appearance</h2>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-3">Language</p>
                    <select className={`${inp} w-48`}>
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-3">Currency Display</p>
                    <select className={`${inp} w-48`}>
                      <option value="BRL">BRL — Real Brasileiro</option>
                      <option value="USD">USD — US Dollar</option>
                      <option value="EUR">EUR — Euro</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-3">Date Format</p>
                    <div className="flex gap-3">
                      {['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD'].map(f => (
                        <label key={f} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="radio" name="dateFormat" defaultChecked={f === 'DD/MM/YYYY'} className="accent-[#1e3a5f]"/>
                          {f}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleSave} className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#163050] text-white font-medium px-5 py-2.5 rounded-lg text-sm">
                      <Save size={14}/> Save Appearance
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
