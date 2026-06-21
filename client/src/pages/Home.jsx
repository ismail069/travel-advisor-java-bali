import DestinationCard from '../components/DestinationCard.jsx';

export default function Home({ t, language, destinations, setPage, onOpen, onToggleSave }) {
  const featured = [...destinations].sort((a, b) => b.rating - a.rating).slice(0, 6);
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-lg bg-slate-950 px-5 py-14 text-white shadow-xl sm:px-8">
        <img
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80"
          alt="Bali rice terraces landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-purple-950/60 to-primary/40" />
        <div className="relative max-w-2xl">
          <h1 className="text-3xl font-black sm:text-5xl">{t.heroTitle}</h1>
          <p className="mt-4 text-white/90">{t.heroText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setPage('chat')} className="rounded-md bg-white px-5 py-3 font-bold text-primary">{t.askAi}</button>
            <button onClick={() => setPage('destinations')} className="rounded-md border border-white/70 px-5 py-3 font-bold">{t.explore}</button>
          </div>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-bold">{t.featured}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((destination) => <DestinationCard key={destination.id} destination={destination} language={language} t={t} onOpen={onOpen} onToggleSave={onToggleSave} />)}
        </div>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        {[t.stepOne, t.stepTwo, t.stepThree].map((step, index) => <div key={step} className="rounded-lg bg-white p-5 font-semibold dark:bg-slate-900"><span className="mr-2 text-primary">{index + 1}.</span>{step}</div>)}
      </section>
    </div>
  );
}
