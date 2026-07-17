'use client';

import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import type { DocMeta, NavigationItem, TocItem } from '@/lib/docs';

function NavItems({ items, onNavigate }: { items: NavigationItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return <>{items.map((item) => item.href ? <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={pathname === item.href ? 'page' : undefined} className={`block rounded-lg px-3 py-2 text-sm font-bold ${pathname === item.href ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>{item.title}</Link> : <div key={item.title} className="mt-6 first:mt-0"><p className="mb-2 px-3 text-xs font-black uppercase tracking-[.16em] text-slate-400">{item.title}</p><div className="space-y-0.5"><NavItems items={item.children || []} onNavigate={onNavigate}/></div></div>)}</>;
}

function SearchBox({ docs, onNavigate }: { docs: DocMeta[]; onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => query.trim().length < 2 ? [] : docs.filter((doc) => `${doc.title} ${doc.description} ${doc.searchText}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8), [docs, query]);
  return <div className="relative"><label className="sr-only" htmlFor="docs-search">Cari dokumentasi</label><Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={17}/><input id="docs-search" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Cari dokumentasi…" className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm"/>{results.length > 0 && <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">{results.map((doc)=><Link key={doc.href} href={doc.href} onClick={()=>{setQuery('');onNavigate?.();}} className="block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50"><span className="block text-sm font-black">{doc.title}</span><span className="mt-1 line-clamp-1 block text-xs text-slate-500">{doc.description}</span></Link>)}</div>}</div>;
}

export default function DocsShell({ navigation, docs, toc, children }: { navigation: NavigationItem[]; docs: DocMeta[]; toc: TocItem[]; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
    <div className="flex items-center justify-between border-b border-slate-200 py-4 lg:hidden"><div><p className="text-sm font-black">Dokumentasi</p><p className="text-xs text-slate-500">Source of truth</p></div><button type="button" onClick={()=>setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="docs-mobile-nav" className="rounded-lg border border-slate-200 p-2" aria-label={mobileOpen ? 'Tutup navigasi dokumentasi' : 'Buka navigasi dokumentasi'}>{mobileOpen ? <X/> : <Menu/>}</button></div>
    {mobileOpen && <div id="docs-mobile-nav" className="border-b border-slate-200 py-5 lg:hidden"><SearchBox docs={docs} onNavigate={()=>setMobileOpen(false)}/><nav aria-label="Dokumentasi mobile" className="mt-5"><NavItems items={navigation} onNavigate={()=>setMobileOpen(false)}/></nav></div>}
    <div className="grid lg:grid-cols-[260px_minmax(0,760px)_220px] lg:gap-10 xl:gap-14">
      <aside className="hidden h-[calc(100vh-73px)] overflow-y-auto py-8 lg:sticky lg:top-[73px] lg:block"><SearchBox docs={docs}/><nav aria-label="Dokumentasi" className="mt-7"><NavItems items={navigation}/></nav></aside>
      <main className="min-w-0 py-10 lg:py-14">{children}</main>
      <aside className="hidden py-14 xl:block"><div className="sticky top-28"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Di halaman ini</p>{toc.length ? <nav className="mt-4 space-y-2" aria-label="Daftar isi halaman">{toc.map((item)=><a key={item.id} href={`#${item.id}`} className={`block text-sm leading-5 text-slate-500 hover:text-primary ${item.level === 3 ? 'pl-3' : 'font-bold'}`}>{item.title}</a>)}</nav> : <p className="mt-3 text-sm text-slate-500">Tidak ada subbagian.</p>}</div></aside>
    </div>
  </div>;
}
