import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationExplorer from '@/components/DestinationExplorer';
import { getDestinations } from '@/lib/api';

type Locale = 'id' | 'en';
type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!['id', 'en'].includes(locale)) return { robots: { index: false } };
  const id = locale === 'id';
  
  // Note: we can't easily count Java destinations statically here without importing fallback or fetching,
  // but we know there are 10 Java destinations currently.
  const title = id ? 'Panduan Destinasi Jawa' : 'Java Destination Guides';
  const description = id ? `Jelajahi panduan destinasi Jawa dengan informasi praktis untuk liburan Anda.` : `Explore Java destination guides with practical planning details for your holiday.`;
  const canonical = `/${locale}/jawa`;
  return { title, description, keywords: id ? ['wisata Jawa', 'destinasi Jawa', 'panduan Jawa'] : ['Java travel guide', 'Java destinations', 'things to do in Java'], alternates: { canonical, languages: { id: '/id/jawa', en: '/en/jawa', 'x-default': '/id/jawa' } }, openGraph: { type: 'website', locale: id ? 'id_ID' : 'en_US', alternateLocale: id ? ['en_US'] : ['id_ID'], url: canonical, title, description, siteName: 'JawaBali Trip' }, twitter: { card: 'summary_large_image', title, description }, robots: { index: true, follow: true }, other: { 'content-language': locale } };
}

export default async function JavaGuideIndex({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'id' && locale !== 'en') notFound();
  
  const allDestinations = await getDestinations();
  const javaDestinations = allDestinations.filter((d: any) => d.island === 'Java');
  const id = locale === 'id';
  
  return (
    <div lang={locale} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: id ? 'Beranda' : 'Home', href: id ? '/' : '/en' }, { name: id ? 'Panduan Jawa' : 'Java Guides', href: `/${locale}/jawa` }]} />
      <header className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[.18em] text-primary">JawaBali Trip</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          {id ? 'Panduan destinasi Jawa' : 'Java destination guides'}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          {id 
            ? `Jelajahi ${javaDestinations.length} destinasi Jawa berdasarkan nama, kota, provinsi, dan kategori.` 
            : `Explore ${javaDestinations.length} Java destinations by name, city, province, and category.`}
        </p>
      </header>
      <div className="mt-10">
        <DestinationExplorer 
          destinations={javaDestinations} 
          locale={locale} 
          hideIslandFilter={true} 
        />
      </div>
    </div>
  );
}
