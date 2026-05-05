'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/screens/ceo-command-dashboard', label: 'Command' },
  { href: '/screens/analytics', label: 'Analytics' },
  { href: '/screens/competitor', label: 'Competitor' },
  { href: '/screens/creative-studio', label: 'Creative Studio' },
  { href: '/screens/war-room', label: 'War Room' },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-2xl border-b border-white/10">
      <div className="flex items-center justify-between px-8 h-14 w-full max-w-screen-2xl mx-auto">
        {/* Left: Logo + Nav links */}
        <div className="flex items-center gap-12">
          <Link href="/" className="text-xl font-bold text-white tracking-tighter uppercase">
            YVON
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-tight">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? 'text-white border-b-2 border-[#0071e3] pb-1'
                      : 'text-white/50 hover:text-white transition-colors'
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Period toggle, notifications, user */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
            <span className="text-[11px] font-semibold text-white/70 uppercase tracking-widest">Monthly</span>
            <span className="material-symbols-outlined text-[16px] text-white/50">expand_more</span>
          </div>

          <button className="relative text-white/60 hover:text-white">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#0071e3] rounded-full" />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold text-white leading-none">S. MARCOS</p>
              <p className="text-[9px] text-white/40 uppercase tracking-tighter">Chief Executive</p>
            </div>
            <img
              alt="S. Marcos Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp2KDP24LQkpH0UjG4KmDFcJaAWfdlLgMcitL5N3KUSV4nj5QRgAGhE-dODwGvrei2d8Y4k7Q9csgNtTg0RcP0U310xBvtxdbBtu8_zHQ0xmW_fA09ne4pbHkdD1R3vPzp8v4xOMMhYo3beGlbUmXg4m-RbK4Dm3Nz11ioUK-YPenCJ9MZap68CDQ6jFXCpzxaIRV803v1R6V7ejPbHtxQMowH8czZ_O0ihmLU4ym5mb52CsEbhGXi-L6vBp8Zl4zse94gixXL0YJp"
              className="w-8 h-8 rounded-full border border-white/10 object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
