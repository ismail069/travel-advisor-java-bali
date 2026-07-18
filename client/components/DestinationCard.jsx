import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { destinationSlug } from '@/lib/site';

export default function DestinationCard({ destination, locale = 'id' }) {
  const isEn = locale === 'en';
  const name = isEn && destination.name_en ? destination.name_en : (destination.name_id || destination.name);
  const islandName = destination.island === 'Java' ? (isEn ? 'Java' : 'Jawa') : 'Bali';
  const categoryName = isEn && destination.category_en ? destination.category_en : destination.category_id;
  const description = isEn && destination.short_description_en ? destination.short_description_en : destination.short_description_id;
  const readGuideText = isEn ? 'Read guide →' : 'Baca panduan →';

  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
    <Link href={`/${locale}/destinasi/${destinationSlug(destination)}`} className="block">
      <div className="aspect-[3/2] overflow-hidden bg-slate-200"><img src={destination.image_url || '/images/destinations/placeholder.svg'} alt={`Pemandangan ${name}`} loading="lazy" width="900" height="600" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
      <div className="p-5"><div className="mb-3 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-fuchsia-50 px-3 py-1 text-primary">{islandName}</span><span className="rounded-full bg-slate-100 px-3 py-1">{categoryName}</span></div><h2 className="text-xl font-black tracking-tight group-hover:text-primary">{name}</h2><p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><MapPin size={15} aria-hidden="true" />{destination.city}, {destination.province}</p><p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{description}</p><span className="mt-5 inline-flex text-sm font-black text-primary">{readGuideText}</span></div>
    </Link>
  </article>;
}
