'use client';

import Link from 'next/link';
import { MapPin, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

type Item = { slug: string; name: string; regency: string; province: string; category: string };

function normalize(value: string) {
  return value.toLocaleLowerCase('id-ID').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

export default function HomeDestinationSearch({ items, locale = 'id' }: { items: Item[]; locale?: string }) {
  const [query, setQuery] = useState('');
  const matches = useMemo(() => {
    const keyword = normalize(query.trim());
    if (!keyword) return [];
    return items.filter((item) => normalize([item.name, item.regency, item.province, item.category].join(' ')).includes(keyword)).slice(0, 6);
  }, [items, query]);

  const dict = {
    id: {
      find: "Temukan tujuanmu",
      search: "Cari destinasi Bali",
      placeholder: "Nama destinasi, tempat, kabupaten, atau kategori…",
      clear: "Hapus pencarian",
      notFound: "Destinasi tidak ditemukan. Coba kata kunci lain.",
      viewAll: "Lihat semua destinasi →"
    },
    en: {
      find: "Find your destination",
      search: "Search Bali destinations",
      placeholder: "Destination name, place, regency, or category…",
      clear: "Clear search",
      notFound: "No destinations found. Try another keyword.",
      viewAll: "View all destinations →"
    }
  };
  const copy = dict[locale as 'id' | 'en'] || dict.id;

  return <div className="relative z-20 mt-8 border-t border-slate-200 pt-8" role="search">
    <div className="grid gap-4 lg:grid-cols-[260px_1fr] lg:items-center">
      <div><p className="text-xs font-black uppercase tracking-[.16em] text-primary">{copy.find}</p><h2 className="mt-1 text-xl font-black text-slate-950">{copy.search}</h2></div>
      <label className="relative block"><span className="sr-only">{copy.search}</span><Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.placeholder} autoComplete="off" className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-12 text-base outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />{query && <button type="button" onClick={() => setQuery('')} aria-label={copy.clear} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-200"><X aria-hidden="true" className="h-4 w-4" /></button>}</label>
    </div>
    {query && <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg" aria-live="polite">{matches.length ? matches.map((item) => <Link key={item.slug} href={`/${locale}/bali/${item.slug}`} className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 transition last:border-0 hover:bg-primary/5"><span className="min-w-0"><span className="block truncate font-black text-slate-900">{item.name}</span><span className="mt-0.5 block truncate text-sm text-slate-500">{item.regency} · {item.category}</span></span><MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" /></Link>) : <p className="px-4 py-5 text-center text-sm text-slate-500">{copy.notFound}</p>}<Link href={`/${locale}/bali${query ? `?q=${encodeURIComponent(query)}` : ''}`} className="block bg-slate-50 px-4 py-3 text-center text-sm font-black text-primary hover:bg-primary/10">{copy.viewAll}</Link></div>}
  </div>;
}
