import { Cookie, MapPinned } from 'lucide-react';
import { useState } from 'react';

export default function WelcomeTravelerModal({ t, onAccept, onDecline }) {
  const [name, setName] = useState('');

  function submit(event) {
    event.preventDefault();
    onAccept(name.trim() || 'Traveler');
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-slate-900">
        <div className="relative min-h-44 bg-slate-950 p-6 text-white">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80"
            alt="Mountain and lake travel landscape"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-primary/40" />
          <div className="relative">
            <MapPinned className="mb-4" />
            <h2 className="text-2xl font-black">{t.welcomeTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-white/90">{t.welcomeText}</p>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <label className="block text-sm font-semibold">
            {t.travelerName}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t.travelerNamePlaceholder}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 font-normal dark:border-slate-700 dark:bg-slate-950"
              autoFocus
            />
          </label>
          <div className="flex gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Cookie className="mt-0.5 shrink-0 text-primary" size={18} />
            <p>{t.cookieConsentText}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="submit" className="rounded-md bg-primary px-4 py-3 font-bold text-white">{t.acceptCookies}</button>
            <button type="button" onClick={onDecline} className="rounded-md border border-slate-300 px-4 py-3 font-bold dark:border-slate-700">{t.notNow}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
