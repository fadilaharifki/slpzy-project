"use client";
import { Fragment } from "react";
import { cn } from "@/lib/cn";

const DOT_DARK = <span aria-hidden className="mx-8 inline-block h-1 w-1 rounded-full bg-paper/35 align-middle" />;
const DOT_LIGHT = <span aria-hidden className="mx-8 inline-block h-1 w-1 rounded-full bg-ink/30 align-middle" />;

interface Props {
  items: string[];
  variant?: "dark" | "sage" | "light";
}

export function MarqueeTicker({ items, variant = "dark" }: Props) {
  const looped = [...items, ...items];
  return (
    <div
      className={cn(
        "py-4",
        variant === "dark" && "bg-ink2 text-paper border-y border-ink2",
        variant === "sage" && "bg-sage text-paper border-y border-sage-deep",
        variant === "light" && "bg-cream text-ink border-y border-line",
      )}
    >
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee">
          {looped.map((text, i) => (
            <Fragment key={i}>
              <span className="whitespace-nowrap text-xs font-medium tracking-wider">{text}</span>
              {variant === "light" ? DOT_LIGHT : DOT_DARK}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
