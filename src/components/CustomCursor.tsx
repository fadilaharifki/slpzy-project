"use client";
import { useEffect, useRef, useState } from "react";

/**
 * 10 cursor variants for SLPZY. Switch by changing the `variant` prop in layout.tsx.
 *
 *   ── Generic ──
 *   "dot-ring"  → small dot + lagging ring (original)
 *   "label"     → dot + contextual word ("OPEN", "ADD", "PAY")
 *   "magnet"    → dot that morphs into a frame around the hovered element
 *   "blob"      → soft squishy blob that stretches with movement
 *   "trail"     → comet trail of fading dots
 *   "crosshair" → thin lines + center dot, studio shoot vibe
 *   "native"    → disable custom cursor
 *
 *   ── Bedsheet-themed (recommended) ──
 *   "cloud"     → soft fluffy cloud puff that breathes — matches "Exceptional Softness" icon
 *   "silk"      → flowing silk ribbon trail with sage gradient — matches TENCEL fabric drape
 *   "stitch"    → dotted stitching line drops behind cursor — matches tailor craftsmanship
 *   "dreamz"    → tiny "z" letters drift up from cursor — sleep / drowsiness vibe
 *   "ripple"    → concentric sage rings emit from cursor periodically — silk ripple
 */
export type CursorVariant =
  | "dot-ring"
  | "label"
  | "magnet"
  | "blob"
  | "trail"
  | "crosshair"
  | "native"
  | "cloud"
  | "silk"
  | "stitch"
  | "dreamz"
  | "ripple";

export function CustomCursor({ variant = "silk" }: { variant?: CursorVariant }) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setSupported(canHover);
  }, []);

  if (!supported || variant === "native") {
    // Restore native cursor when in native mode
    if (variant === "native") {
      if (typeof document !== "undefined") {
        document.documentElement.style.cursor = "auto";
      }
    }
    return null;
  }

  if (variant === "dot-ring") return <DotRingCursor />;
  if (variant === "label") return <LabelCursor />;
  if (variant === "magnet") return <MagnetCursor />;
  if (variant === "blob") return <BlobCursor />;
  if (variant === "trail") return <TrailCursor />;
  if (variant === "crosshair") return <CrosshairCursor />;
  if (variant === "cloud") return <CloudCursor />;
  if (variant === "silk") return <SilkCursor />;
  if (variant === "stitch") return <StitchCursor />;
  if (variant === "dreamz") return <DreamzCursor />;
  if (variant === "ripple") return <RippleCursor />;
  return null;
}

// ──────────────────────────────────────────────────────────────────────
// Shared mouse-tracking hook
// ──────────────────────────────────────────────────────────────────────
function useMousePos() {
  const pos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}

// Tag interactive elements with hover state
function useHoverTarget() {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const interactive = ["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "LABEL"];
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return setTarget(null);
      const t = interactive.includes(el.tagName)
        ? el
        : (el.closest("a, button, [role='button']") as HTMLElement | null);
      setTarget(t);
    };
    window.addEventListener("mouseover", onOver);
    return () => window.removeEventListener("mouseover", onOver);
  }, []);
  return target;
}

