'use client';

import { useMemo, useState } from 'react';
import DestinationCard from './DestinationCard';

export default function DestinationExplorer({ destinations }) {
  const [query, setQuery] = useState('');
  const [island, setIsland] = useState('');
  const filtered = useMemo(() => destinations.filter((destination) => {
    const haystack = `${destination.name} ${destination.name_id} ${destination.city} ${destination.province} ${destination.category_id}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (!island || destination.island === island);
  }), [destinations, query, island]);
  return <><div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_180px]"><label><span className="sr-only">Cari destinasi</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, kota, atau kategori…" className="w-full rounded-xl border border-slate-300 px-4 py-3" /></label><label><span className="sr-only">Pilih pulau</span><select value={island} onChange={(event) => setIsland(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3"><option value="">Jawa & Bali</option><option value="Java">Jawa</option><option value="Bali">Bali</option></select></label></div>{filtered.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((destination) => <DestinationCard key={destination.id} destination={destination} />)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">Destinasi tidak ditemukan. Coba kata kunci lain.</div>}</>;
}
