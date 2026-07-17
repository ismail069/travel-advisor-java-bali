type Props = {
  title?: string;
  items: string[];
};

export function BestFor({ title = "Best For", items = [] }: Props) {
  return (
    <section className="not-prose space-y-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 print:break-inside-avoid">
      <h2 className="text-2xl font-black text-emerald-950">{title}</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-white/70 p-3 font-bold text-emerald-950">✓ {item}</li>
        ))}
      </ul>
    </section>
  );
}
