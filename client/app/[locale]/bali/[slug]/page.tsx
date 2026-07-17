import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import imageAttributions from '@/content/golden-image-attributions.json';
import manifest from '@/content/golden-manifest.json';
import { goldenRegistry } from '@/content/golden-registry';
import { absoluteUrl } from '@/lib/site';

type Locale = 'id' | 'en';
type Props = { params: Promise<{ locale: string; slug: string }> };

function record(locale: string, slug: string) { return manifest.find((item) => item.locale === locale && item.slug === slug); }
function isLocale(value: string): value is Locale { return value === 'id' || value === 'en'; }

export function generateStaticParams() { return manifest.map(({ locale, slug }) => ({ locale, slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = record(locale, slug);
  if (!item || !isLocale(locale)) return { title: 'Destination not found', robots: { index: false } };
  const canonical = `/${locale}/bali/${slug}`;
  return {
    title: item.metaTitle,
    description: item.metaDescription,
    alternates: { canonical, languages: { id: `/id/bali/${slug}`, en: `/en/bali/${slug}`, 'x-default': `/id/bali/${slug}` } },
    openGraph: { type: 'article', locale: locale === 'id' ? 'id_ID' : 'en_US', title: item.metaTitle, description: item.metaDescription, url: canonical, ...(item.image ? { images: [{ url: item.image, alt: item.name }] } : {}) },
    twitter: { card: item.image ? 'summary_large_image' : 'summary', title: item.metaTitle, description: item.metaDescription, ...(item.image ? { images: [item.image] } : {}) },
    robots: { index: true, follow: true },
    other: { 'content-language': locale },
  };
}

export default async function GoldenDestinationPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = record(locale, slug);
  const Content = goldenRegistry[`${locale}/${slug}`];
  if (!item || !Content) notFound();
  const attribution = imageAttributions.find((image) => image.slug === slug);
  const path = `/${locale}/bali/${slug}`;
  const labels = locale === 'id' ? { home: 'Beranda', bali: 'Panduan Bali', language: 'Read in English', verified: 'Terakhir diverifikasi' } : { home: 'Home', bali: 'Bali Guides', language: 'Read in Indonesian', verified: 'Last verified' };
  const otherLocale = locale === 'id' ? 'en' : 'id';
  const attraction = { '@context': 'https://schema.org', '@type': slug === 'samasta-lifestyle-village' ? 'ShoppingCenter' : 'TouristAttraction', inLanguage: locale, name: item.name, description: item.metaDescription, url: absoluteUrl(path), ...(item.image ? { image: { '@type': 'ImageObject', contentUrl: absoluteUrl(item.image), license: attribution?.licenseUrl || attribution?.sourcePage, creditText: attribution?.artist } } : {}), address: { '@type': 'PostalAddress', addressLocality: item.regency, addressRegion: item.province, addressCountry: 'ID' } };
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: locale, mainEntity: item.faq.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) };
  return <div lang={locale} className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <JsonLd data={attraction}/><JsonLd data={faq}/>
    <Breadcrumbs items={[{ name: labels.home, href: locale === 'id' ? '/' : '/en' }, { name: labels.bali, href: `/${locale}/bali` }, { name: item.name, href: path }]}/>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"><span className="font-bold text-slate-600">{labels.verified}: <time dateTime={item.lastVerified}>{item.lastVerified}</time></span><Link href={`/${otherLocale}/bali/${slug}`} hrefLang={otherLocale} className="font-black text-primary">{labels.language} →</Link></div>
    <article className="golden-content space-y-8"><Content/></article>
  </div>;
}
