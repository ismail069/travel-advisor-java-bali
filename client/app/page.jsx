import Link from 'next/link';
import { ArrowRight, BookOpen, Bot, CheckCircle2, Languages, MapPinned } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import HomeDestinationSearch from '@/components/HomeDestinationSearch';
import manifest from '@/content/golden-manifest.json';
import { articles } from '@/content/articles';
import { SITE_URL } from '@/lib/site';

export default function HomePage() {
  const destinations = manifest.filter((item) => item.locale === 'id');
  const featuredSlugs = ['ubud-palace', 'kelingking-beach', 'jatiluwih-rice-terraces', 'lovina-beach', 'ulun-danu-beratan-temple', 'sacred-monkey-forest-ubud'];
  const featured = featuredSlugs.map((slug) => destinations.find((item) => item.slug === slug)).filter(Boolean);
  const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'JawaBali Trip', url: SITE_URL, inLanguage: ['id-ID', 'en-US'] };

  return <><JsonLd data={website} />
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-glass sm:p-12 dark:bg-slate-900/50 dark:shadow-glass-dark">
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary-400/20 opacity-50 blur-3xl dark:bg-primary-600/20"></div>
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-400/20 opacity-50 blur-3xl dark:bg-fuchsia-600/20"></div>
        
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex items-center rounded-full bg-primary-50 px-4 py-1.5 text-xs font-black tracking-widest text-primary-600 dark:bg-primary-900/40 dark:text-primary-300 w-fit">
              PANDUAN INDEPENDEN
            </span>
            <h1 className="text-5xl font-black leading-[1.15] tracking-tight sm:text-6xl lg:text-[4rem]">
              Jelajahi Bali dengan <span className="text-gradient">informasi yang lebih jelas.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Panduan destinasi bilingual dengan sumber terpercaya, tanggal verifikasi akurat, tips keselamatan, dan rencana perjalanan transparan.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/id/bali" className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 font-black text-white transition-all hover:scale-105 hover:shadow-glow">
                <span className="relative z-10 flex items-center gap-2">Jelajahi {destinations.length} destinasi <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </Link>
              <Link href="/en/bali" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 px-8 py-4 font-black text-slate-700 transition-all hover:border-primary hover:bg-primary-50 hover:text-primary dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:bg-slate-800">
                <Languages size={18}/> English guides
              </Link>
            </div>
          </div>
          <div className="relative h-full w-full">
            <img src="/images/destinations/phase-4/broken-beach.webp" alt="Broken Beach atau Pasih Uug di Nusa Penida, Bali" width="1200" height="675" className="aspect-video lg:aspect-[4/3] h-full w-full rounded-[2rem] object-cover shadow-2xl transition-transform duration-700 hover:scale-[1.02]" fetchPriority="high"/>
            {/* Overlay gradient on image for premium feel */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
          </div>
        </div>
        
        <div className="relative z-10 mt-16 lg:mt-24">
          <HomeDestinationSearch items={destinations} />
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        {[[MapPinned,'Rute nyata','Setiap destinasi memiliki halaman URL yang dapat dibagikan dengan tautan Peta yang akurat.'],[CheckCircle2,'Informasi transparan','Fakta dinamis disertai sumber dan tanggal pemeriksaan untuk keakuratan tinggi.'],[Bot,'TripAssistant AI','Gunakan AI untuk menyusun ide perjalanan interaktif sesuai kebutuhan personal Anda.']].map(([Icon,title,text], i) => (
          <div key={title} className="group rounded-[2rem] border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 inline-flex rounded-2xl bg-primary-50 p-4 text-primary-600 transition-colors group-hover:bg-primary group-hover:text-white dark:bg-slate-800 dark:text-primary-400">
              <Icon size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="mt-4 leading-loose text-slate-600 dark:text-slate-400">{text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-primary">Pilihan untuk mulai</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">Destinasi unggulan Bali</h2>
        </div>
        <Link href="/id/bali" className="group hidden items-center gap-1 font-black text-primary transition-all hover:text-primary-600 sm:flex">
          Lihat semua <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((item) => (
          <article key={item.slug} className="group relative overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900">
            <Link href={`/id/bali/${item.slug}`} className="block h-full">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img src={item.image} alt={item.name} width="800" height="600" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="mb-2 text-xs font-black uppercase tracking-wider text-primary-300 drop-shadow-md">
                  {item.regency} · {item.category}
                </p>
                <h3 className="text-2xl font-black text-white drop-shadow-lg">{item.name}</h3>
                <div className="mt-4 flex transform items-center gap-2 text-sm font-black text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4">
                  Baca panduan <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>

    <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
            <BookOpen size={24} />
          </div>
          <h2 className="text-4xl font-black tracking-tight">Panduan perjalanan</h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {articles.map((article) => (
            <article key={article.slug} className="group rounded-[2rem] border border-slate-200 bg-white p-8 transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <span className="inline-block rounded-full bg-fuchsia-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-300">
                {article.cluster}
              </span>
              <h3 className="mt-6 text-2xl font-black leading-tight">
                <Link href={`/panduan/${article.slug}`} className="transition-colors group-hover:text-primary">
                  {article.title}
                </Link>
              </h3>
              <p className="mt-4 line-clamp-3 leading-relaxed text-slate-600 dark:text-slate-400">
                {article.description}
              </p>
              <Link href={`/panduan/${article.slug}`} className="mt-8 flex items-center gap-2 text-sm font-black text-primary transition-colors group-hover:text-primary-600">
                Baca artikel <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  </>;
}
