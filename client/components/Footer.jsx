'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONTACT_EMAIL } from '@/lib/site';

const legal = [
  ['/tentang', 'Tentang'], ['/kontak', 'Kontak'], ['/kebijakan-privasi', 'Privasi'],
  ['/kebijakan-cookie', 'Cookie'], ['/ketentuan', 'Ketentuan'], ['/disclaimer', 'Disclaimer'],
  ['/kebijakan-editorial', 'Editorial'], ['/atribusi-gambar', 'Atribusi gambar']
];

export default function Footer() {
  const pathname = usePathname();
  const english = pathname === '/en' || pathname.startsWith('/en/');
  const links = english ? [
    [`/en/tentang`, 'About'], [`/en/kontak`, 'Contact'], [`/en/kebijakan-privasi`, 'Privacy'],
    [`/en/kebijakan-cookie`, 'Cookies'], [`/en/ketentuan`, 'Terms'], [`/en/disclaimer`, 'Disclaimer'],
    [`/en/kebijakan-editorial`, 'Editorial Policy'], [`/en/atribusi-gambar`, 'Image Credits']
  ] : [
    [`/id/tentang`, 'Tentang'], [`/id/kontak`, 'Kontak'], [`/id/kebijakan-privasi`, 'Privasi'],
    [`/id/kebijakan-cookie`, 'Cookie'], [`/id/ketentuan`, 'Ketentuan'], [`/id/disclaimer`, 'Disclaimer'],
    [`/id/kebijakan-editorial`, 'Editorial'], [`/id/atribusi-gambar`, 'Atribusi gambar']
  ];
  return <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-400">
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr]">
      <div>
        <p className="text-2xl font-black text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-fuchsia-400">JawaBali</span> Trip
        </p>
        <p className="mt-4 max-w-xl text-base leading-relaxed">
          {english ? 'Independent travel guides managed by the JawaBali Trip Team to help travelers plan clearer trips across Java and Bali.' : 'Panduan perjalanan independen yang dikelola tim JawaBali Trip untuk membantu wisatawan merencanakan perjalanan di Jawa dan Bali secara lebih jelas dan terstruktur.'}
        </p>

      </div>
      <nav className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm font-medium" aria-label={english ? 'Site information' : 'Informasi situs'}>
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="transition-colors hover:text-primary-400">
            {label}
          </Link>
        ))}
      </nav>
    </div>
    <div className="border-t border-slate-800/60 px-4 py-6 text-center text-sm">
      © {new Date().getFullYear()} JawaBali Trip · {english ? 'Managed by the JawaBali Trip Team.' : 'Dikelola oleh tim JawaBali Trip.'}
    </div>
  </footer>;
}
