import Link from "next/link";
import type { NearbyDestination } from "@/types/destination";
import { nearbyMetadata } from "@/lib/destination-component-utils";

type Props = {
  title?: string;
  items: NearbyDestination[];
};

export function NearbyDestinations({
  title = "Nearby Destinations",
  items = [],
}: Props) {
  return (
    <section className="not-prose space-y-4 rounded-3xl border border-slate-200 bg-white p-6 print:break-inside-avoid">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <Link
            key={`${item.href}-${item.name}-${index}`}
            href={item.href}
            className="rounded-xl border border-slate-200 p-4 transition hover:border-primary hover:bg-primary/5"
          >
            <p className="font-semibold">{item.name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {nearbyMetadata(item)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
