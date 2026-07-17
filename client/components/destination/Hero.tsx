import type { HeroProps } from "@/types/destination";

export function Hero({
  eyebrow,
  title,
  summary,
  imageSrc,
  imageAlt,
}: HeroProps) {
  return (
    <header className="not-prose overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm print:shadow-none">
      <div className="space-y-6 p-6 sm:p-9">
      {eyebrow ? (
        <p className="text-xs font-black uppercase tracking-[.18em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          {summary}
        </p>
      </div>
      {imageSrc ? (
        <figure className="overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={imageSrc}
            alt={imageAlt ?? ""}
            className="aspect-[16/9] w-full object-cover"
          />
        </figure>
      ) : null}
      </div>
    </header>
  );
}
