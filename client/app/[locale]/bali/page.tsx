import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { DestinationDirectory } from '@/components/destination/DestinationDirectory';
import manifest from '@/content/golden-manifest.json';

type Locale = 'id' | 'en';
type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!['id', 'en'].includes(locale)) return { robots: { index: false } };
  const id = locale === 'id';
  const count = manifest.filter((item) => item.locale === locale).length;
  const title = id ? 'Panduan Destinasi Bali Terverifikasi' : 'Verified Bali Destination Guides';
  const description = id ? `${count} panduan destinasi Bali dengan informasi praktis, sumber penelitian, dan tanggal verifikasi.` : `${count} Bali destination guides with practical planning details, research sources, and transparent verification dates.`;
  const canonical = `/${locale}/bali`;
  return { title, description, keywords: id ? ['wisata Bali', 'destinasi Bali', 'panduan Bali'] : ['Bali travel guide', 'Bali destinations', 'things to do in Bali'], alternates: { canonical, languages: { id: '/id/bali', en: '/en/bali', 'x-default': '/id/bali' } }, openGraph: { type: 'website', locale: id ? 'id_ID' : 'en_US', alternateLocale: id ? ['en_US'] : ['id_ID'], url: canonical, title, description, siteName: 'JawaBali Trip' }, twitter: { card: 'summary_large_image', title, description }, robots: { index: true, follow: true }, other: { 'content-language': locale } };
}

export default async function BaliGuideIndex({ params }: Props) {
  const { locale } = await params;
  if (locale !== 'id' && locale !== 'en') notFound();
  const typedLocale = locale as Locale;
  const items = manifest.filter((item) => item.locale === locale);
  const id = locale === 'id';
  return <div lang={locale} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <Breadcrumbs items={[{ name: id ? 'Beranda' : 'Home', href: id ? '/' : '/en' }, { name: id ? 'Panduan Bali' : 'Bali Guides', href: `/${locale}/bali` }]} />
    <header className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.18em] text-primary">JawaBali Trip</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{id ? 'Panduan destinasi Bali' : 'Bali destination guides'}</h1><p className="mt-4 text-lg leading-8 text-slate-600">{id ? `${items.length} panduan dengan informasi praktis, sumber penelitian, dan tanggal verifikasi yang transparan.` : `${items.length} guides with practical planning details, research sources, and transparent verification dates.`}</p></header>
    <DestinationDirectory items={items} locale={typedLocale} />
  </div>;
}
