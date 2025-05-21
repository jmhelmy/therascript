// src/components/TopNav.tsx 
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} legacyBehavior>
      <a className={`px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'text-sky-700 font-semibold' : 'text-slate-600 hover:text-sky-700'}`}>
        {children}
      </a>
    </Link>
  );
};

export const TopNav = () => {
  return (
    <nav className="flex items-center justify-center p-4 mb-6 bg-white shadow-sm"> {/* Centered navigation */}
      <div className="flex space-x-4">
        <NavLink href="/account">Account</NavLink>
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/session/record">New Session</NavLink>
      </div>
    </nav>
  );
};