import DestinationCard from '../components/DestinationCard.jsx';

export default function Home({ t, language, destinations, setPage, onOpen, onToggleSave }) {
  const featured = [...destinations].sort((a, b) => b.rating - a.rating).slice(0, 3);
  return (
    <div className="space-y-10">
      <section className="rounded-lg bg-gradient-to-br from-teal-700 to-emerald-500 px-5 py-10 text-white sm:px-8">
        <div className="max-w-2xl">
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
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((destination) => <DestinationCard key={destination.id} destination={destination} language={language} t={t} onOpen={onOpen} onToggleSave={onToggleSave} />)}
        </div>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        {[t.stepOne, t.stepTwo, t.stepThree].map((step, index) => <div key={step} className="rounded-lg bg-white p-5 font-semibold dark:bg-slate-900"><span className="mr-2 text-primary">{index + 1}.</span>{step}</div>)}
      </section>
    </div>
  );
}
