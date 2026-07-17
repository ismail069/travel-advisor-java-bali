'use client';

import Link from 'next/link';
import { Languages, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const navigation = {
  id: {
    tagline: 'Panduan perjalanan Jawa dan Bali', homeLabel: 'JawaBali Trip - Beranda', navLabel: 'Navigasi utama', mobileLabel: 'Navigasi mobile', open: 'Buka menu', close: 'Tutup menu',
    links: [['/', 'Beranda'], ['/destinasi?pulau=Java', 'Panduan Jawa'], ['/id/bali', 'Panduan Bali'], ['/docs', 'Dokumentasi'], ['/trip-assistant', 'TripAssistant AI']]
  },
  en: {
    tagline: 'Independent Java and Bali travel guides', homeLabel: 'JawaBali Trip - Home', navLabel: 'Main navigation', mobileLabel: 'Mobile navigation', open: 'Open menu', close: 'Close menu',
    links: [['/en', 'Home'], ['/destinasi?pulau=Java', 'Java Guides'], ['/en/bali', 'Bali Guides'], ['/docs', 'Docs'], ['/trip-assistant', 'TripAssistant']]
  }
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'id';
  const copy = navigation[locale];
  const targetLocale = locale === 'en' ? 'id' : 'en';
  const localizedPath = /^\/(id|en)(?=\/|$)/.test(pathname)
    ? pathname.replace(/^\/(id|en)(?=\/|$)/, `/${targetLocale}`)
    : targetLocale === 'en' ? '/en/bali' : '/id/bali';
  const languageLabel = targetLocale === 'en' ? 'EN · English' : 'ID · Indonesia';

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6">
        <Link href={locale === 'en' ? '/en' : '/'} className="min-w-0 shrink-0" aria-label={copy.homeLabel}>
          <span className="block text-lg font-black text-primary">JawaBali Trip</span>
          <span className="hidden text-xs text-slate-500 sm:block">{copy.tagline}</span>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <nav className="flex items-center gap-1" aria-label={copy.navLabel}>
            {copy.links.map(([href, label], index) => <Link key={`${href}-${index}`} href={href} className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-bold text-slate-700 hover:bg-primary/10 hover:text-primary">{label}</Link>)}
          </nav>
          <Link href={localizedPath} hrefLang={targetLocale} lang={targetLocale} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-black text-primary transition hover:border-primary hover:bg-primary/10" aria-label={targetLocale === 'en' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}>
            <Languages aria-hidden="true" className="h-4 w-4" />
            <span className="hidden lg:inline">{languageLabel}</span>
            <span className="lg:hidden">{targetLocale.toUpperCase()}</span>
          </Link>
        </div>
        <button type="button" className="rounded-lg p-2 md:hidden" aria-label={open ? copy.close : copy.open} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="grid border-t border-slate-200 bg-white px-4 py-3 md:hidden" aria-label={copy.mobileLabel}>
        {copy.links.map(([href, label], index) => <Link key={`${href}-${index}`} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-bold text-slate-700 hover:bg-primary/10">{label}</Link>)}
        <Link href={localizedPath} hrefLang={targetLocale} lang={targetLocale} onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-3 font-black text-primary">
          <Languages aria-hidden="true" className="h-5 w-5" /> {languageLabel}
        </Link>
      </nav>}
    </header>
  );
}
