import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import LanguageToggle from './LanguageToggle.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header({ page, setPage, language, setLanguage, theme, setTheme, t }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ['home', t.home],
    ['destinations', t.destinations],
    ['saved', t.saved],
    ['chat', t.chatbot]
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <button onClick={() => setPage('home')} className="min-w-0 text-left">
          <div className="text-lg font-black text-primary">JawaBali Trip AI</div>
          <div className="hidden text-xs text-slate-500 sm:block">{t.appTagline}</div>
        </button>
        <button className="rounded-md p-2 md:hidden" onClick={() => setOpen(!open)} aria-label={t.openMenu}>{open ? <X /> : <Menu />}</button>
        <div className="hidden min-w-0 items-center justify-end gap-3 md:flex">
          <Nav nav={nav} page={page} setPage={setPage} />
          <div className="flex shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <LanguageToggle language={language} setLanguage={setLanguage} t={t} />
            <span className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <ThemeToggle theme={theme} setTheme={setTheme} t={t} />
          </div>
        </div>
      </div>
      {open && (
        <div className="space-y-3 border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          <Nav nav={nav} page={page} setPage={(value) => { setPage(value); setOpen(false); }} mobile />
          <div className="flex flex-wrap items-center gap-3">
            <LanguageToggle language={language} setLanguage={setLanguage} t={t} />
            <ThemeToggle theme={theme} setTheme={setTheme} t={t} />
          </div>
        </div>
      )}
    </header>
  );
}

function Nav({ nav, page, setPage, mobile }) {
  return (
    <nav className={mobile ? 'grid gap-2' : 'flex min-w-0 items-center gap-1'}>
      {nav.map(([key, label]) => (
        <button key={key} onClick={() => setPage(key)} className={`rounded-md px-3 py-2 text-sm font-semibold ${page === key ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
          {label}
        </button>
      ))}
    </nav>
  );
}
