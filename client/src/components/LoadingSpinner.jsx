export default function LoadingSpinner({ label }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-sm text-slate-600 dark:text-slate-300">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
