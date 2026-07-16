import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { articles } from '@/content/articles';

export const metadata = { title: 'Panduan Perjalanan Jawa dan Bali', description: 'Kumpulan panduan itinerary, budget, dan transportasi untuk perjalanan di Jawa dan Bali.', alternates: { canonical: '/panduan' } };

export default function GuidesPage() {
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><Breadcrumbs items={[{name:'Beranda',href:'/'},{name:'Panduan',href:'/panduan'}]} /><header className="max-w-3xl"><p className="font-black uppercase tracking-wider text-primary">Pusat perencanaan</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Panduan perjalanan</h1><p className="mt-4 text-lg leading-8 text-slate-600">Artikel independen untuk membantu mengambil keputusan sebelum berangkat. Informasi yang mudah berubah selalu perlu diperiksa kembali melalui kanal resmi.</p></header><div className="mt-10 grid gap-6 md:grid-cols-2">{articles.map((article)=><article key={article.slug} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><span className="text-xs font-black uppercase tracking-wider text-primary">{article.cluster}</span><h2 className="mt-3 text-2xl font-black"><Link href={`/panduan/${article.slug}`} className="hover:text-primary">{article.title}</Link></h2><p className="mt-3 leading-7 text-slate-600">{article.description}</p><p className="mt-5 text-sm text-slate-500">Diperbarui {new Intl.DateTimeFormat('id-ID',{dateStyle:'long'}).format(new Date(article.updatedAt))} · {article.readTime}</p></article>)}</div></div>;
}
