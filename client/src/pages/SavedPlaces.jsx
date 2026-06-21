import DestinationCard from '../components/DestinationCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function SavedPlaces({ t, language, saved, onOpen, onToggleSave }) {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{t.savedTitle}</h1>
      {!saved.length ? <EmptyState title={t.noSaved} /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((destination) => <DestinationCard key={destination.id} destination={destination} language={language} t={t} onOpen={onOpen} onToggleSave={onToggleSave} />)}
        </div>
      )}
    </div>
  );
}
