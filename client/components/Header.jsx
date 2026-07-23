'use client';

import Link from 'next/link';
import { Languages, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const navigation = {
  id: {
    tagline: 'Panduan perjalanan Jawa dan Bali', homeLabel: 'JawaBali Trip - Beranda', navLabel: 'Navigasi utama', mobileLabel: 'Navigasi mobile', open: 'Buka menu', close: 'Tutup menu',
    links: [['/', 'Beranda'], ['/id/jawa', 'Panduan Jawa'], ['/id/bali', 'Panduan Bali'], ['/id/trip-assistant', 'TripAssistant AI']]
  },
  en: {
    tagline: 'Independent Java and Bali travel guides', homeLabel: 'JawaBali Trip - Home', navLabel: 'Main navigation', mobileLabel: 'Mobile navigation', open: 'Open menu', close: 'Close menu',
    links: [['/en', 'Home'], ['/en/jawa', 'Java Guides'], ['/en/bali', 'Bali Guides'], ['/en/trip-assistant', 'TripAssistant']]
  }
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const pathname = usePathname();
  const locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'id';
  const copy = navigation[locale];
  const targetLocale = locale === 'en' ? 'id' : 'en';
  const localizedPath = /^\/(id|en)(?=\/|$)/.test(pathname)
    ? pathname.replace(/^\/(id|en)(?=\/|$)/, `/${targetLocale}`)
    : targetLocale === 'en' ? '/en/bali' : '/id/bali';
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light'));
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.style.colorScheme = next;
    localStorage.setItem('jawabali-theme', next);
    setTheme(next);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6">
        <Link href={locale === 'en' ? '/en' : '/'} className="min-w-0 shrink-0" aria-label={copy.homeLabel}>
          <span className="block text-lg font-black text-primary">JawaBali Trip</span>
          <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">{copy.tagline}</span>
        </Link>
        <div className="hidden items-center gap-2 lg:flex">
          <nav className="flex items-center gap-1" aria-label={copy.navLabel}>
            {copy.links.map(([href, label], index) => <Link key={`${href}-${index}`} href={href} className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-bold text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-200">{label}</Link>)}
          </nav>
          <div className="ml-1 flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <span className="hidden items-center gap-1.5 pl-2 text-xs font-bold text-slate-600 dark:text-slate-300 xl:flex"><Languages className="h-4 w-4" aria-hidden="true" /> Language</span>
            <div className="flex rounded-full bg-slate-100 p-1 dark:bg-slate-800" aria-label={locale === 'id' ? 'Pilih bahasa' : 'Choose language'}>
              <Link href={locale === 'id' ? pathname : localizedPath} hrefLang="id" className={`rounded-full px-3 py-1.5 text-xs font-black transition ${locale === 'id' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`} aria-current={locale === 'id' ? 'page' : undefined}>ID</Link>
              <Link href={locale === 'en' ? pathname : localizedPath} hrefLang="en" className={`rounded-full px-3 py-1.5 text-xs font-black transition ${locale === 'en' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`} aria-current={locale === 'en' ? 'page' : undefined}>EN</Link>
            </div>
            <button type="button" onClick={toggleTheme} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200" aria-label={theme === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap'}>
              {theme === 'dark' ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
              <span className="hidden xl:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>
        <button type="button" className="rounded-lg p-2 text-slate-800 dark:text-slate-100 lg:hidden" aria-label={open ? copy.close : copy.open} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="grid border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 lg:hidden" aria-label={copy.mobileLabel}>
        {copy.links.map(([href, label], index) => <Link key={`${href}-${index}`} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-bold text-slate-700 hover:bg-primary/10 dark:text-slate-200">{label}</Link>)}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-2 dark:border-slate-700">
          <div className="flex rounded-full bg-slate-100 p-1 dark:bg-slate-800"><Link href={locale === 'id' ? pathname : localizedPath} onClick={() => setOpen(false)} className={`rounded-full px-4 py-2 text-sm font-black ${locale === 'id' ? 'bg-primary text-white' : 'dark:text-slate-200'}`}>ID</Link><Link href={locale === 'en' ? pathname : localizedPath} onClick={() => setOpen(false)} className={`rounded-full px-4 py-2 text-sm font-black ${locale === 'en' ? 'bg-primary text-white' : 'dark:text-slate-200'}`}>EN</Link></div>
          <button type="button" onClick={toggleTheme} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold dark:border-slate-700 dark:text-slate-200">{theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}{theme === 'dark' ? 'Dark' : 'Light'}</button>
        </div>
      </nav>}
    </header>
  );
}
