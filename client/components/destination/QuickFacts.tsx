import type { QuickFact } from "@/types/destination";

type QuickFactsProps = {
  title?: string;
  items: QuickFact[];
};

export function QuickFacts({ title = "Quick Facts", items = [] }: QuickFactsProps) {
  return (
    <section className="not-prose space-y-4 rounded-3xl border border-slate-200 bg-white p-6 print:break-inside-avoid">
      <h2 className="text-2xl font-black text-slate-950">
        {title}
      </h2>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={`${item.label}-${item.value}`} className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-black uppercase tracking-wider text-slate-500">{item.label}</dt>
            <dd className="mt-2 font-bold text-slate-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
