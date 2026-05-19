import { cn } from "@/lib/cn";

interface Props {
  className?: string;
  /** Tailwind text-color class controlling fill. */
  tone?: string;
}

/**
 * SLPZY custom wordmark — geometric rounded lowercase with a distinctive flag
 * accent above the first "S" and a tail descender on "y". Built with SVG path
 * so the logo scales crisply at any size and inherits color via currentColor.
 */
export function Logo({ className, tone = "text-ink" }: Props) {
  return (
    <img
      src="/slpzy-logo.png"
      alt="SLPZY"
      className={cn("h-[120px] w-auto", tone, className)}
    />
  );
}

/** Compact monogram (just the S with flag) — used for favicon-y placements. */
export function LogoMark({ className, tone = "text-ink" }: { className?: string; tone?: string }) {
  return (
    <svg
      viewBox="0 0 66 90"
      fill="currentColor"
      role="img"
      aria-label="SLPZY mark"
      className={cn("h-6 w-auto", tone, className)}
    >
      <path d="M22 4 C22 4, 30 6, 30 16 L30 22 L18 22 L18 14 C18 7, 22 4, 22 4 Z" />
      <path d="M40 28 C26 28, 20 36, 20 44 C20 52, 26 56, 38 58 C46 59, 50 60, 50 64 C50 67, 46 69, 40 69 C32 69, 24 66, 20 60 L20 76 C26 80, 34 82, 42 82 C58 82, 66 74, 66 64 C66 55, 60 50, 46 48 C38 47, 36 45, 36 42 C36 39, 40 37, 46 37 C52 37, 58 39, 62 43 L62 31 C57 28, 50 27, 42 27 Z" />
    </svg>
  );
}
