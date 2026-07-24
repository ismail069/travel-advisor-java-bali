'use client';

import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

type DestinationItem = {
  slug: string;
  name: string;
  province: string;
  regency: string;
  category: string;
  metaDescription: string;
  image?: string;
};

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

export function DestinationDirectory({ items, locale }: { items: DestinationItem[]; locale: 'id' | 'en' }) {
  const [query, setQuery] = useState('');
  const copy = locale === 'id'
    ? { label: 'Cari destinasi', placeholder: 'Cari nama destinasi, wilayah, atau kategori…', result: 'destinasi ditemukan', empty: 'Destinasi tidak ditemukan. Coba kata kunci lain.', clear: 'Hapus pencarian', read: 'Baca panduan' }
    : { label: 'Search destinations', placeholder: 'Search by destination, place, or category…', result: 'destinations found', empty: 'No destinations found. Try another keyword.', clear: 'Clear search', read: 'Read guide' };
  
  const filtered = useMemo(() => {
    const keyword = normalize(query.trim());
    if (!keyword) return items;
    return items.filter((item) => normalize([item.name, item.regency, item.province, item.category, item.metaDescription].join(' ')).includes(keyword));
  }, [items, query]);

  return <section className="mt-10" aria-label={copy.label}>
    <div className="rounded-full border border-slate-200 bg-white p-2 shadow-sm sm:flex sm:items-center sm:gap-3 dark:border-slate-800 dark:bg-slate-900">
      <label className="relative block flex-1">
        <span className="sr-only">{copy.label}</span>
        <Search aria-hidden="true" className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input 
          type="search" 
          value={query} 
          onChange={(event) => setQuery(event.target.value)} 
          placeholder={copy.placeholder} 
          className="w-full rounded-full border-none bg-slate-50 py-3.5 pl-14 pr-11 text-base outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:focus:bg-slate-900" 
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label={copy.clear} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </label>
      <p aria-live="polite" className="mt-3 hidden whitespace-nowrap px-4 text-sm font-bold text-slate-500 sm:mt-0 sm:block dark:text-slate-400">
        {filtered.length} {copy.result}
      </p>
    </div>
    
    <div className="mb-4 mt-6 sm:hidden">
      <p aria-live="polite" className="text-sm font-bold text-slate-500 dark:text-slate-400">{filtered.length} {copy.result}</p>
    </div>

    {filtered.length ? (
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.slug} className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <Link href={`/${locale}/bali/${item.slug}`} className="flex h-full flex-col">
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                {item.image ? (
                  <img src={item.image} alt={item.name} width="800" height="450" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 via-amber-50 to-emerald-100 px-6 text-center text-lg font-black text-slate-700 dark:from-primary-900/40 dark:via-slate-800 dark:to-emerald-900/40 dark:text-slate-300">
                    {item.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-slate-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                
                <div className="absolute left-4 top-4 flex flex-wrap gap-2 text-xs font-black">
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-primary shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:text-primary-400">
                    {item.regency}
                  </span>
                  <span className="rounded-full bg-slate-900/70 px-3 py-1.5 text-white shadow-sm backdrop-blur-md">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h2 className="text-2xl font-black tracking-tight transition-colors group-hover:text-primary dark:text-white">
                  {item.name}
                </h2>
                
                <p className="mt-4 line-clamp-3 flex-1 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.metaDescription}
                </p>
                
                <div className="mt-8 flex items-center gap-2 text-sm font-black text-primary transition-colors group-hover:text-primary-600 dark:text-primary-400">
                  {copy.read} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    ) : (
      <div className="mt-8 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
          <Search className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">{copy.empty}</p>
      </div>
    )}
  </section>;
}
