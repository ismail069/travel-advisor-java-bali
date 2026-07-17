import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationExplorer from '@/components/DestinationExplorer';
import JsonLd from '@/components/JsonLd';
import { getDestinations } from '@/lib/api';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'Destinasi Wisata Jawa dan Bali',
  description: 'Jelajahi katalog destinasi wisata di Jawa dan Bali berdasarkan nama, kota, provinsi, kategori, dan pulau.',
  alternates: { canonical: '/destinasi' },
  openGraph: { type: 'website', title: 'Destinasi Wisata Jawa dan Bali', description: 'Temukan destinasi wisata di Jawa dan Bali untuk merencanakan perjalanan berikutnya.', url: '/destinasi' }
};

export default async function DestinationsPage({ searchParams }) {
  const query = await searchParams;
  const initialIsland = query?.pulau === 'Java' || query?.pulau === 'Bali' ? query.pulau : '';
  const destinations = await getDestinations();
  const javaCount = destinations.filter((item) => item.island === 'Java').length;
  const baliCount = destinations.filter((item) => item.island === 'Bali').length;
  const javaOnly = initialIsland === 'Java';
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Destinasi Wisata Jawa dan Bali', url: `${SITE_URL}/destinasi`, inLanguage: 'id-ID', about: ['Java', 'Bali'], numberOfItems: destinations.length };
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <JsonLd data={schema} />
    <Breadcrumbs items={[{ name: 'Beranda', href: '/' }, { name: javaOnly ? 'Panduan Jawa' : 'Destinasi Jawa & Bali', href: javaOnly ? '/destinasi?pulau=Java' : '/destinasi' }]} />
    <header className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.18em] text-primary">{javaOnly ? 'Jelajahi Pulau Jawa' : 'Jelajahi Jawa & Bali'}</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{javaOnly ? 'Panduan destinasi Jawa' : 'Destinasi wisata Jawa dan Bali'}</h1><p className="mt-4 text-lg leading-8 text-slate-600">{javaOnly ? `Jelajahi ${javaCount} destinasi Jawa berdasarkan nama, kota, provinsi, dan kategori.` : `Temukan ${destinations.length} tempat dari kota, pegunungan, situs budaya, hingga pantai. Gunakan filter untuk menjelajahi ${javaCount} destinasi Jawa dan ${baliCount} destinasi Bali.`}</p></header>
    {destinations.length ? <div className="mt-10"><DestinationExplorer destinations={destinations} initialIsland={initialIsland} /></div> : <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">Data destinasi sedang tidak tersedia. Silakan coba kembali beberapa saat lagi.</div>}
  </div>;
}
