import { cn } from "@/lib/cn";

type IconName = "cloud" | "snow" | "leaf";

interface Props {
  icon: IconName;
  title: string;
  body: string;
  tone?: "light" | "dark";
  /** Border frame around icon like catalogue */
  framed?: boolean;
  className?: string;
}

export function ValueProp({ icon, title, body, tone = "light", framed = true, className }: Props) {
  const isDark = tone === "dark";
  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center",
          framed && (isDark ? "border border-paper/50" : "border border-ink/25"),
        )}
      >
        <Icon name={icon} className={cn("h-7 w-7", isDark ? "text-paper" : "text-ink")} />
      </div>
      <div>
        <h4 className={cn("text-base font-semibold", isDark ? "text-paper" : "text-ink")}>{title}</h4>
        <p className={cn("mt-2 max-w-[24ch] text-sm font-light leading-relaxed", isDark ? "text-paper/75" : "text-ink/70")}>
          {body}
        </p>
      </div>
    </div>
  );
}

function Icon({ name, className }: { name: IconName; className?: string }) {
  if (name === "cloud") {
    return (
      <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden>
        <path d="M50 38 C56 38, 60 34, 60 28 C60 21, 54 17, 48 18 C46 11, 39 7, 32 7 C24 7, 18 13, 17 21 C9 22, 4 28, 4 36 C4 44, 11 50, 19 50 L50 50 C56 50, 60 46, 60 40 C60 39, 60 39, 50 38 Z" />
      </svg>
    );
  }
  if (name === "snow") {
    return (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className} aria-hidden>
        <line x1="32" y1="6" x2="32" y2="58" />
        <line x1="8" y1="32" x2="56" y2="32" />
        <line x1="15" y1="15" x2="49" y2="49" />
        <line x1="49" y1="15" x2="15" y2="49" />
        <polyline points="28 10, 32 14, 36 10" />
        <polyline points="28 54, 32 50, 36 54" />
        <polyline points="10 28, 14 32, 10 36" />
        <polyline points="54 28, 50 32, 54 36" />
      </svg>
    );
  }
  // leaf / recycle for sustainability
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden>
      <path d="M32 6 C18 6, 8 18, 8 32 C8 46, 18 58, 32 58 C46 58, 58 46, 58 32 C58 18, 46 6, 32 6 Z M32 14 C42 14, 50 22, 50 32 C50 42, 42 50, 32 50 C22 50, 14 42, 14 32 C14 22, 22 14, 32 14 Z" opacity="0.0" />
      <path d="M32 14 C24 14, 18 22, 22 32 C26 25, 30 22, 36 22 C30 28, 28 32, 28 38 C28 42, 30 46, 34 46 C42 46, 48 38, 44 28 C40 35, 36 38, 32 38 C36 32, 38 28, 38 22 C38 18, 36 14, 32 14 Z" />
    </svg>
  );
}
