import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, CONTACT_EMAIL, OWNER_NAME, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'JawaBali Trip — Panduan Wisata Jawa dan Bali', template: '%s | JawaBali Trip' },
  description: 'Panduan destinasi, itinerary, budget, dan transportasi untuk merencanakan perjalanan di Jawa dan Bali.',
  applicationName: SITE_NAME,
  authors: [{ name: OWNER_NAME, url: absoluteUrl('/tentang') }],
  creator: OWNER_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'id_ID', url: '/', siteName: SITE_NAME, title: 'JawaBali Trip', description: 'Panduan perjalanan independen untuk menjelajahi Jawa dan Bali.', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'JawaBali Trip' }] },
  twitter: { card: 'summary_large_image', title: 'JawaBali Trip', description: 'Panduan perjalanan independen untuk Jawa dan Bali.', images: ['/opengraph-image'] },
  robots: { index: true, follow: true },
  category: 'travel'
};

export default function RootLayout({ children }) {
  const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL, email: CONTACT_EMAIL, founder: { '@type': 'Person', name: OWNER_NAME } };
  return <html lang="id"><body><JsonLd data={organization} /><a href="#konten" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-3">Lewati ke konten</a><Header /><main id="konten">{children}</main><Footer /></body></html>;
}
