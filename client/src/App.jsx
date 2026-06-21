import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import DestinationModal from './components/DestinationModal.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { translations } from './i18n/translations.js';
import { api } from './services/api.js';
import Home from './pages/Home.jsx';
import Destinations from './pages/Destinations.jsx';
import SavedPlaces from './pages/SavedPlaces.jsx';
import Chat from './pages/Chat.jsx';

export default function App() {
  const [page, setPage] = useState('home');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [destinations, setDestinations] = useState([]);
  const [saved, setSaved] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingActions, setSavingActions] = useState({});
  const [filters, setFilters] = useState({ search: '', island: '', category: '', sort: 'name_asc' });
  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    loadDestinations();
  }, [filters]);

  useEffect(() => {
    api.saved().then((data) => setSaved(data.destinations)).catch(() => setSaved([]));
  }, []);

  async function loadDestinations() {
    setLoading(true);
    try {
      const data = await api.destinations(filters);
      setDestinations(data.destinations);
      setCategories(data.categories);
    } finally {
      setLoading(false);
    }
  }

  async function refreshSaved() {
    const data = await api.saved();
    setSaved(data.destinations);
  }

  function setSaving(id, action) {
    setSavingActions((current) => {
      const next = { ...current };
      if (action) next[id] = action;
      else delete next[id];
      return next;
    });
  }

  function setSavedFlag(destination, isSaved) {
    const updated = { ...destination, is_saved: isSaved ? 1 : 0 };
    setSelected((current) => current?.id === destination.id ? { ...current, is_saved: updated.is_saved } : current);
    setDestinations((items) => items.map((item) => item.id === destination.id ? { ...item, is_saved: updated.is_saved } : item));
    setSaved((items) => {
      if (isSaved) return items.some((item) => item.id === destination.id) ? items.map((item) => item.id === destination.id ? updated : item) : [updated, ...items];
      return items.filter((item) => item.id !== destination.id);
    });
  }

  async function toggleSave(destination) {
    const nextSaved = !destination.is_saved;
    setSaving(destination.id, nextSaved ? 'saving' : 'removing');
    setSavedFlag(destination, nextSaved);
    try {
      if (nextSaved) await api.save(destination.id);
      else await api.unsave(destination.id);
      await refreshSaved();
      await loadDestinations();
      setSelected((current) => current?.id === destination.id ? { ...current, is_saved: nextSaved ? 1 : 0 } : current);
    } catch (error) {
      setSavedFlag(destination, !nextSaved);
      console.error('Failed to update saved destination:', error.message);
    } finally {
      setSaving(destination.id, null);
    }
  }

  function updateDestination(updated) {
    setSelected(updated);
    setDestinations((items) => items.map((item) => item.id === updated.id ? updated : item));
    setSaved((items) => items.map((item) => item.id === updated.id ? updated : item));
  }

  const allKnownDestinations = useMemo(() => {
    const map = new Map([...destinations, ...saved].map((item) => [item.id, item]));
    return [...map.values()];
  }, [destinations, saved]);

  return (
    <>
      <Header page={page} setPage={setPage} language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} t={t} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {loading && page === 'destinations' ? <LoadingSpinner label={t.loading} /> : (
          <>
            {page === 'home' && <Home t={t} language={language} destinations={allKnownDestinations} setPage={setPage} onOpen={setSelected} onToggleSave={toggleSave} />}
            {page === 'destinations' && <Destinations t={t} language={language} destinations={destinations} categories={categories} filters={filters} setFilters={setFilters} onOpen={setSelected} onToggleSave={toggleSave} />}
            {page === 'saved' && <SavedPlaces t={t} language={language} saved={saved} onOpen={setSelected} onToggleSave={toggleSave} />}
            {page === 'chat' && <Chat t={t} language={language} destinations={allKnownDestinations} onOpen={setSelected} onToggleSave={toggleSave} />}
          </>
        )}
      </main>
      <DestinationModal destination={selected} language={language} t={t} savingAction={selected ? savingActions[selected.id] : null} onClose={() => setSelected(null)} onChanged={updateDestination} onToggleSave={toggleSave} />
    </>
  );
}
