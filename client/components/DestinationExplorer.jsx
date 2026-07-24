'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import DestinationCard from './DestinationCard';

export default function DestinationExplorer({ destinations, initialIsland = '', hideIslandFilter = false, locale = 'id' }) {
  const isEn = locale === 'en';
  const [query, setQuery] = useState('');
  const [island, setIsland] = useState(initialIsland);
  const filtered = useMemo(() => destinations.filter((destination) => {
    const haystack = [destination.name, destination.name_id, destination.city, destination.province, destination.category_id, destination.category_en, destination.island].filter(Boolean).join(' ').toLowerCase();
    return (!query || haystack.includes(query.trim().toLowerCase())) && (!island || destination.island === island);
  }), [destinations, query, island]);
  const clear = () => { setQuery(''); setIsland(''); };

  const placeholderText = isEn ? "Search name, city, province, or category..." : "Cari nama, kota, provinsi, atau kategori…";
  const searchLabel = isEn ? "Search destinations" : "Cari destinasi";
  const clearLabel = isEn ? "Clear keyword" : "Hapus kata kunci";
  const islandLabel = isEn ? "Choose island" : "Pilih pulau";
  const javaBaliLabel = isEn ? "Java & Bali" : "Jawa & Bali";
  const javaLabel = isEn ? "Java" : "Jawa";
  const baliLabel = isEn ? "Bali" : "Bali";
  const resetLabel = isEn ? "Reset" : "Reset";
  const countLabel = isEn ? `Showing ${filtered.length} of ${destinations.length} destinations` : `${filtered.length} dari ${destinations.length} destinasi ditampilkan`;
  const notFoundText = isEn ? "No destinations found. Try different keywords or filters." : "Destinasi tidak ditemukan. Coba kata kunci atau filter lain.";

  return <>
    {hideIslandFilter ? (
      <div className="rounded-full border border-slate-200 bg-white p-2 shadow-sm sm:flex sm:items-center sm:gap-3 dark:border-slate-800 dark:bg-slate-900">
        <label className="relative block flex-1">
          <span className="sr-only">{searchLabel}</span>
          <Search aria-hidden="true" className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input 
            type="search" 
            value={query} 
            onChange={(event) => setQuery(event.target.value)} 
            placeholder={placeholderText} 
            className="w-full rounded-full border-none bg-slate-50 py-3.5 pl-14 pr-11 text-base outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:focus:bg-slate-900" 
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label={clearLabel} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </label>
        <p aria-live="polite" className="mt-3 hidden whitespace-nowrap px-4 text-sm font-bold text-slate-500 sm:mt-0 sm:block dark:text-slate-400">{countLabel}</p>
      </div>
    ) : (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-center">
          <label className="relative block">
            <span className="sr-only">{searchLabel}</span>
            <Search aria-hidden="true" className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input 
              type="search" 
              value={query} 
              onChange={(event) => setQuery(event.target.value)} 
              placeholder={placeholderText} 
              className="w-full rounded-full border-none bg-slate-50 py-4 pl-14 pr-11 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:focus:bg-slate-900" 
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label={clearLabel} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <label className="relative">
            <span className="sr-only">{islandLabel}</span>
            <SlidersHorizontal aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <select 
              value={island} 
              onChange={(event) => setIsland(event.target.value)} 
              className="w-full appearance-none rounded-full border-none bg-slate-50 py-4 pl-14 pr-10 text-base font-bold text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
            >
              <option value="">{javaBaliLabel}</option>
              <option value="Java">{javaLabel}</option>
              <option value="Bali">{baliLabel}</option>
            </select>
          </label>
          <button 
            type="button" 
            onClick={clear} 
            disabled={!query && !island} 
            className="rounded-full border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary dark:hover:text-primary-400"
          >
            {resetLabel}
          </button>
        </div>
        <p className="mt-4 px-2 text-sm font-bold text-slate-500 md:hidden" aria-live="polite">{countLabel}</p>
      </div>
    )}
    
    <div className="mb-4 mt-6 hidden md:block">
      {!hideIslandFilter && <p aria-live="polite" className="text-sm font-bold text-slate-500 dark:text-slate-400">{countLabel}</p>}
    </div>

    {filtered.length ? (
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((destination) => <DestinationCard key={destination.id} destination={destination} locale={locale} />)}
      </div>
    ) : (
      <div className="mt-8 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
          <Search className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">{notFoundText}</p>
      </div>
    )}
  </>;
}
