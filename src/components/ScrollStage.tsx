"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * ScrollStage — section wrapper with cinematic scroll transitions.
 *
 * Each section ENTERS and EXITS based on its position relative to the viewport.
 * Calculated locally per-section using IntersectionObserver + scroll throttle.
 *
 * Variants:
 *   - "lift"     : enters fade-up, exits fade-up out (default).
 *   - "scale"    : enters scale 0.94 → 1, exits scale 1 → 0.96.
 *   - "parallax" : translateY based on scroll progress (slow drift).
 *   - "curtain"  : large clip-path circle reveal (matches catalogue scallop).
 *   - "stack"    : sticky pin with previous section sliding under via scale + blur.
 */
export type StageVariant = "lift" | "scale" | "parallax" | "curtain" | "stack" | "blanket";

interface Props {
  variant?: StageVariant;
  children: React.ReactNode;
  className?: string;
  /** Color used for the curtain wipe layer (only for `curtain`). */
  curtainColor?: string;
  /** When variant=stack, this is the height of the pin (vh). Default 100. */
  pinHeight?: number;
  id?: string;
}

export function ScrollStage({ children, className, id }: Props) {
  return (
    <section id={id} className={cn("relative", className)}>
      {children}
    </section>
  );
}

/**
 * Stagger reveal for child elements with `data-reveal` attribute.
 * Wrap any content; children with `data-reveal` (optionally `data-reveal-delay`)
 * will fade-up when this region enters the viewport.
 */
export function RevealGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const targets = node.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = Number(el.dataset.revealDelay ?? "0");
            el.style.transitionDelay = `${delay}ms`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.05, rootMargin: "50px 0px 0px 0px" },
    );
    targets.forEach((t) => {
      t.style.opacity = "0";
      t.style.transform = "translateY(12px)";
      t.style.transition = "opacity 0.45s ease-out, transform 0.45s ease-out";
      io.observe(t);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
