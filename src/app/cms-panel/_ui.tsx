// Shared CMS UI primitives — lightweight, brand-aligned (cream / ink / sage).
import { cn } from "@/lib/cn";

export function CmsCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-line bg-paper p-6", className)}>{children}</div>;
}

export function CmsPageHead({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 border-b border-line pb-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {desc && <p className="mt-1.5 text-sm font-light text-ink/60">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-[10px] uppercase tracking-widest text-ink/45">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-ink">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-ink/50">{hint}</p>}
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-sky-100 text-sky-700",
  processing: "bg-violet-100 text-violet-700",
  shipped: "bg-blue-100 text-blue-700",
  completed: "bg-sage/25 text-sage-deep",
  cancelled: "bg-rose-100 text-rose-700",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
        STATUS_TONE[status] ?? "bg-ink/10 text-ink/60",
      )}
    >
      {status}
    </span>
  );
}

export function cmsInput(extra?: string) {
  return cn(
    "w-full rounded-lg border border-line bg-cream/40 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors",
    "placeholder:text-ink/35 focus:border-sage focus:bg-paper",
    extra,
  );
}

export function CmsLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-ink/50">{children}</label>;
}
