import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import DestinationCard from '@/components/DestinationCard';
import { getDestination, getDestinations } from '@/lib/api';
import { absoluteUrl, destinationSlug } from '@/lib/site';

function idFromSlug(slug) { return Number(String(slug).split('-')[0]); }

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const isEn = locale === 'en';
  const destination = await getDestination(idFromSlug(slug));
  if (!destination) return { title: isEn ? 'Destination not found' : 'Destinasi tidak ditemukan', robots: { index: false } };
  
  const name = isEn && destination.name_en ? destination.name_en : (destination.name_id || destination.name);
  const canonical = `/${locale}/destinasi/${destinationSlug(destination)}`;
  const title = isEn ? `${name}: Travel Guide` : `${name}: Panduan Wisata`;
  const description = isEn && destination.short_description_en ? destination.short_description_en : destination.short_description_id;

  return { title, description, alternates: { canonical }, openGraph: { type: 'article', title, description, url: canonical, images: destination.image_url ? [{ url: destination.image_url, alt: name }] : [] } };
}

export default async function DestinationPage({ params }) {
  const { locale, slug } = await params;
  const isEn = locale === 'en';
  const destination = await getDestination(idFromSlug(slug));
  
  if (!destination) notFound();
  
  const canonicalSlug = destinationSlug(destination);
  if (slug !== canonicalSlug) permanentRedirect(`/${locale}/destinasi/${canonicalSlug}`);
  
  const name = isEn && destination.name_en ? destination.name_en : (destination.name_id || destination.name);
  const shortDesc = isEn && destination.short_description_en ? destination.short_description_en : destination.short_description_id;
  const fullDesc = isEn && destination.description_en ? destination.description_en : destination.description_id;
  const activities = isEn && destination.activities_en ? destination.activities_en : destination.activities_id;
  const bestTime = isEn && destination.best_time_to_visit_en ? destination.best_time_to_visit_en : destination.best_time_to_visit_id;
  const travelNotes = isEn && destination.travel_notes_en ? destination.travel_notes_en : destination.travel_notes_id;
  
  const all = await getDestinations();
  const related = all.filter((item) => item.id !== destination.id && (item.province === destination.province || item.category_key === destination.category_key)).slice(0, 3);
  
  const schema = { '@context':'https://schema.org','@type':'TouristAttraction',name,description:fullDesc,image:destination.image_url ? [destination.image_url] : undefined,url:absoluteUrl(`/${locale}/destinasi/${canonicalSlug}`),address:{'@type':'PostalAddress',streetAddress:destination.address,addressLocality:destination.city,addressRegion:destination.province,addressCountry:'ID'},geo:destination.latitude && destination.longitude ? {'@type':'GeoCoordinates',latitude:destination.latitude,longitude:destination.longitude}:undefined,touristType:['Wisatawan domestik','Wisatawan internasional'] };

  const homeLabel = isEn ? 'Home' : 'Beranda';
  const destLabel = isEn ? 'Destinations' : 'Destinasi';
  const islandLabel = destination.island === 'Java' ? (isEn ? 'Java' : 'Jawa') : 'Bali';
  const categoryLabel = isEn && destination.category_en ? destination.category_en : destination.category_id;
  const aboutHeading = isEn ? `About ${name}` : `Tentang ${name}`;
  const activitiesHeading = isEn ? 'Activities to do' : 'Aktivitas yang dapat dilakukan';
  const timeHeading = isEn ? 'Best time to visit' : 'Waktu terbaik berkunjung';
  const notesHeading = isEn ? 'Travel notes' : 'Catatan perjalanan';
  const verifyHeading = isEn ? 'Verify before you go' : 'Verifikasi sebelum berangkat';
  const verifyText = isEn ? 'Operating hours, ticket prices, access, and area conditions are subject to change. Check the latest information from the management or official sources before starting your trip.' : 'Jam operasional, harga tiket, akses, dan kondisi kawasan dapat berubah. Periksa informasi terbaru dari pengelola atau sumber resmi sebelum memulai perjalanan.';
  const quickInfoHeading = isEn ? 'Quick info' : 'Informasi singkat';
  const addressHeading = isEn ? 'Address' : 'Alamat';
  const sourceHeading = isEn ? 'Reference source' : 'Sumber referensi';
  const officialSourceText = isEn ? 'Official source' : 'Sumber resmi';
  const destInfoText = isEn ? 'Destination info' : 'Informasi destinasi';
  const mapsText = isEn ? 'Open in Google Maps' : 'Buka Google Maps';
  const relatedHeading = isEn ? 'Related destinations' : 'Destinasi terkait';
  const continueText = isEn ? 'Continue reading travel guides →' : 'Lanjut membaca panduan perjalanan →';

  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <JsonLd data={schema} />
    <Breadcrumbs items={[{name:homeLabel,href:isEn?'/en':'/'},{name:destLabel,href:`/${locale}/destinasi`},{name,href:`/${locale}/destinasi/${canonicalSlug}`}]} />
    
    <article>
      <header className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <div className="flex flex-wrap gap-2 text-sm font-black">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{islandLabel}</span>
            <span className="rounded-full bg-white px-3 py-1">{categoryLabel}</span>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{name}</h1>
          <p className="mt-5 text-xl leading-8 text-slate-600">{shortDesc}</p>
          <p className="mt-5 text-sm text-slate-500">{destination.city}, {destination.province}</p>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-slate-200 shadow-xl">
          <img src={destination.image_url || '/images/destinations/placeholder.svg'} alt={name} width="1200" height="900" fetchPriority="high" className="h-full w-full object-cover" />
        </div>
      </header>
      
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="content-copy">
          <h2>{aboutHeading}</h2><p>{fullDesc}</p>
          <h2>{activitiesHeading}</h2><p>{activities}</p>
          <h2>{timeHeading}</h2><p>{bestTime}</p>
          <h2>{notesHeading}</h2><p>{travelNotes}</p>
          <h2>{verifyHeading}</h2><p>{verifyText}</p>
        </div>
        
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-black">{quickInfoHeading}</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-bold text-slate-500">{addressHeading}</dt>
              <dd className="mt-1 leading-6">{destination.address}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">{sourceHeading}</dt>
              <dd className="mt-1">
                {destination.source_url ? <a href={destination.source_url} rel="nofollow noreferrer" target="_blank" className="font-bold text-primary">{destination.source_name || officialSourceText} ↗</a> : destInfoText}
              </dd>
            </div>
          </dl>
          {destination.google_maps_url && <a href={destination.google_maps_url} rel="nofollow noreferrer" target="_blank" className="mt-6 block rounded-xl bg-slate-950 px-5 py-3 text-center font-black text-white">{mapsText}</a>}
        </aside>
      </div>
    </article>
    
    {related.length > 0 && (
      <section className="mt-16">
        <h2 className="text-3xl font-black">{relatedHeading}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item)=><DestinationCard key={item.id} destination={item} locale={locale} />)}
        </div>
      </section>
    )}
    
    <div className="mt-12">
      <Link href={isEn ? '/en/panduan' : '/panduan'} className="font-black text-primary">{continueText}</Link>
    </div>
  </div>;
}
