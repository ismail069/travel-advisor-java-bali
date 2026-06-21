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

  async function toggleSave(destination) {
    if (destination.is_saved) await api.unsave(destination.id);
    else await api.save(destination.id);
    await refreshSaved();
    await loadDestinations();
    setSelected((current) => current?.id === destination.id ? { ...current, is_saved: destination.is_saved ? 0 : 1 } : current);
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
      <DestinationModal destination={selected} language={language} t={t} onClose={() => setSelected(null)} onChanged={updateDestination} onToggleSave={toggleSave} />
    </>
  );
}
