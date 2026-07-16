import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { destinationSlug } from '@/lib/site';

export default function DestinationCard({ destination }) {
  const name = destination.name_id || destination.name;
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
    <Link href={`/destinasi/${destinationSlug(destination)}`} className="block">
      <div className="aspect-[3/2] overflow-hidden bg-slate-200"><img src={destination.image_url || '/images/destinations/placeholder.svg'} alt={`Pemandangan ${name}`} loading="lazy" width="900" height="600" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
      <div className="p-5"><div className="mb-3 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-fuchsia-50 px-3 py-1 text-primary">{destination.island === 'Java' ? 'Jawa' : 'Bali'}</span><span className="rounded-full bg-slate-100 px-3 py-1">{destination.category_id}</span></div><h2 className="text-xl font-black tracking-tight group-hover:text-primary">{name}</h2><p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><MapPin size={15} aria-hidden="true" />{destination.city}, {destination.province}</p><p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{destination.short_description_id}</p><span className="mt-5 inline-flex text-sm font-black text-primary">Baca panduan →</span></div>
    </Link>
  </article>;
}
