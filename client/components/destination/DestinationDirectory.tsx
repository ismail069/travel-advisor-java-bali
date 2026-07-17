'use client';

import Link from 'next/link';
import { Search, X } from 'lucide-react';
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
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex sm:items-center sm:gap-3">
      <label className="relative block flex-1">
        <span className="sr-only">{copy.label}</span>
        <Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.placeholder} className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-11 text-base outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />
        {query && <button type="button" onClick={() => setQuery('')} aria-label={copy.clear} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-200"><X aria-hidden="true" className="h-4 w-4" /></button>}
      </label>
      <p aria-live="polite" className="mt-2 whitespace-nowrap px-2 text-sm font-bold text-slate-500 sm:mt-0">{filtered.length} {copy.result}</p>
    </div>
    {filtered.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <article key={item.slug} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <Link href={`/${locale}/bali/${item.slug}`}>
        {item.image ? <img src={item.image} alt={item.name} width="800" height="450" className="aspect-video w-full object-cover" /> : <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-violet-100 via-amber-50 to-emerald-100 px-6 text-center text-lg font-black text-slate-700">{item.name}</div>}
        <div className="p-5"><p className="text-xs font-black uppercase tracking-wider text-primary">{item.regency} · {item.category}</p><h2 className="mt-2 text-xl font-black">{item.name}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.metaDescription}</p><span className="mt-5 inline-block font-black text-primary">{copy.read} →</span></div>
      </Link>
    </article>)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">{copy.empty}</div>}
  </section>;
}
