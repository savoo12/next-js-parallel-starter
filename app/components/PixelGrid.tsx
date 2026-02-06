"use client";

import { useEffect, useRef, useCallback } from "react";

interface Pixel {
  x: number;
  y: number;
  opacity: number;
  targetOpacity: number;
  speed: number;
  delay: number;
  size: number;
}

export default function PixelGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const initPixels = useCallback((width: number, height: number) => {
    const pixels: Pixel[] = [];
    const gridSize = 24;
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(height / gridSize);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (Math.random() > 0.12) continue;
        pixels.push({
          x: col * gridSize,
          y: row * gridSize,
          opacity: 0,
          targetOpacity: 0,
          speed: 0.003 + Math.random() * 0.008,
          delay: Math.random() * 600,
          size: gridSize - 2,
        });
      }
    }
    return pixels;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    timeRef.current += 1;
    const time = timeRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const pixel of pixelsRef.current) {
      // Slowly cycle target opacity with staggered timing
      const wave = Math.sin((time + pixel.delay) * pixel.speed);
      pixel.targetOpacity = Math.max(0, wave * 0.08 + 0.02);

      // Smooth interpolation
      pixel.opacity += (pixel.targetOpacity - pixel.opacity) * 0.02;

      if (pixel.opacity > 0.005) {
        ctx.fillStyle = `rgba(0, 0, 0, ${pixel.opacity})`;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      pixelsRef.current = initPixels(rect.width, rect.height);
    };

    resize();
    animationRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initPixels, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
