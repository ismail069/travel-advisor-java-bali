import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import RatingStars from './RatingStars.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { destinationImageUrl } from '../utils/images.js';
import { destinationDisplayName } from '../utils/destinations.js';

export default function DestinationModal({ destination, language, t, savingAction, onClose, onChanged, onToggleSave }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!destination) return;
    api.reviews(destination.id).then((data) => setReviews(data.reviews)).catch(() => setReviews([]));
  }, [destination]);

  if (!destination) return null;

  const displayName = destinationDisplayName(destination, language);
  const detail = language === 'id' ? destination.description_id : destination.description_en;
  const category = language === 'id' ? destination.category_id : destination.category_en;

  async function submitReview(event) {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const data = await api.addReview(destination.id, { rating, review_text: text });
      setReviews(data.reviews);
      setText('');
      setStatus(t.reviewSuccess);
      onChanged?.(data.destination);
    } catch {
      setStatus(t.reviewError);
    } finally {
      setLoading(false);
    }
  }

  function saveLabel() {
    if (savingAction === 'saving') return t.saving;
    if (savingAction === 'removing') return t.removing;
    return destination.is_saved ? t.unsave : t.save;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 p-3 backdrop-blur-sm">
      <div className="mx-auto flex max-h-[95vh] max-w-4xl flex-col overflow-hidden rounded-lg bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold">{displayName}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{category} · {destination.city}, {destination.province}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={t.close}><X /></button>
        </div>
        <div className="overflow-y-auto p-4">
          <img
            src={destination.image_url || destinationImageUrl(destination)}
            alt={displayName}
            className="mb-4 h-56 w-full rounded-lg object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = destinationImageUrl(destination, 'svg');
            }}
          />
          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-4">
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{detail}</p>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <Info label={t.rating}><div className="flex items-center gap-2"><RatingStars value={destination.rating} /> {destination.rating} ({destination.review_count})</div></Info>
                <Info label={t.island}>{destination.island === 'Java' ? t.java : t.bali}</Info>
                <Info label={t.activities}>{language === 'id' ? destination.activities_id : destination.activities_en}</Info>
                <Info label={t.bestTime}>{language === 'id' ? destination.best_time_to_visit_id : destination.best_time_to_visit_en}</Info>
                <Info label={t.travelNotes}>{language === 'id' ? destination.travel_notes_id : destination.travel_notes_en}</Info>
                <Info label={t.address}>{destination.address}</Info>
                {destination.source_url && <Info label={t.source}><a href={destination.source_url} target="_blank" rel="noreferrer" className="font-semibold text-primary">{destination.source_name}</a></Info>}
              </div>
              <div>
                <h3 className="mb-2 font-semibold">{t.map}</h3>
                <iframe title={displayName} className="h-56 w-full rounded-lg border border-slate-200 dark:border-slate-700" loading="lazy" src={`https://maps.google.com/maps?q=${destination.latitude},${destination.longitude}&z=12&output=embed`} />
                <a href={destination.google_maps_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary">{destination.google_maps_url}</a>
              </div>
            </section>
            <aside className="space-y-4">
              <button
                onClick={() => onToggleSave(destination)}
                disabled={Boolean(savingAction)}
                className="w-full rounded-md bg-primary px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
              >
                {saveLabel()}
              </button>
              <form onSubmit={submitReview} className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h3 className="font-semibold">{t.reviewForm}</h3>
                <RatingStars value={rating} onChange={setRating} size={20} />
                <label className="block text-sm">
                  {t.reviewText}
                  <textarea value={text} onChange={(e) => setText(e.target.value)} minLength={3} required className="mt-1 h-24 w-full rounded-md border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950" />
                </label>
                <button disabled={loading} className="w-full rounded-md bg-slate-900 px-4 py-2 font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-slate-900">{loading ? t.loading : t.submitReview}</button>
                {status && <p className="text-sm text-primary">{status}</p>}
              </form>
              <div className="space-y-3">
                <h3 className="font-semibold">{t.reviews}</h3>
                {loading && <LoadingSpinner label={t.loading} />}
                {!reviews.length && <p className="text-sm text-slate-500">{t.noReviews}</p>}
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
                    <RatingStars value={review.rating} />
                    <p className="mt-2">{review.review_text}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(review.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, children }) {
  return <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><div className="mt-1">{children}</div></div>;
}
