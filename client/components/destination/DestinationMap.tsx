import { ExternalLink, MapPin } from 'lucide-react';

export function DestinationMap({ name, regency, province, locale, query: suppliedQuery }: { name: string; regency: string; province: string; locale: 'id' | 'en'; query?: string }) {
  const query = suppliedQuery || `${name}, ${regency}, ${province}, Indonesia`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const id = locale === 'id';
  return <section className="not-prose mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-labelledby="destination-map-title">
    <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
      <div><div className="flex items-center gap-2"><MapPin aria-hidden="true" className="h-5 w-5 text-primary" /><h2 id="destination-map-title" className="text-xl font-black text-slate-950">{id ? 'Lokasi di Google Maps' : 'Location on Google Maps'}</h2></div><p className="mt-2 text-sm text-slate-600">{regency}, {province}</p></div>
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-primary">{id ? 'Buka Google Maps' : 'Open Google Maps'} <ExternalLink aria-hidden="true" className="h-4 w-4" /></a>
    </div>
    <iframe src={embedUrl} title={id ? `Peta lokasi ${name}` : `Map showing ${name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-72 w-full border-0 sm:h-80" allowFullScreen />
  </section>;
}
