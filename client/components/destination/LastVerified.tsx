type Props = {
  date: string;
  note?: string;
};

export function LastVerified({ date, note }: Props) {
  return (
    <aside className="not-prose rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm print:break-inside-avoid">
      <p className="font-black text-slate-900">Last verified: <time dateTime={date}>{date}</time></p>
      {note ? <p className="mt-1 leading-6 text-slate-600">{note}</p> : null}
    </aside>
  );
}
