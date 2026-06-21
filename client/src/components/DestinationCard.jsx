import { Bookmark, MapPin } from 'lucide-react';
import RatingStars from './RatingStars.jsx';
import { destinationImageUrl } from '../utils/images.js';
import { destinationDisplayName } from '../utils/destinations.js';

export default function DestinationCard({ destination, language, t, highlighted, onOpen, onToggleSave }) {
  const displayName = destinationDisplayName(destination, language);
  const category = language === 'id' ? destination.category_id : destination.category_en;
  const desc = language === 'id' ? destination.short_description_id : destination.short_description_en;
  return (
    <article className={`overflow-hidden rounded-lg border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${highlighted ? 'border-primary ring-2 ring-primary/25' : 'border-slate-200 dark:border-slate-800'}`}>
      <img
        src={destination.image_url || destinationImageUrl(destination, 900, 600)}
        alt={displayName}
        className="h-44 w-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = destinationImageUrl(destination, 'svg');
        }}
      />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{displayName}</h3>
            <p className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300"><MapPin size={14} /> {destination.city}, {destination.province}</p>
          </div>
          <button onClick={() => onToggleSave(destination)} className={`rounded-full p-2 ${destination.is_saved ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`} aria-label={destination.is_saved ? t.unsave : t.save}>
            <Bookmark size={18} fill={destination.is_saved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-primary dark:bg-teal-950">{destination.island === 'Java' ? t.java : t.bali}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{category}</span>
        </div>
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
        {destination.source_name && <p className="text-xs text-slate-500 dark:text-slate-400">{t.source}: {destination.source_name}</p>}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm"><RatingStars value={destination.rating} /> <span>{destination.rating} ({destination.review_count})</span></div>
          <button onClick={() => onOpen(destination)} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">{t.viewDetail}</button>
        </div>
      </div>
    </article>
  );
}
