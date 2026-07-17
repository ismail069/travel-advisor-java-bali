type Props = {
  title?: string;
  items: string[];
};

export function TravelTips({ title = "Travel Tips", items = [] }: Props) {
  return (
    <section className="not-prose space-y-4 rounded-3xl border border-slate-200 bg-white p-6 print:break-inside-avoid">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <ol className="space-y-2">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3 rounded-xl bg-slate-50 p-3 text-slate-700">
            <span className="font-black text-primary">{index + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