// ──────────────────────────────────────────────────────────────────────
// Variant 1: Dot + lagging ring (original)
// ──────────────────────────────────────────────────────────────────────
function DotRingCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const target = useHoverTarget();

  useEffect(() => {
    if (target) ring.current?.classList.add("scale-[2.2]");
    else ring.current?.classList.remove("scale-[2.2]");
  }, [target]);

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    const r = { x: 0, y: 0 };
    let raf = 0;
    const move = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${mouse.x - 3}px, ${mouse.y - 3}px, 0)`;
    };
    const tick = () => {
      r.x += (mouse.x - r.x) * 0.18;
      r.y += (mouse.y - r.y) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${r.x - 18}px, ${r.y - 18}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-sage-deep mix-blend-multiply" style={{ willChange: "transform" }} />
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-sage-deep/70 mix-blend-multiply transition-transform duration-300 ease-smooth" style={{ willChange: "transform" }} />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Variant 2: Label cursor (recommended — premium editorial)
// ──────────────────────────────────────────────────────────────────────
function LabelCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const target = useHoverTarget();

  useEffect(() => {
    if (!target) return setLabel(null);
    // Cursor label can be set explicitly via data-cursor="..." on any element
    const explicit = target.getAttribute("data-cursor");
    if (explicit) return setLabel(explicit);
    // Sensible defaults by tag/role
    if (target.tagName === "A") setLabel("Open");
    else if (target.tagName === "BUTTON") {
      const text = (target.textContent || "").toLowerCase();
      if (text.includes("add to bag") || text.includes("add to cart")) setLabel("Add");
      else if (text.includes("checkout")) setLabel("Pay");
      else if (text.includes("subscribe")) setLabel("Send");
      else if (text.includes("send")) setLabel("Send");
      else setLabel("Tap");
    } else setLabel(null);
  }, [target]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ willChange: "transform" }}
    >
      <div
        className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-sage-deep transition-all duration-300 ease-smooth"
        style={{ transform: label ? "scale(0)" : "scale(1)" }}
      />
      <div
        className={`absolute left-3 top-3 origin-top-left whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-widest text-paper transition-all duration-300 ease-smooth ${
          label ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {label ?? ""}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Variant 3: Magnet cursor — dot morphs to frame the hovered element
// ──────────────────────────────────────────────────────────────────────
function MagnetCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useHoverTarget();
  const mouse = useMousePos();

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (!el) return (raf = requestAnimationFrame(tick));
      if (target) {
        const rect = target.getBoundingClientRect();
        el.style.transform = `translate3d(${rect.left - 6}px, ${rect.top - 6}px, 0)`;
        el.style.width = `${rect.width + 12}px`;
        el.style.height = `${rect.height + 12}px`;
        el.style.borderRadius = "999px";
        el.style.opacity = "1";
      } else {
        el.style.transform = `translate3d(${mouse.current.x - 6}px, ${mouse.current.y - 6}px, 0)`;
        el.style.width = "12px";
        el.style.height = "12px";
        el.style.borderRadius = "9999px";
        el.style.opacity = "1";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, mouse]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] border border-sage-deep/80 mix-blend-multiply transition-[width,height,border-radius,opacity] duration-300 ease-smooth"
      style={{ willChange: "transform, width, height" }}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────
