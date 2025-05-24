'use client';

import Link from 'next/link';

export const TopNav = () => {
  return (
    <header className="bg-white shadow-sm px-4 py-3 mb-6 border-b">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-[#009DA3]">TheraNote</Link>
        <Link
          href="/logout"
          className="text-sm text-gray-600 hover:text-[#009DA3] transition"
        >
          Log out
        </Link>
      </div>
    </header>
  );
};
