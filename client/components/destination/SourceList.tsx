import type { SourceItem } from "@/types/destination";

type Props = {
  title?: string;
  items: SourceItem[];
};

export function SourceList({ title = "Sources", items = [] }: Props) {
  return (
    <section className="not-prose space-y-4 rounded-3xl border border-slate-200 bg-white p-6 print:break-inside-avoid">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <ol className="space-y-3">
        {items.map((item) => (
          <li key={item.url} className="rounded-xl bg-slate-50 p-3">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer nofollow"
              className="font-bold text-primary underline decoration-primary/30 underline-offset-4"
            >
              {item.title}
            </a>
            <p className="mt-1 text-sm text-slate-500">
              {[item.organization, item.accessedAt]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
