import type { OpeningHoursEntry } from "@/types/destination";

type Props = {
  title?: string;
  entries: OpeningHoursEntry[];
  lastVerified?: string;
};

export function OpeningHours({
  title = "Opening Hours",
  entries = [],
  lastVerified,
}: Props) {
  return (
    <section className="not-prose space-y-4 rounded-3xl border border-slate-200 bg-white p-6 print:break-inside-avoid">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={`${entry.dayLabel}-${entry.hours}`}
            className="grid gap-1 rounded-xl bg-slate-50 p-3 sm:grid-cols-[180px_1fr]"
          >
            <span className="font-medium">{entry.dayLabel}</span>
            <div>
              <p>{entry.hours}</p>
              {entry.note ? (
                <p className="text-sm text-slate-500">{entry.note}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {lastVerified ? (
        <p className="text-sm text-slate-500">
          Last verified: {lastVerified}
        </p>
      ) : null}
    </section>
  );
}
