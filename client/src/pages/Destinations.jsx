import DestinationCard from '../components/DestinationCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Destinations({ t, language, destinations, categories, filters, setFilters, recommendationIds = [], clearRecommendations, onOpen, onToggleSave }) {
  const showingRecommendations = recommendationIds.length > 0;
  const recommendationSet = new Set(recommendationIds);
  const visibleDestinations = showingRecommendations
    ? recommendationIds.map((id) => destinations.find((destination) => destination.id === id)).filter(Boolean)
    : destinations;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{showingRecommendations ? t.recommendedPlaces : t.destinations}</h1>
          {showingRecommendations && <p className="text-sm text-slate-600 dark:text-slate-300">{t.recommendedCount.replace('{count}', visibleDestinations.length)}</p>}
        </div>
        {showingRecommendations && (
          <button onClick={clearRecommendations} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold dark:border-slate-700">
            {t.showAllDestinations}
          </button>
        )}
      </div>
      <div className="grid gap-3 rounded-lg bg-white p-4 dark:bg-slate-900 md:grid-cols-4">
        <input disabled={showingRecommendations} value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder={t.searchPlaceholder} className="rounded-md border border-slate-300 bg-white px-3 py-2 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 md:col-span-2" />
        <select disabled={showingRecommendations} value={filters.island} onChange={(e) => setFilters({ ...filters, island: e.target.value })} className="rounded-md border border-slate-300 bg-white px-3 py-2 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950">
          <option value="">{t.all} {t.island}</option>
          <option value="Java">{t.java}</option>
          <option value="Bali">{t.bali}</option>
        </select>
        <select disabled={showingRecommendations} value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="rounded-md border border-slate-300 bg-white px-3 py-2 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950">
          <option value="">{t.all} {t.category}</option>
          {categories.map((category) => <option key={category.category_key} value={category.category_key}>{language === 'id' ? category.category_id : category.category_en}</option>)}
        </select>
        <select disabled={showingRecommendations} value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} className="rounded-md border border-slate-300 bg-white px-3 py-2 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 md:col-span-2">
          <option value="name_asc">{t.nameAsc}</option>
          <option value="rating_desc">{t.ratingDesc}</option>
          <option value="review_count_desc">{t.reviewsDesc}</option>
        </select>
      </div>
      {!visibleDestinations.length ? <EmptyState title={t.noResults} message={t.emptyMessage} /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDestinations.map((destination) => <DestinationCard key={destination.id} destination={destination} language={language} t={t} onOpen={onOpen} onToggleSave={onToggleSave} highlighted={recommendationSet.has(destination.id)} />)}
        </div>
      )}
    </div>
  );
}
