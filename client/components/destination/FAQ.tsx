import type { FAQItem } from "@/types/destination";

type Props = {
  title?: string;
  items: FAQItem[];
};

export function FAQ({ title = "Frequently Asked Questions", items = [] }: Props) {
  return (
    <section className="not-prose space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
        {items.map((item) => (
          <details key={item.question} className="group p-4">
            <summary className="cursor-pointer font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {item.question}
            </summary>
            <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
