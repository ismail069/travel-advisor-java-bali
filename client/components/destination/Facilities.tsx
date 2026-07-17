import type { FacilityItem } from "@/types/destination";

type Props = {
  title?: string;
  items: FacilityItem[];
};

export function Facilities({ title = "Facilities", items = [] }: Props) {
  return (
    <section className="not-prose space-y-4 rounded-3xl border border-slate-200 bg-white p-6 print:break-inside-avoid">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.label} className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{item.label}</span>
              <span className={item.available ? "font-bold text-emerald-700" : "font-bold text-slate-500"}>{item.available ? "Available" : "Not available"}</span>
            </div>
            {item.note ? (
              <p className="mt-2 text-sm text-slate-500">{item.note}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
