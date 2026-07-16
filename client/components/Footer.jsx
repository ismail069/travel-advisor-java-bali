import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';

const legal = [
  ['/tentang', 'Tentang'], ['/kontak', 'Kontak'], ['/kebijakan-privasi', 'Privasi'],
  ['/kebijakan-cookie', 'Cookie'], ['/ketentuan', 'Ketentuan'], ['/disclaimer', 'Disclaimer'],
  ['/kebijakan-editorial', 'Editorial']
];

export default function Footer() {
  return <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-300">
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr]">
      <div><p className="text-xl font-black text-white">JawaBali Trip</p><p className="mt-3 max-w-xl text-sm leading-6">Panduan perjalanan independen yang dikelola Ismail untuk membantu wisatawan merencanakan perjalanan di Jawa dan Bali secara lebih jelas.</p><a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-block text-sm font-bold text-fuchsia-300">{CONTACT_EMAIL}</a></div>
      <nav className="grid grid-cols-2 gap-3 text-sm" aria-label="Informasi situs">{legal.map(([href, label]) => <Link key={href} href={href} className="hover:text-white">{label}</Link>)}</nav>
    </div>
    <div className="border-t border-white/10 px-4 py-5 text-center text-xs">© {new Date().getFullYear()} JawaBali Trip · Dikelola secara personal oleh Ismail.</div>
  </footer>;
}
