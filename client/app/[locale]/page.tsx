import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, BookOpen, Bot, CheckCircle2, Languages, MapPinned } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import HomeDestinationSearch from '@/components/HomeDestinationSearch';
import manifest from '@/content/golden-manifest.json';
import { articles } from '@/content/articles';
import { SITE_URL } from '@/lib/site';

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  if (locale === 'id') redirect('/');
  if (locale !== 'en') notFound();

  const destinations = manifest.filter((item) => item.locale === 'en');
  const featuredSlugs = ['ubud-palace', 'kelingking-beach', 'jatiluwih-rice-terraces', 'lovina-beach', 'ulun-danu-beratan-temple', 'sacred-monkey-forest-ubud'];
  const featured = featuredSlugs.map((slug) => destinations.find((item) => item.slug === slug)).filter(Boolean) as any[];
  const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'JawaBali Trip', url: SITE_URL, inLanguage: ['id-ID', 'en-US'] };

  return <><JsonLd data={website} />
    <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-primary">Independent Java & Bali Guides</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">Explore Bali with clearer information.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Bilingual destination guides with transparent sources, verification dates, access tips, safety, and visit planning.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/en/bali" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-black text-white">Explore {destinations.length} destinations <ArrowRight size={18}/></Link><Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-4 font-black hover:border-primary hover:text-primary"><Languages size={18}/> Panduan Indonesia</Link></div>
          </div>
          <img src="/images/destinations/phase-4/broken-beach.webp" alt="Broken Beach or Pasih Uug in Nusa Penida, Bali" width="1200" height="675" className="aspect-video w-full rounded-2xl object-cover" fetchPriority="high"/>
        </div>
        <HomeDestinationSearch items={destinations} locale="en" />
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><div className="grid gap-4 md:grid-cols-3">{[[MapPinned,'Real routes','Every destination has a shareable URL page.'],[CheckCircle2,'Transparent information','Dynamic facts with sources and verification dates.'],[Bot,'TripAssistant AI','Use AI to build travel ideas suited to your needs.']].map(([Icon,title,text])=><div key={title as string} className="rounded-2xl border border-slate-200 bg-white p-6"><Icon className="text-primary"/><h2 className="mt-5 text-xl font-black">{title as string}</h2><p className="mt-2 leading-7 text-slate-600">{text as string}</p></div>)}</div></section>

    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"><div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-primary">Choices to start</p><h2 className="mt-2 text-3xl font-black tracking-tight">Featured Bali destinations</h2></div><Link href="/en/bali" className="hidden font-black text-primary sm:block">View all →</Link></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((item)=><article key={item.slug} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><Link href={`/en/bali/${item.slug}`}><img src={item.image} alt={item.name} width="800" height="450" className="aspect-video w-full object-cover"/><div className="p-5"><p className="text-xs font-black uppercase tracking-wider text-primary">{item.regency} · {item.category}</p><h3 className="mt-2 text-xl font-black">{item.name}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.metaDescription}</p><span className="mt-5 inline-block font-black text-primary">Read guide →</span></div></Link></article>)}</div></section>

    <section className="border-y border-slate-200 bg-white"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><div className="flex items-center gap-3"><BookOpen className="text-primary"/><h2 className="text-3xl font-black">Travel guides</h2></div><div className="mt-8 grid gap-6 md:grid-cols-3">{articles.map((article)=><article key={article.slug} className="rounded-2xl border border-slate-200 p-6"><span className="text-xs font-black uppercase tracking-wider text-primary">{article.cluster}</span><h3 className="mt-3 text-xl font-black"><Link href={`/panduan/${article.slug}`} className="hover:text-primary">{article.title}</Link></h3><p className="mt-3 text-sm leading-6 text-slate-600">{article.description}</p><Link href={`/panduan/${article.slug}`} className="mt-5 inline-block text-sm font-black text-primary">Read article →</Link></article>)}</div></div></section>
  </>;
}
