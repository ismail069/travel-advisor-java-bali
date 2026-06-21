export default function LanguageToggle({ language, setLanguage, t }) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium">
      <span>{t.language}</span>
      <button
        type="button"
        onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
        className="relative h-8 w-20 rounded-full bg-slate-200 p-1 text-xs dark:bg-slate-700"
      >
        <span className={`absolute top-1 h-6 w-9 rounded-full bg-primary transition ${language === 'en' ? 'translate-x-9' : 'translate-x-0'}`} />
        <span className="relative z-10 flex justify-around">
          <span className={language === 'id' ? 'text-white' : ''}>ID</span>
          <span className={language === 'en' ? 'text-white' : ''}>EN</span>
        </span>
      </button>
    </label>
  );
}
