export default function LanguageToggle({ language, setLanguage, t }) {
  return (
    <label className="flex shrink-0 items-center gap-2 text-xs font-semibold">
      <span className="text-slate-600 dark:text-slate-300">{t.language}</span>
      <button
        type="button"
        onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
        className="relative grid h-9 w-[92px] grid-cols-2 items-center rounded-full bg-slate-200 p-1 text-xs dark:bg-slate-700"
        aria-label={t.language}
      >
        <span className={`absolute left-1 top-1 h-7 w-[42px] rounded-full bg-primary transition-transform ${language === 'en' ? 'translate-x-[42px]' : 'translate-x-0'}`} />
        <span className={`relative z-10 text-center ${language === 'id' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>ID</span>
        <span className={`relative z-10 text-center ${language === 'en' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>EN</span>
      </button>
    </label>
  );
}
