import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import DestinationCard from '@/components/DestinationCard';
import { getDestination, getDestinations } from '@/lib/api';
import { absoluteUrl, destinationSlug } from '@/lib/site';

function idFromSlug(slug) { return Number(String(slug).split('-')[0]); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const destination = await getDestination(idFromSlug(slug));
  if (!destination) return { title: 'Destinasi tidak ditemukan', robots: { index: false } };
  const name = destination.name_id || destination.name;
  const canonical = `/destinasi/${destinationSlug(destination)}`;
  return { title: `${name}: Panduan Wisata`, description: destination.short_description_id, alternates: { canonical }, openGraph: { type: 'article', title: `${name}: Panduan Wisata`, description: destination.short_description_id, url: canonical, images: destination.image_url ? [{ url: destination.image_url, alt: name }] : [] } };
}

export default async function DestinationPage({ params }) {
  const { slug } = await params;
  const destination = await getDestination(idFromSlug(slug));
  if (!destination) notFound();
  const canonicalSlug = destinationSlug(destination);
  if (slug !== canonicalSlug) permanentRedirect(`/destinasi/${canonicalSlug}`);
  const name = destination.name_id || destination.name;
  const all = await getDestinations();
  const related = all.filter((item) => item.id !== destination.id && (item.province === destination.province || item.category_key === destination.category_key)).slice(0, 3);
  const schema = { '@context':'https://schema.org','@type':'TouristAttraction',name,description:destination.description_id,image:destination.image_url ? [destination.image_url] : undefined,url:absoluteUrl(`/destinasi/${canonicalSlug}`),address:{'@type':'PostalAddress',streetAddress:destination.address,addressLocality:destination.city,addressRegion:destination.province,addressCountry:'ID'},geo:destination.latitude && destination.longitude ? {'@type':'GeoCoordinates',latitude:destination.latitude,longitude:destination.longitude}:undefined,touristType:['Wisatawan domestik','Wisatawan internasional'] };
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><JsonLd data={schema} /><Breadcrumbs items={[{name:'Beranda',href:'/'},{name:'Destinasi',href:'/destinasi'},{name,href:`/destinasi/${canonicalSlug}`}]} /><article><header className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><div className="flex flex-wrap gap-2 text-sm font-black"><span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{destination.island === 'Java' ? 'Jawa' : 'Bali'}</span><span className="rounded-full bg-white px-3 py-1">{destination.category_id}</span></div><h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{name}</h1><p className="mt-5 text-xl leading-8 text-slate-600">{destination.short_description_id}</p><p className="mt-5 text-sm text-slate-500">{destination.city}, {destination.province}</p></div><div className="aspect-[4/3] overflow-hidden rounded-3xl bg-slate-200 shadow-xl"><img src={destination.image_url} alt={`Pemandangan ${name}`} width="1200" height="900" fetchPriority="high" className="h-full w-full object-cover" /></div></header><div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]"><div className="content-copy"><h2>Tentang {name}</h2><p>{destination.description_id}</p><h2>Aktivitas yang dapat dilakukan</h2><p>{destination.activities_id}</p><h2>Waktu terbaik berkunjung</h2><p>{destination.best_time_to_visit_id}</p><h2>Catatan perjalanan</h2><p>{destination.travel_notes_id}</p><h2>Verifikasi sebelum berangkat</h2><p>Jam operasional, harga tiket, akses, dan kondisi kawasan dapat berubah. Periksa informasi terbaru dari pengelola atau sumber resmi sebelum memulai perjalanan.</p></div><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24"><h2 className="text-lg font-black">Informasi singkat</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="font-bold text-slate-500">Alamat</dt><dd className="mt-1 leading-6">{destination.address}</dd></div><div><dt className="font-bold text-slate-500">Sumber referensi</dt><dd className="mt-1">{destination.source_url ? <a href={destination.source_url} rel="nofollow noreferrer" target="_blank" className="font-bold text-primary">{destination.source_name || 'Sumber resmi'} ↗</a> : 'Informasi destinasi'}</dd></div></dl>{destination.google_maps_url && <a href={destination.google_maps_url} rel="nofollow noreferrer" target="_blank" className="mt-6 block rounded-xl bg-slate-950 px-5 py-3 text-center font-black text-white">Buka Google Maps</a>}</aside></div></article>{related.length > 0 && <section className="mt-16"><h2 className="text-3xl font-black">Destinasi terkait</h2><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item)=><DestinationCard key={item.id} destination={item} />)}</div></section>}<div className="mt-12"><Link href="/panduan" className="font-black text-primary">Lanjut membaca panduan perjalanan →</Link></div></div>;
}
