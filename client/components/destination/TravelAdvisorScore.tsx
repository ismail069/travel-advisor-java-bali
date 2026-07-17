import type { ScoreItem } from "@/types/destination";
import { scoreToPercent } from "@/lib/destination-component-utils";

type Props = {
  title?: string;
  items: ScoreItem[];
};

export function TravelAdvisorScore({
  title = "Travel Advisor Score",
  items = [],
}: Props) {
  return (
    <section className="not-prose space-y-4 rounded-3xl border border-slate-200 bg-white p-6 print:break-inside-avoid">
      <h2 className="text-2xl font-black text-slate-950">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-900">{item.label}</span>
              <span
                aria-label={`${item.score} dari 5`}
                className="font-black text-primary"
              >
                {item.score}/5
              </span>
            </div>
            <div
              aria-hidden="true"
              className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${scoreToPercent(item.score)}%` }}
              />
            </div>
            {item.explanation ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.explanation}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
