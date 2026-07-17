import type { AccessibilityItem } from "@/types/destination";
import { accessibilityLabel } from "@/lib/destination-component-utils";

const statusClasses = { available: "bg-emerald-100 text-emerald-800", partial: "bg-amber-100 text-amber-900", unavailable: "bg-rose-100 text-rose-800", unknown: "bg-slate-200 text-slate-700" } as const;

type Props = {
  title?: string;
  items: AccessibilityItem[];
};

export function Accessibility({ title = "Accessibility", items = [] }: Props) {
  return (
    <section className="not-prose space-y-4 rounded-3xl border border-slate-200 bg-white p-6 print:break-inside-avoid">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-slate-50 p-3">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="font-medium">{item.label}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-black ${statusClasses[item.status]}`}>{accessibilityLabel(item.status)}</span>
            </div>
            {item.note ? (
              <p className="mt-2 text-sm text-slate-500">{item.note}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
