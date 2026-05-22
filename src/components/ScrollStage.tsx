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

export function ScrollStage({ variant = "lift", children, className, curtainColor = "var(--cream)", pinHeight = 100, id }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 visibility progress
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 → fully below; 0.5 → centered; 1 → fully above
      const p = 1 - (rect.top + rect.height * 0.5) / (vh + rect.height * 0.5);
      const clamped = Math.max(0, Math.min(1, p));
      setProgress(clamped);
      setInView(rect.bottom > 0 && rect.top < vh);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Map progress to motion values per variant
  const styles: React.CSSProperties = {};
  const inner = innerRef.current;
  void inner;

  if (variant === "lift") {
    const t = inView ? Math.max(0, 1 - progress * 1.4) : 1;
    styles.opacity = inView ? Math.min(1, progress * 2.2) : 0;
    styles.transform = `translateY(${t * 36}px)`;
  } else if (variant === "scale") {
    const enter = Math.min(1, progress * 2.4);
    const exit = progress > 0.55 ? Math.max(0, 1 - (progress - 0.55) * 1.6) : 1;
    styles.opacity = enter * exit;
    styles.transform = `scale(${0.94 + 0.06 * enter * exit})`;
  } else if (variant === "parallax") {
    // Slow drift: -40px → +40px across the visible range
    const shift = (progress - 0.5) * 80;
    styles.transform = `translateY(${-shift}px)`;
    styles.opacity = inView ? 1 : 0;
  } else if (variant === "curtain") {
    // Two-stage clip: open from center
    const open = Math.min(1, progress * 2);
    styles.clipPath = `inset(${(1 - open) * 50}% 0 ${(1 - open) * 50}% 0)`;
    styles.opacity = open;
  } else if (variant === "stack") {
    // Outgoing scale + blur while pinned
    const scale = 1 - Math.max(0, progress - 0.6) * 0.08;
    const blur = Math.max(0, progress - 0.7) * 8;
    styles.transform = `scale(${scale})`;
    styles.filter = `blur(${blur}px)`;
  } else if (variant === "blanket") {
    // Rise in sync with scroll: progress maps directly to position,
    // with a gentle ease-out curve so the tail end decelerates nicely.
    const eased = Math.pow(Math.min(1, progress * 1.8), 0.7);
    const pct = (1 - eased) * 100;
    styles.transform = `translateY(${pct}%)`;
  }

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "relative",
        variant === "stack" && "h-[100vh]",
        variant === "blanket" && "z-10",
        className,
      )}
      style={variant === "stack" ? { minHeight: `${pinHeight}vh` } : undefined}
    >
      <div
        ref={innerRef}
        className={cn(
          variant === "blanket"
            ? "transition-transform duration-[120ms] ease-out will-change-transform overflow-hidden"
            : "transition-[transform,opacity,filter,clip-path] duration-[60ms] ease-linear will-change-transform",
          variant === "stack" && "sticky top-0 h-screen",
        )}
        style={{
          ...styles,
          ...(variant === "blanket"
            ? { borderRadius: "2.5rem 2.5rem 0 0" }
            : {}),
        }}
      >
        {variant === "curtain" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-px h-12 z-10"
            style={{
              background: `radial-gradient(120% 100% at 50% 0%, ${curtainColor} 0, ${curtainColor} 70%, transparent 71%)`,
            }}
          />
        )}
        {children}
      </div>
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
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((t) => {
      t.style.opacity = "0";
      t.style.transform = "translateY(28px)";
      t.style.transition = "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)";
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
