"use client";
import { useEffect, useRef, useState } from "react";
import "./TrueFocus.css";

type Props = {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number; // seconds
  pauseBetweenAnimations?: number; // seconds
  framePadding?: number; // pixels
};

export default function TrueFocus({
  sentence = "True Focus",
  manualMode = false,
  blurAmount = 5,
  borderColor = "#22d3ee",
  glowColor = "rgba(34, 211, 238, 0.45)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  framePadding = 6,
}: Props) {
  const words = sentence.split(" ");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0, show: false });

  useEffect(() => {
    if (manualMode) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);
    return () => clearInterval(id);
  }, [manualMode, words.length, animationDuration, pauseBetweenAnimations]);

  useEffect(() => {
    const parent = containerRef.current;
    const el = wordRefs.current[currentIndex];
    if (!parent || !el) return;
    const p = parent.getBoundingClientRect();
    const a = el.getBoundingClientRect();
    setRect({ x: a.left - p.left, y: a.top - p.top, width: a.width, height: a.height, show: true });
  }, [currentIndex, words.length]);

  const onEnter = (i: number) => {
    if (!manualMode) return;
    setLastActiveIndex(i);
    setCurrentIndex(i);
  };
  const onLeave = () => {
    if (!manualMode) return;
    if (lastActiveIndex != null) setCurrentIndex(lastActiveIndex);
  };

  return (
    <div className="focus-container" ref={containerRef}>
      {words.map((w, i) => {
        const active = i === currentIndex;
        return (
          <span
            key={i}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className={`focus-word ${manualMode ? "manual" : ""} ${active && !manualMode ? "active" : ""}`}
            style={{ filter: active ? "blur(0px)" : `blur(${blurAmount}px)`, transition: `filter ${animationDuration}s ease` }}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={onLeave}
          >
            {w}
          </span>
        );
      })}
      {(() => {
        const frameStyle: React.CSSProperties & { ['--border-color']?: string; ['--glow-color']?: string } = {
          left: rect.x - framePadding,
          top: rect.y - framePadding,
          width: rect.width + framePadding * 2,
          height: rect.height + framePadding * 2,
          opacity: rect.show ? 1 : 0,
          transition: `left ${animationDuration}s ease, top ${animationDuration}s ease, width ${animationDuration}s ease, height ${animationDuration}s ease, opacity .3s ease`,
          ['--border-color']: borderColor,
          ['--glow-color']: glowColor,
        };
        return (
          <div className="focus-frame" style={frameStyle}>
            <span className="corner top-left" />
            <span className="corner top-right" />
            <span className="corner bottom-left" />
            <span className="corner bottom-right" />
          </div>
        );
      })()}
    </div>
  );
}
