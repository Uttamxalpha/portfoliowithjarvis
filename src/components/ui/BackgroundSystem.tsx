"use client";

import React, { useEffect, useRef } from "react";

export default function BackgroundSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const mouse = { x: 0, y: 0, radius: 150, active: false };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 0.5;
        this.color = `rgba(${99 + Math.floor(Math.random() * 40)}, ${102 + Math.floor(Math.random() * 50)}, ${241}, ${Math.random() * 0.3 + 0.1})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            // Attract/Repel
            this.x += (dx / distance) * force * 1.2;
            this.y += (dy / distance) * force * 1.2;
          }
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 120) {
            const alpha = (120 - dist) / 120 * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background-deep select-none">
        {/* Interactive Network Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 block" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-grid-pattern bg-repeat opacity-[0.02] animate-grid-move" />

        {/* Floating Aurora Glows */}
        <div className="absolute -top-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-brand-indigo/5 blur-[150px] animate-aurora" />
        <div className="absolute top-[40%] -right-[5%] w-[40vw] h-[40vw] rounded-full bg-brand-purple/5 blur-[150px] animate-aurora [animation-delay:4s]" />
        <div className="absolute -bottom-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-brand-cyan/5 blur-[150px] animate-aurora [animation-delay:8s]" />

        {/* Scanline CRT overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/[0.005] to-transparent bg-[length:100%_4px] pointer-events-none mix-blend-overlay" />
      </div>

      {/* Global Noise Overlay */}
      <div className="fixed inset-0 z-50 bg-noise opacity-[0.015] mix-blend-overlay pointer-events-none select-none" />
    </>
  );
}
