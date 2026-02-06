"use client";

import { useEffect, useRef, useState } from "react";

// 5x7 pixel font glyphs for uppercase, lowercase, and special characters
const PIXEL_FONT: Record<string, number[][]> = {
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  h: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
  ],
  a: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 1, 0],
    [0, 1, 1, 1, 0],
  ],
  t: [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  c: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  n: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  I: [
    [1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
  ],
  d: [
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
  ],
  o: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [0, 1, 1, 0, 0],
  ],
  f: [
    [0, 0, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  r: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0],
    [1, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  y: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  u: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [0, 1, 1, 1, 0],
  ],
  "?": [
    [0, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  " ": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  e: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  i: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  l: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
  ],
  s: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 0, 0],
  ],
  p: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  m: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  w: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
  ],
  b: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 0, 0],
  ],
  g: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  k: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
  ],
  x: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
  ],
};

interface PixelTextProps {
  text: string;
  pixelSize?: number;
  className?: string;
}

interface PixelState {
  x: number;
  y: number;
  currentOpacity: number;
  targetOpacity: number;
  delay: number;
  revealed: boolean;
}

export default function PixelText({
  text,
  pixelSize = 6,
  className = "",
}: PixelTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<PixelState[]>([]);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Build the pixel grid from text
    const gap = 1; // spacing between dots for dot-matrix look
    const charGap = 2; // spacing between characters
    const pixels: PixelState[] = [];

    let cursorX = 0;
    const totalPixelSize = pixelSize + gap;

    for (const char of text) {
      const glyph = PIXEL_FONT[char];
      if (!glyph) {
        cursorX += 3 * totalPixelSize + charGap * totalPixelSize;
        continue;
      }

      const glyphWidth = glyph[0].length;

      for (let row = 0; row < glyph.length; row++) {
        for (let col = 0; col < glyphWidth; col++) {
          if (glyph[row][col] === 1) {
            const x = cursorX + col * totalPixelSize;
            const y = row * totalPixelSize;
            pixels.push({
              x,
              y,
              currentOpacity: 0,
              targetOpacity: 1,
              delay: Math.random() * 1200 + (cursorX / totalPixelSize) * 20,
              revealed: false,
            });
          }
        }
      }

      cursorX += (glyphWidth + charGap) * totalPixelSize;
    }

    // Calculate dimensions
    let maxX = 0;
    let maxY = 0;
    for (const p of pixels) {
      if (p.x + pixelSize > maxX) maxX = p.x + pixelSize;
      if (p.y + pixelSize > maxY) maxY = p.y + pixelSize;
    }

    pixelsRef.current = pixels;
    setDimensions({ width: maxX, height: maxY });
    startRef.current = performance.now();

    const animate = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const elapsed = now - startRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allDone = true;

      for (const pixel of pixelsRef.current) {
        if (elapsed >= pixel.delay) {
          pixel.revealed = true;
          pixel.currentOpacity += (pixel.targetOpacity - pixel.currentOpacity) * 0.06;
        }

        if (pixel.currentOpacity < 0.99) {
          allDone = false;
        }

        if (pixel.currentOpacity > 0.01) {
          const radius = pixelSize / 2;
          ctx.beginPath();
          ctx.arc(pixel.x + radius, pixel.y + radius, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(26, 26, 26, ${pixel.currentOpacity})`;
          ctx.fill();
        }
      }

      if (!allDone) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        // Final clean render
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const radius = pixelSize / 2;
        for (const pixel of pixelsRef.current) {
          ctx.beginPath();
          ctx.arc(pixel.x + radius, pixel.y + radius, radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(26, 26, 26, 1)";
          ctx.fill();
        }
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [text, pixelSize]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
        aria-label={text}
        role="img"
      />
      <span className="sr-only">{text}</span>
    </div>
  );
}
