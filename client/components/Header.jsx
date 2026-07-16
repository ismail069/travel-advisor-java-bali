'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  ['/', 'Beranda'],
  ['/destinasi', 'Destinasi'],
  ['/panduan', 'Panduan'],
  ['/trip-assistant', 'TripAssistant AI']
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0" aria-label="JawaBali Trip - Beranda">
          <span className="block text-lg font-black text-primary">JawaBali Trip</span>
          <span className="hidden text-xs text-slate-500 sm:block">Panduan perjalanan Jawa dan Bali</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {links.map(([href, label]) => <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-primary/10 hover:text-primary">{label}</Link>)}
        </nav>
        <button type="button" className="rounded-lg p-2 md:hidden" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="grid border-t border-slate-200 bg-white px-4 py-3 md:hidden" aria-label="Navigasi mobile">
        {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-bold text-slate-700 hover:bg-primary/10">{label}</Link>)}
      </nav>}
    </header>
  );
}