// Variant 4: Soft squishy blob
// ──────────────────────────────────────────────────────────────────────
function BlobCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useHoverTarget();

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let prevTime = performance.now();
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const tick = (t: number) => {
      const dt = Math.max(1, t - prevTime);
      prevTime = t;
      const px = pos.x;
      const py = pos.y;
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;
      const vx = (pos.x - px) / dt;
      const vy = (pos.y - py) / dt;
      const speed = Math.min(2.2, Math.hypot(vx, vy) * 6);
      const stretchX = 1 + speed * 0.18;
      const stretchY = 1 - speed * 0.1;
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      if (ref.current) {
        const scale = target ? 2.6 : 1;
        ref.current.style.transform = `translate3d(${pos.x - 14}px, ${pos.y - 14}px, 0) rotate(${angle}deg) scale(${stretchX * scale}, ${stretchY * scale})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [target]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-7 w-7 rounded-full bg-sage/60 mix-blend-multiply backdrop-blur-sm"
      style={{ willChange: "transform" }}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────
// Variant 5: Comet trail
// ──────────────────────────────────────────────────────────────────────
function TrailCursor() {
  const refs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    const trail = refs.map(() => ({ x: 0, y: 0 }));
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const tick = () => {
      let prev = mouse;
      for (let i = 0; i < refs.length; i++) {
        const ease = 0.2 - i * 0.025;
        trail[i].x += (prev.x - trail[i].x) * ease;
        trail[i].y += (prev.y - trail[i].y) * ease;
        const el = refs[i].current;
        if (el) {
          const size = 12 - i * 2;
          el.style.transform = `translate3d(${trail[i].x - size / 2}px, ${trail[i].y - size / 2}px, 0)`;
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.opacity = `${1 - i * 0.18}`;
        }
        prev = trail[i];
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {refs.map((r, i) => (
        <div
          key={i}
          ref={r}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-sage-deep mix-blend-multiply"
          style={{ willChange: "transform" }}
        />
      ))}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Variant 6: Crosshair
// ──────────────────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────────────
// Variant 7: Cloud puff — matches "Exceptional Softness" cloud icon
// ──────────────────────────────────────────────────────────────────────
function CloudCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useHoverTarget();

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    const move = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const tick = () => {
      pos.x += (mouse.x - pos.x) * 0.22;
      pos.y += (mouse.y - pos.y) * 0.22;
      if (ref.current) {
        const scale = target ? 1.55 : 1;
        ref.current.style.transform = `translate3d(${pos.x - 22}px, ${pos.y - 18}px, 0) scale(${scale})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, [target]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] animate-breathe transition-transform duration-300 ease-smooth"
      style={{ willChange: "transform" }}
    >
      <svg width="44" height="36" viewBox="0 0 64 50" className="text-sage/70 mix-blend-multiply">
        <path
          d="M50 30 C56 30, 60 26, 60 20 C60 13, 54 9, 48 10 C46 4, 39 1, 32 1 C24 1, 18 6, 17 13 C9 14, 4 19, 4 27 C4 34, 11 39, 19 39 L50 39 C56 39, 60 36, 60 32 C60 31, 60 31, 50 30 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Variant 8: Silk ribbon — flowing fabric trail with sage gradient
// ──────────────────────────────────────────────────────────────────────
function SilkCursor() {
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const target = useHoverTarget();

  useEffect(() => {
    const POINTS = 18;
    const mouse = { x: 0, y: 0 };
    const pts: { x: number; y: number }[] = Array.from({ length: POINTS }, () => ({ x: 0, y: 0 }));
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const tick = () => {
      // First point follows mouse fastest
      pts[0].x += (mouse.x - pts[0].x) * 0.32;
      pts[0].y += (mouse.y - pts[0].y) * 0.32;
      // Each subsequent point trails the previous, easing more for a silky lag
      for (let i = 1; i < POINTS; i++) {
        const ease = 0.32 - i * 0.012;
        pts[i].x += (pts[i - 1].x - pts[i].x) * Math.max(0.06, ease);
        pts[i].y += (pts[i - 1].y - pts[i].y) * Math.max(0.06, ease);
      }
      // Build a smooth spline path
      if (pathRef.current) {
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length - 1; i++) {
          const xc = (pts[i].x + pts[i + 1].x) / 2;
          const yc = (pts[i].y + pts[i + 1].y) / 2;
          d += ` Q ${pts[i].x} ${pts[i].y}, ${xc} ${yc}`;
        }
        pathRef.current.setAttribute("d", d);
      }
      if (headRef.current) {
        const size = target ? 14 : 8;
        headRef.current.style.width = `${size}px`;
        headRef.current.style.height = `${size}px`;
        headRef.current.style.transform = `translate3d(${pts[0].x - size / 2}px, ${pts[0].y - size / 2}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [target]);

  return (
    <>
      <svg className="pointer-events-none fixed inset-0 z-[9998] h-full w-full mix-blend-multiply" aria-hidden>
        <defs>
          <linearGradient id="silkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C8E6C" stopOpacity="0" />
            <stop offset="40%" stopColor="#9DAD8E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7C8E6C" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path ref={pathRef} stroke="url(#silkGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
      <div
        ref={headRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-sage-deep mix-blend-multiply transition-[width,height] duration-300 ease-smooth"
        style={{ willChange: "transform, width, height" }}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Variant 9: Stitch trail — dotted line behind cursor (tailor craft)
// ──────────────────────────────────────────────────────────────────────
function StitchCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const target = useHoverTarget();

  useEffect(() => {
    let lastDropX = 0;
    let lastDropY = 0;
    const onMove = (e: MouseEvent) => {
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }
      // Only drop a stitch every ~18px traveled
      const dx = e.clientX - lastDropX;
      const dy = e.clientY - lastDropY;
      if (Math.hypot(dx, dy) > 18) {
        lastDropX = e.clientX;
        lastDropY = e.clientY;
        spawnStitch(e.clientX, e.clientY);
      }
    };
    const spawnStitch = (x: number, y: number) => {
      const c = containerRef.current;
      if (!c) return;
      const dot = document.createElement("span");
      dot.className = "absolute h-1 w-2 rounded-full bg-sage-deep/80 mix-blend-multiply";
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.transform = "translate(-50%, -50%)";
      dot.style.transition = "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)";
      c.appendChild(dot);
      requestAnimationFrame(() => (dot.style.opacity = "0"));
      setTimeout(() => dot.remove(), 1000);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={containerRef} aria-hidden className="pointer-events-none fixed inset-0 z-[9998]" />
      <div
        ref={headRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-sage-deep mix-blend-multiply transition-[width,height] duration-300 ease-smooth ${
          target ? "h-3 w-3" : "h-2 w-2"
        }`}
        style={{ willChange: "transform" }}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Variant 10: Dreamz — soft Z letters drift up from cursor
// ──────────────────────────────────────────────────────────────────────
function DreamzCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const target = useHoverTarget();

  useEffect(() => {
    let last = 0;
    let lastEmit = 0;
    const onMove = (e: MouseEvent) => {
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }
      const now = performance.now();
      // emit when slowly moving / idle-ish
      if (now - lastEmit > 380) {
        lastEmit = now;
        emitZ(e.clientX, e.clientY);
      }
      last = now;
    };
    void last;
    const emitZ = (x: number, y: number) => {
      const c = containerRef.current;
      if (!c) return;
      const z = document.createElement("span");
      const size = 12 + Math.random() * 8;
      z.textContent = "z";
      z.className = "absolute font-serif italic text-sage-deep/70 mix-blend-multiply";
      z.style.left = `${x + 10}px`;
      z.style.top = `${y - 6}px`;
      z.style.fontSize = `${size}px`;
      z.style.lineHeight = "1";
      z.style.transform = "translate(0,0) rotate(-8deg)";
      z.style.transition = "transform 1600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1600ms ease-out";
      z.style.opacity = "0.9";
      c.appendChild(z);
      requestAnimationFrame(() => {
        z.style.transform = `translate(${10 + Math.random() * 14}px, -${40 + Math.random() * 30}px) rotate(${-20 + Math.random() * 14}deg)`;
        z.style.opacity = "0";
      });
      setTimeout(() => z.remove(), 1700);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={containerRef} aria-hidden className="pointer-events-none fixed inset-0 z-[9998]" />
      <div
        ref={headRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-sage-deep mix-blend-multiply transition-transform duration-300 ease-smooth ${
          target ? "scale-150" : ""
        }`}
        style={{ width: 8, height: 8, willChange: "transform" }}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Variant 11: Ripple — concentric sage rings emit from cursor
// ──────────────────────────────────────────────────────────────────────
function RippleCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastEmit = 0;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: MouseEvent) => {
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${e.clientX - 5}px, ${e.clientY - 5}px, 0)`;
      }
      const now = performance.now();
      const moved = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
      // Periodic emit when moving
      if (moved > 2 && now - lastEmit > 520) {
        lastEmit = now;
        spawnRing(e.clientX, e.clientY);
      }
    };
    const onClick = (e: MouseEvent) => spawnRing(e.clientX, e.clientY, true);

    const spawnRing = (x: number, y: number, strong = false) => {
      const c = containerRef.current;
      if (!c) return;
      const ring = document.createElement("span");
      ring.className = "absolute rounded-full border border-sage-deep mix-blend-multiply";
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      ring.style.width = "0";
      ring.style.height = "0";
      ring.style.transform = "translate(-50%, -50%) scale(1)";
      ring.style.opacity = strong ? "0.6" : "0.35";
      ring.style.transition = "transform 1400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1400ms ease-out, width 1400ms cubic-bezier(0.22, 1, 0.36, 1), height 1400ms cubic-bezier(0.22, 1, 0.36, 1)";
      c.appendChild(ring);
      requestAnimationFrame(() => {
        const final = strong ? 160 : 80;
        ring.style.width = `${final}px`;
        ring.style.height = `${final}px`;
        ring.style.opacity = "0";
      });
      setTimeout(() => ring.remove(), 1500);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} aria-hidden className="pointer-events-none fixed inset-0 z-[9998]" />
      <div
        ref={headRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 rounded-full bg-sage-deep mix-blend-multiply"
        style={{ willChange: "transform" }}
      />
    </>
  );
}

function CrosshairCursor() {
  const v = useRef<HTMLDivElement>(null);
  const h = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const target = useHoverTarget();

  useEffect(() => {
    if (target) dot.current?.classList.add("scale-150");
    else dot.current?.classList.remove("scale-150");
  }, [target]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (v.current) v.current.style.transform = `translate3d(${e.clientX - 0.5}px, 0, 0)`;
      if (h.current) h.current.style.transform = `translate3d(0, ${e.clientY - 0.5}px, 0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={v} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999] h-screen w-px bg-sage-deep/30 mix-blend-multiply" style={{ willChange: "transform" }} />
      <div ref={h} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999] h-px w-screen bg-sage-deep/30 mix-blend-multiply" style={{ willChange: "transform" }} />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-sage-deep transition-transform duration-300 ease-smooth" style={{ willChange: "transform" }} />
    </>
  );
}
