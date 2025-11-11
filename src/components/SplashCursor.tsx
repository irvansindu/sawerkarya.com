'use client';
import { useEffect, useRef } from 'react';

type RGB = { r: number; g: number; b: number };

type Props = {
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: RGB;
  TRANSPARENT?: boolean;
  SPLAT_RADIUS?: number; // 0..1
  SPLAT_FORCE?: number; // intensity
};

function randColor(): RGB {
  const h = Math.random();
  const s = 1;
  const v = 1;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

export default function SplashCursor({
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0, g: 0, b: 0 },
  TRANSPARENT = true,
  SPLAT_RADIUS = 0.15,
  SPLAT_FORCE = 0.9,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorRef = useRef<RGB>(randColor());
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, moved: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
    };
    resize();

    let last = performance.now();
    let colorTimer = 0;

    const clear = () => {
      if (TRANSPARENT) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = `rgb(${BACK_COLOR.r},${BACK_COLOR.g},${BACK_COLOR.b})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const drawSplat = (x: number, y: number) => {
      const radius = Math.max(canvas.width, canvas.height) * SPLAT_RADIUS * 0.25;
      const c = colorRef.current;
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${0.35 * SPLAT_FORCE})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      colorTimer += dt * COLOR_UPDATE_SPEED;
      if (colorTimer >= 1) {
        colorTimer = 0;
        colorRef.current = randColor();
      }

      // subtle fade to create trail persistence
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = TRANSPARENT ? 'rgba(0,0,0,0.06)' : `rgba(${BACK_COLOR.r},${BACK_COLOR.g},${BACK_COLOR.b},0.06)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mouseRef.current.moved) {
        mouseRef.current.moved = false;
        ctx.globalCompositeOperation = 'lighter';
        drawSplat(mouseRef.current.x * dpr, mouseRef.current.y * dpr);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.moved = true;
    };

    const onTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (!t) return;
      mouseRef.current.x = t.clientX - rect.left;
      mouseRef.current.y = t.clientY - rect.top;
      mouseRef.current.moved = true;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    clear();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch as unknown as EventListener);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [BACK_COLOR.b, BACK_COLOR.g, BACK_COLOR.r, COLOR_UPDATE_SPEED, SPLAT_FORCE, SPLAT_RADIUS, TRANSPARENT]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
