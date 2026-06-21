import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ theme, setTheme, t }) {
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="flex h-9 items-center gap-2 rounded-full border border-slate-200 px-3 text-xs font-medium dark:border-slate-700"
      aria-label={t.theme}
    >
      {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
      {theme === 'light' ? t.light : t.dark}
    </button>
  );
}
