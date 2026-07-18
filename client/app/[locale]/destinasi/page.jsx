import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationExplorer from '@/components/DestinationExplorer';
import JsonLd from '@/components/JsonLd';
import { getDestinations } from '@/lib/api';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Java and Bali Destinations' : 'Destinasi Wisata Jawa dan Bali',
    description: isEn ? 'Explore the catalog of tourist destinations in Java and Bali by name, city, province, category, and island.' : 'Jelajahi katalog destinasi wisata di Jawa dan Bali berdasarkan nama, kota, provinsi, kategori, dan pulau.',
    alternates: { canonical: `/${locale}/destinasi` },
    openGraph: { type: 'website', title: isEn ? 'Java and Bali Destinations' : 'Destinasi Wisata Jawa dan Bali', description: isEn ? 'Find tourist destinations in Java and Bali to plan your next trip.' : 'Temukan destinasi wisata di Jawa dan Bali untuk merencanakan perjalanan berikutnya.', url: `/${locale}/destinasi` }
  };
}

export default async function DestinationsPage({ params, searchParams }) {
  const query = await searchParams;
  const locale = (await params).locale;
  const isEn = locale === 'en';
  const initialIsland = query?.pulau === 'Java' || query?.pulau === 'Bali' ? query.pulau : '';
  const destinations = await getDestinations();
  const javaCount = destinations.filter((item) => item.island === 'Java').length;
  const baliCount = destinations.filter((item) => item.island === 'Bali').length;
  const javaOnly = initialIsland === 'Java';
  
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: isEn ? 'Java and Bali Destinations' : 'Destinasi Wisata Jawa dan Bali', url: `${SITE_URL}/${locale}/destinasi`, inLanguage: isEn ? 'en-US' : 'id-ID', about: ['Java', 'Bali'], numberOfItems: destinations.length };
  
  const homeLabel = isEn ? 'Home' : 'Beranda';
  const breadcrumbName = javaOnly ? (isEn ? 'Java Guides' : 'Panduan Jawa') : (isEn ? 'Java & Bali Destinations' : 'Destinasi Jawa & Bali');
  const breadcrumbHref = javaOnly ? `/${locale}/destinasi?pulau=Java` : `/${locale}/destinasi`;

  const eyebrow = javaOnly ? (isEn ? 'Explore Java Island' : 'Jelajahi Pulau Jawa') : (isEn ? 'Explore Java & Bali' : 'Jelajahi Jawa & Bali');
  const h1 = javaOnly ? (isEn ? 'Java destination guides' : 'Panduan destinasi Jawa') : (isEn ? 'Java and Bali tourist destinations' : 'Destinasi wisata Jawa dan Bali');
  const desc = javaOnly 
    ? (isEn ? `Explore ${javaCount} Java destinations by name, city, province, and category.` : `Jelajahi ${javaCount} destinasi Jawa berdasarkan nama, kota, provinsi, dan kategori.`)
    : (isEn ? `Discover ${destinations.length} places from cities, mountains, cultural sites, to beaches. Use filters to explore ${javaCount} Java destinations and ${baliCount} Bali destinations.` : `Temukan ${destinations.length} tempat dari kota, pegunungan, situs budaya, hingga pantai. Gunakan filter untuk menjelajahi ${javaCount} destinasi Jawa dan ${baliCount} destinasi Bali.`);

  const emptyState = isEn ? "Destination data is currently unavailable. Please try again later." : "Data destinasi sedang tidak tersedia. Silakan coba kembali beberapa saat lagi.";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd data={schema} />
      <Breadcrumbs items={[{ name: homeLabel, href: isEn ? '/en' : '/' }, { name: breadcrumbName, href: breadcrumbHref }]} />
      <header className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{h1}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{desc}</p>
      </header>
      {destinations.length ? (
        <div className="mt-10">
          <DestinationExplorer destinations={destinations} initialIsland={initialIsland} locale={locale} />
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">{emptyState}</div>
      )}
    </div>
  );
}
