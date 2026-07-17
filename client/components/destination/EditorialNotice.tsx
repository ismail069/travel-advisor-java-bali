import type { ReactNode } from "react";
import type { EditorialNoticeVariant } from "@/types/destination";

type Props = {
  title?: string;
  children: ReactNode;
  variant?: EditorialNoticeVariant;
};

export function EditorialNotice({
  title = "Editorial Notice",
  children,
  variant = "info",
}: Props) {
  return (
    <aside
      data-variant={variant}
      className="not-prose rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-950 data-[variant=warning]:border-amber-300 data-[variant=warning]:bg-amber-50 data-[variant=warning]:text-amber-950 data-[variant=success]:border-emerald-200 data-[variant=success]:bg-emerald-50 data-[variant=success]:text-emerald-950 print:break-inside-avoid"
      role={variant === "warning" ? "alert" : "note"}
    >
      <p className="font-semibold">{title}</p>
      <div className="mt-2 text-sm leading-6 opacity-90">
        {children}
      </div>
    </aside>
  );
}
