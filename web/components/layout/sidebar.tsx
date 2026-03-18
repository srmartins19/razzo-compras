'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, ShoppingCart, BarChart2, Zap, Settings, LogOut, Package } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Procurement',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/rfqs',      label: 'RFQs',       icon: FileText        },
      { href: '/orders',    label: 'Orders',     icon: ShoppingCart    },
    ],
  },
  {
    label: 'Master Data',
    items: [
      { href: '/suppliers', label: 'Suppliers', icon: Users    },
      { href: '/items',     label: 'Catalog',   icon: Package  },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/billing',  label: 'Billing',  icon: Zap      },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-60 h-screen bg-[#0d2040] flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0">B</div>
          <span className="text-white font-bold text-base tracking-tight">BidFlow</span>
        </div>
        {user?.company && (
          <p className="text-white/40 text-xs mt-1.5 truncate">{user.company.name}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label} className="mb-4">
            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-2 mb-1">{group.label}</p>
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5',
                    active
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-white/55 hover:bg-white/8 hover:text-white/90',
                  )}>
                  <Icon size={16} strokeWidth={1.8}/>
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/90 text-xs font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-white/40 text-xs">{user?.role}</p>
          </div>
          <button onClick={logout} className="text-white/40 hover:text-red-400 transition-colors" title="Sign out">
            <LogOut size={14}/>
          </button>
        </div>
      </div>
    </aside>
  );
}
