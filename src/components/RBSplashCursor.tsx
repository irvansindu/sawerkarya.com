"use client";
import { useEffect, useMemo, useRef } from "react";

// Lightweight Splash Cursor inspired by React Bits
// - Renders soft color blobs trailing the cursor
// - Sits behind content (zIndex: 0) and doesn't block clicks (pointerEvents: none)
// - Respects prefers-reduced-motion

type Blob = { x: number; y: number; r: number; color: string };

export default function RBSplashCursor() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hueRef = useRef<number>(0);

  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (prefersReduced) return;

    const root = containerRef.current;
    if (!root) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = root.getBoundingClientRect();
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.mixBlendMode = "screen";
    canvas.style.opacity = "0.65";

    root.appendChild(canvas);
    resize();

    const blobs: Blob[] = [];
    const MAX_BLOBS = 28;

    const nextHue = () => {
      hueRef.current = (hueRef.current + 3) % 360;
      return hueRef.current;
    };

    const makeColor = (alpha = 0.5) => `hsla(${nextHue()} 95% 60% / ${alpha})`;

    const addBlob = (x: number, y: number) => {
      const rect = root.getBoundingClientRect();
      const nx = (x - rect.left) * dpr;
      const ny = (y - rect.top) * dpr;
      const baseR = 52 * dpr + Math.random() * 24 * dpr;
      blobs.push({ x: nx, y: ny, r: baseR, color: makeColor(0.55) });
      while (blobs.length > MAX_BLOBS) blobs.shift();
    };

    const onMove = (e: MouseEvent) => {
      addBlob(e.clientX, e.clientY);
      // slight offsets for splashy look
      addBlob(e.clientX + 6, e.clientY + 3);
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        addBlob(t.clientX, t.clientY);
        addBlob(t.clientX + 6, t.clientY + 3);
      }
    };

    let raf: number | null = null;
    let last = performance.now();

    const draw = () => {
      // Fade previous frame without tinting content below
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.08)"; // alpha acts as fade strength
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grd.addColorStop(0, b.color);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        // decay radius and subtle color shift over time
        b.r *= 0.93;
      }
      // remove tiny blobs
      for (let i = blobs.length - 1; i >= 0; i--) if (blobs[i].r < 6 * dpr) blobs.splice(i, 1);

      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // slow auto-motion: add a faint blob at center periodically for richness
      if (dt > 0) {
        // no-op for now; all driven by input
      }

      raf = requestAnimationFrame(draw);
    };

    const onResize = () => resize();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("resize", onResize);

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch as unknown as EventListener);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      root.removeChild(canvas);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden
    />
  );
}
