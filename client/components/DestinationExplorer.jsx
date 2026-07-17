'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import DestinationCard from './DestinationCard';

export default function DestinationExplorer({ destinations, initialIsland = '' }) {
  const [query, setQuery] = useState('');
  const [island, setIsland] = useState(initialIsland);
  const filtered = useMemo(() => destinations.filter((destination) => {
    const haystack = [destination.name, destination.name_id, destination.city, destination.province, destination.category_id, destination.category_en, destination.island].filter(Boolean).join(' ').toLowerCase();
    return (!query || haystack.includes(query.trim().toLowerCase())) && (!island || destination.island === island);
  }), [destinations, query, island]);
  const clear = () => { setQuery(''); setIsland(''); };

  return <>
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_190px_auto] md:items-center">
        <label className="relative block"><span className="sr-only">Cari destinasi</span><Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, kota, provinsi, atau kategori…" className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-11 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Hapus kata kunci" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-200"><X className="h-4 w-4" /></button>}</label>
        <label className="relative"><span className="sr-only">Pilih pulau</span><SlidersHorizontal aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><select value={island} onChange={(event) => setIsland(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-8 font-bold text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"><option value="">Jawa & Bali</option><option value="Java">Jawa</option><option value="Bali">Bali</option></select></label>
        <button type="button" onClick={clear} disabled={!query && !island} className="rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-black text-slate-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40">Reset</button>
      </div>
      <p className="mt-3 text-sm font-bold text-slate-500" aria-live="polite">{filtered.length} dari {destinations.length} destinasi ditampilkan</p>
    </div>
    {filtered.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((destination) => <DestinationCard key={destination.id} destination={destination} />)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">Destinasi tidak ditemukan. Coba kata kunci atau filter lain.</div>}
  </>;
}
