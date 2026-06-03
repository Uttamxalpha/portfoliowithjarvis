"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Cpu, Terminal, ArrowRight, Server } from "lucide-react";
import { useJarvisStore } from "@/store/useJarvisStore";

const BOOT_LINES = [
  "Initializing Jarvis Operating System v1.5...",
  "Importing neural weights & embeddings context... [OK]",
  "Querying chroma vector indexes... (54 documents active)",
  "Syncing FastAPI Agentic workflows...",
  "BACKEND_STATUS",
  "Jarvis Online. System initialized. Ready to process queries."
];

const resolveTerminalLineText = (line: string, health: string) => {
  if (line === "BACKEND_STATUS") {
    return `Backend API Status: ${health === "online" ? "CONNECTED" : health === "checking" ? "CHECKING..." : "OFFLINE (Verify localhost:8000)"}`;
  }
  return line;
};

export default function Hero() {
  const { backendHealth } = useJarvisStore();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Boot terminal animation
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_LINES.length) {
        setTerminalLines((prev) => [...prev, BOOT_LINES[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Track mouse coordinates for spotlight glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[110vh] flex flex-col justify-center items-center px-4 overflow-hidden pt-28"
      style={{
        background: `radial-gradient(circle 450px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 80%)`,
      }}
    >
      {/* Background spotlights & radial glow */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {/* Massive Purple blur blob left */}
        <div className="absolute top-[10%] left-[5%] w-[550px] h-[550px] bg-brand-purple/5 blur-[160px] rounded-full" />
        {/* Massive Cyan blur blob right */}
        <div className="absolute bottom-[10%] right-[5%] w-[550px] h-[550px] bg-brand-cyan/5 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Side: Content */}
        <div className="lg:col-span-7 text-left flex flex-col gap-10">
          
          {/* Status Badge Row */}
          <div className="flex items-center gap-3 self-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/35 flex items-center justify-center text-brand-purple shadow-[0_0_15px_rgba(157,78,221,0.15)] flex-shrink-0"
            >
              <Cpu className="w-5 h-5 animate-pulse" />
            </motion.div>
            
            <div className="flex flex-col gap-0.5 text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wide text-brand-purple uppercase"
              >
                <span>AI Engineer • Founder</span>
              </motion.div>
              
              <div className="text-[10px] font-mono text-text-muted flex items-center gap-1.5 pl-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                Indore, India • Available for Opportunities
              </div>
            </div>
          </div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-sans font-black tracking-[-0.05em] leading-[0.95] text-white"
          >
            Building Intelligent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-purple to-brand-cyan font-semibold">
              Systems That Think
            </span> <br />
            Beyond Code.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-secondary max-w-xl text-base sm:text-lg leading-relaxed font-sans"
          >
            AI Engineer specializing in LLM Applications, Agentic Workflows, Retrieval-Augmented Generation (RAG), Machine Learning, and Intelligent Automation.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <button
              onClick={() => handleScrollTo("jarvis")}
              className="px-6 py-3 rounded-full bg-white hover:bg-white/95 text-background-deep font-semibold text-sm tracking-wide flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:-translate-y-[2px] hover:shadow-[0_0_40px_rgba(157,78,221,0.3)] transition-all duration-300 cursor-pointer"
            >
              Talk To Jarvis
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handleScrollTo("projects")}
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 hover:border-white/20 hover:-translate-y-[2px] transition-all duration-300 cursor-pointer"
            >
              Explore Projects
            </button>
          </motion.div>

          {/* Jarvis Status Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 glass-panel rounded-2xl p-4 max-w-md border-brand-purple/20 flex items-start gap-3 shadow-[0_4px_30px_rgba(0,0,0,0.2)] bg-brand-purple/[0.01]"
          >
            <div className="relative flex-shrink-0 mt-1">
              <span className="flex h-3.5 w-3.5 rounded-full bg-brand-cyan" />
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75 left-0 top-0" />
            </div>
            <div className="flex flex-col text-left gap-0.5">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                ● Jarvis Status: ACTIVE
              </span>
              <p className="text-xs text-text-secondary leading-relaxed">
                Query me on Uttam&apos;s skills, credentials, experience, and system architecture. Ingestion database ready.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Right Side: Combined Luxury OS Terminal Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ 
            opacity: { duration: 0.7, delay: 0.2 },
            scale: { duration: 0.7, delay: 0.2 },
            y: { duration: 9, repeat: Infinity, ease: "easeInOut" }
          }}
          className="lg:col-span-5 w-full"
        >
          <div className="w-full glass-panel-strong rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.55)] relative flex flex-col">
            
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-error" />
                <span className="w-2 h-2 rounded-full bg-brand-warning" />
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                <span className="ml-2 font-mono text-[9px] text-text-secondary font-bold tracking-wider">JARVIS_AGENT_NODE_01</span>
              </div>
              <Terminal className="w-3.5 h-3.5 text-brand-purple" />
            </div>

            {/* Profile & Status Row */}
            <div className="p-5 flex items-center gap-4 border-b border-white/5 bg-black/20">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-brand-purple/40 shadow-[0_0_20px_rgba(157,78,221,0.2)] flex-shrink-0 bg-background-deep">
                <img
                  src="/uttam.jpg"
                  alt="Uttam Tiwari"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-xl font-sans font-extrabold text-white leading-tight">Uttam Tiwari</h3>
                <span className="text-[10px] font-mono text-brand-purple font-bold tracking-wider uppercase mt-0.5">AI Founder & Architect</span>
                <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-mono font-bold tracking-wider uppercase text-brand-cyan">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                  STATUS: ONLINE
                </div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-4 border-b border-white/5 bg-black/10 text-left font-mono text-[9px] select-none">
              <div className="p-2 border border-white/5 rounded-xl bg-white/[0.01]">
                <div className="text-text-muted font-bold uppercase">AI AGENTS RUNNING</div>
                <div className="text-brand-purple font-black mt-0.5 text-xs">3 ACTIVE WORKFLOWS</div>
              </div>
              <div className="p-2 border border-white/5 rounded-xl bg-white/[0.01]">
                <div className="text-text-muted font-bold uppercase">DOCS INDEXED</div>
                <div className="text-brand-cyan font-black mt-0.5 text-xs">1,000+ SYSTEM DOCS</div>
              </div>
              <div className="p-2 border border-white/5 rounded-xl bg-white/[0.01]">
                <div className="text-text-muted font-bold uppercase">MODEL ACCURACY</div>
                <div className="text-brand-cyan font-black mt-0.5 text-xs">98% RAG RECALL</div>
              </div>
              <div className="p-2 border border-white/5 rounded-xl bg-white/[0.01]">
                <div className="text-text-muted font-bold uppercase">AVG LATENCY</div>
                <div className="text-white font-black mt-0.5 text-xs">~2.5 SECONDS</div>
              </div>
            </div>

            {/* Terminal Body / Activity Feed */}
            <div className="p-4 bg-black/40 font-mono text-[9px] leading-relaxed text-left flex flex-col gap-1.5 overflow-y-auto h-[120px] scrollbar-none border-b border-white/5">
              {terminalLines.map((line, i) => {
                if (!line) return null;
                const displayText = resolveTerminalLineText(line, backendHealth);
                const isSuccess = displayText && typeof displayText === "string" && (
                  displayText.includes("[OK]") || 
                  displayText.includes("Online") || 
                  displayText.includes("CONNECTED") || 
                  displayText.includes("SUCCESS")
                );
                return (
                  <div
                    key={i}
                    className={isSuccess ? "text-brand-cyan font-bold" : "text-white/70"}
                  >
                    <span className="text-brand-purple mr-1.5">&gt;</span>
                    {displayText}
                  </div>
                );
              })}
              
              {terminalLines.length < BOOT_LINES.length ? (
                <div className="flex items-center gap-1">
                  <span className="text-brand-purple mr-1.5">&gt;</span>
                  <span className="w-1.5 h-2.5 bg-brand-cyan animate-pulse" />
                </div>
              ) : null}
            </div>

            {/* Integrated CTA Footer */}
            <div className="p-4 bg-black/25">
              <button
                onClick={() => handleScrollTo("jarvis")}
                className="w-full text-center py-2.5 text-xs font-mono font-bold tracking-wider text-white uppercase bg-brand-purple/10 border border-brand-purple/40 hover:bg-brand-purple hover:border-brand-purple hover:-translate-y-[1px] hover:shadow-[0_0_25px_rgba(157,78,221,0.25)] transition-all rounded-xl cursor-pointer"
              >
                Access Agent Console
              </button>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
