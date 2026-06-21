import DestinationCard from '../components/DestinationCard.jsx';

export default function Home({ t, language, destinations, setPage, onOpen, onToggleSave }) {
  const featured = [...destinations].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const steps = [
    {
      title: t.stepOne,
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80',
      action: t.explore,
      page: 'destinations'
    },
    {
      title: t.stepTwo,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
      action: t.saved,
      page: 'saved'
    },
    {
      title: t.stepThree,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80',
      action: t.askAi,
      page: 'chat'
    }
  ];

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
      <section className="space-y-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">{t.howItWorks}</p>
          <h2 className="text-2xl font-black">{t.travelMadeEasy}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <button
              key={step.title}
              onClick={() => setPage(step.page)}
              className="group overflow-hidden rounded-lg bg-white text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800"
            >
              <div className="relative h-36">
                <img src={step.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
                <span className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-primary text-lg font-black text-white">{index + 1}</span>
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-lg font-black">{step.title}</h3>
                <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition group-hover:bg-primary group-hover:text-white">
                  {step.action}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
