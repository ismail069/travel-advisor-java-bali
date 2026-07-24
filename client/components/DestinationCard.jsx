import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { destinationSlug } from '@/lib/site';

export default function DestinationCard({ destination, locale = 'id' }) {
  const isEn = locale === 'en';
  const name = isEn && destination.name_en ? destination.name_en : (destination.name_id || destination.name);
  const islandName = destination.island === 'Java' ? (isEn ? 'Java' : 'Jawa') : 'Bali';
  const categoryName = isEn && destination.category_en ? destination.category_en : destination.category_id;
  const description = isEn && destination.short_description_en ? destination.short_description_en : destination.short_description_id;
  const readGuideText = isEn ? 'Read guide' : 'Baca panduan';

  return <article className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
    <Link href={`/${locale}/destinasi/${destinationSlug(destination)}`} className="flex h-full flex-col">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img 
          src={destination.image_url || '/images/destinations/placeholder.svg'} 
          alt={`Pemandangan ${name}`} 
          loading="lazy" 
          width="900" 
          height="600" 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        {/* Elegant subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-slate-900/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        
        {/* Badges floating on top */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-primary shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:text-primary-400">
            {islandName}
          </span>
          <span className="rounded-full bg-slate-900/70 px-3 py-1.5 text-white shadow-sm backdrop-blur-md">
            {categoryName}
          </span>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h2 className="text-2xl font-black tracking-tight transition-colors group-hover:text-primary dark:text-white">
          {name}
        </h2>
        
        <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400">
          <MapPin size={16} aria-hidden="true" className="text-primary-400" />
          {destination.city}, {destination.province}
        </p>
        
        <p className="mt-4 line-clamp-3 flex-1 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
        
        <div className="mt-8 flex items-center gap-2 text-sm font-black text-primary transition-colors group-hover:text-primary-600 dark:text-primary-400">
          {readGuideText} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  </article>;
}
