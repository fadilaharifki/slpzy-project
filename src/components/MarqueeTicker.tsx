"use client";
import { Fragment } from "react";
import { cn } from "@/lib/cn";

const DOT_DARK = <span aria-hidden className="mx-8 inline-block h-1 w-1 rounded-full bg-paper/35 align-middle" />;
const DOT_LIGHT = <span aria-hidden className="mx-8 inline-block h-1 w-1 rounded-full bg-ink/30 align-middle" />;

interface Props {
  items: string[];
  images?: string[];
  variant?: "dark" | "sage" | "light";
}

export function MarqueeTicker({ items, images = [], variant = "dark" }: Props) {
  const baseItems = items.length > 0 ? items : ["100% Certified TENCEL™ Lyocell"];
  const looped = [...baseItems, ...baseItems];
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
          {looped.map((text, i) => {
            const img = images.length > 0 ? images[i % images.length] : null;
            return (
              <Fragment key={i}>
                <span className="inline-flex items-center gap-2.5 whitespace-nowrap text-xs font-medium tracking-wider">
                  {img && (
                    <span
                      className="inline-block h-4 w-4 rounded-full bg-cover bg-center shrink-0 border border-current/25"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  )}
                  {text}
                </span>
                {variant === "light" ? DOT_LIGHT : DOT_DARK}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
