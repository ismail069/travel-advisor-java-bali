type Props = {
  title?: string;
  items: string[];
};

export function AvoidIf({ title = "Avoid If", items = [] }: Props) {
  return (
    <section className="not-prose space-y-3 rounded-3xl border border-amber-200 bg-amber-50 p-6 print:break-inside-avoid">
      <h2 className="text-2xl font-black text-amber-950">{title}</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-xl border-l-4 border-amber-500 bg-white/70 p-3 text-amber-950">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
