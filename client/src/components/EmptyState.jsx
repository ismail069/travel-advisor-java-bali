import { MapPinned } from 'lucide-react';

export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
      <MapPinned className="mx-auto mb-3 text-primary" />
      <h3 className="font-semibold">{title}</h3>
      {message && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{message}</p>}
    </div>
  );
}
