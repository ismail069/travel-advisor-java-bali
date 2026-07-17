import type { TicketEntry } from "@/types/destination";

type Props = {
  title?: string;
  entries: TicketEntry[];
  lastVerified?: string;
};

export function TicketInformation({
  title = "Ticket Information",
  entries = [],
  lastVerified,
}: Props) {
  const isIndonesian = title.toLowerCase().includes("informasi");
  const labels = isIndonesian
    ? {
        category: "Kategori",
        price: "Harga",
        notes: "Catatan",
        verified: "Terakhir diverifikasi",
      }
    : {
        category: "Category",
        price: "Price",
        notes: "Notes",
        verified: "Last verified",
      };

  return (
    <section className="not-prose space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid sm:p-6">
      <h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="w-1/4 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-600">
                {labels.category}
              </th>
              <th className="w-1/4 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-600">
                {labels.price}
              </th>
              <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-600">
                {labels.notes}
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={`${entry.label}-${entry.price}`} className="border-t border-slate-200">
                <td className="px-4 py-4 align-top font-semibold text-slate-900">{entry.label}</td>
                <td className="px-4 py-4 align-top font-medium text-slate-800">{entry.price}</td>
                <td className="px-4 py-4 align-top leading-6 text-slate-600">{entry.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {lastVerified ? (
        <p className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
          {labels.verified}: {lastVerified}
        </p>
      ) : null}
    </section>
  );
}
