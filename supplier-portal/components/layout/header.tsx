'use client';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, FileText, CheckCircle, User, LayoutDashboard } from 'lucide-react';

export function PortalHeader() {
  const router   = useRouter();
  const pathname = usePathname();

  const supplier = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('supplier_data') || 'null')
    : null;

  const logout = () => {
    localStorage.removeItem('supplier_token');
    localStorage.removeItem('supplier_data');
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/bids',      label: 'My Bids',   icon: CheckCircle      },
    { href: '/profile',   label: 'Profile',   icon: User             },
  ];

  return (
    <header className="bg-[#0d2040] text-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">B</div>
          <span className="font-bold text-sm">BidFlow</span>
          <span className="text-white/30 text-xs hidden sm:inline">Supplier Portal</span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <a key={href} href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${active ? 'bg-blue-500/20 text-blue-400' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                <Icon size={13}/> {label}
              </a>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          {supplier && (
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-white/80">{supplier.name}</p>
              <p className="text-xs text-white/40">{supplier.email}</p>
            </div>
          )}
          <button onClick={logout} className="flex items-center gap-1.5 text-white/50 hover:text-red-400 text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">
            <LogOut size={13}/> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
