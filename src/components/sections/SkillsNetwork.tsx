"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, Network, Server, Settings, Sparkles } from "lucide-react";

interface SubNode {
  name: string;
  angle: number; // in degrees
  distance: number; // in pixels
}

interface DomainSpec {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  glowClass: string;
  subNodes: SubNode[];
  summary: string;
}

export default function SkillsNetwork() {
  const [activeDomain, setActiveDomain] = useState<string | null>("genai");

  const domains: DomainSpec[] = [
    {
      id: "genai",
      name: "Generative AI",
      icon: <Sparkles className="w-5 h-5" />,
      color: "#5a5df5",
      glowClass: "shadow-[0_0_20px_rgba(90,93,245,0.25)]",
      summary: "Uttam builds agentic frameworks, multi-agent orchestrations, and context-grounded RAG systems using advanced reasoning chains.",
      subNodes: [
        { name: "LangChain", angle: -45, distance: 90 },
        { name: "LangGraph", angle: 0, distance: 100 },
        { name: "RAG Systems", angle: 45, distance: 90 },
        { name: "OpenAI APIs", angle: 90, distance: 90 },
        { name: "Prompt Eng.", angle: 135, distance: 95 },
        { name: "Vector DBs", angle: 180, distance: 90 }
      ]
    },
    {
      id: "backend",
      name: "Backend Eng.",
      icon: <Server className="w-5 h-5" />,
      color: "#00f5ff",
      glowClass: "shadow-[0_0_20px_rgba(0,245,255,0.25)]",
      summary: "Uttam builds clean, high-concurrency API servers and database models utilizing Python frameworks and relational architectures.",
      subNodes: [
        { name: "FastAPI", angle: -135, distance: 90 },
        { name: "REST APIs", angle: -90, distance: 90 },
        { name: "Python", angle: -45, distance: 95 },
        { name: "PostgreSQL", angle: 0, distance: 90 },
        { name: "Auth / Security", angle: 45, distance: 90 },
        { name: "Deployment", angle: 135, distance: 90 }
      ]
    },
    {
      id: "ml",
      name: "Machine Learning",
      icon: <Cpu className="w-5 h-5" />,
      color: "#9d4edd",
      glowClass: "shadow-[0_0_20px_rgba(157,78,221,0.25)]",
      summary: "Uttam parses documents, cleans complex data stores, trains statistical models, and deploys local transformer networks.",
      subNodes: [
        { name: "Transformers", angle: -90, distance: 90 },
        { name: "Deep Learning", angle: -45, distance: 95 },
        { name: "Scikit-Learn", angle: 45, distance: 90 },
        { name: "Model Eval", angle: 90, distance: 90 },
        { name: "Data Pipeline", angle: 135, distance: 90 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 relative z-10 max-w-6xl mx-auto px-4 border-t border-white/5">
      
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-4"
        >
          <Network className="w-3.5 h-3.5 animate-pulse" />
          <span>NEURAL KNOWLEDGE GRAPH</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tight">
          AI Capability <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-cyan font-semibold font-serif">Dashboard</span>
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mt-3 text-sm md:text-base">
          Hover over each core engineering domain to explore Uttam&apos;s technical proficiency nodes and sub-specialties.
        </p>
      </div>

      {/* Interactive Network Graph */}
      <div className="glass-panel-strong rounded-3xl p-8 border-white/5 shadow-xl flex flex-col md:grid md:grid-cols-12 gap-8 items-center min-h-[460px]">
        
        {/* Left Side: Dynamic Visual Graph */}
        <div className="md:col-span-8 flex justify-center items-center h-[340px] w-full relative">
          
          {/* Static SVG background lines connecting centers of main domains to core node */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            {/* Lines from center to domains */}
            {/* Center is at 50%, 50% */}
            {/* GenAI is at 20%, 30% */}
            {/* Backend is at 80%, 30% */}
            {/* ML is at 50%, 80% */}
            <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="rgba(6,182,212,0.2)" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="50%" y1="50%" x2="50%" y2="75%" stroke="rgba(139,92,246,0.2)" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Glowing lines for active domain */}
            {activeDomain === "genai" && (
              <motion.line
                x1="50%" y1="50%" x2="25%" y2="25%"
                stroke="#6366f1" strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
            {activeDomain === "backend" && (
              <motion.line
                x1="50%" y1="50%" x2="75%" y2="25%"
                stroke="#06b6d4" strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
            {activeDomain === "ml" && (
              <motion.line
                x1="50%" y1="50%" x2="50%" y2="75%"
                stroke="#8b5cf6" strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </svg>

          {/* Center core node: UTTAM TIWARI */}
          <div className="absolute z-20 flex items-center justify-center">
            <motion.div
              animate={{ scale: [0.97, 1.03, 0.97] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="px-5 py-3 rounded-full border border-white/20 bg-background-deep font-mono text-xs font-bold text-white shadow-xl flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-brand-indigo animate-pulse" />
              <span>UTTAM TIWARI</span>
            </motion.div>
          </div>

          {/* Core Domains */}
          {domains.map((dom) => {
            const isActive = activeDomain === dom.id;
            
            // Fixed positions on canvas
            let posClass = "";
            if (dom.id === "genai") posClass = "left-[10%] top-[10%]";
            if (dom.id === "backend") posClass = "right-[10%] top-[10%]";
            if (dom.id === "ml") posClass = "left-[50%] -translate-x-1/2 bottom-[10%]";

            return (
              <div key={dom.id} className={`absolute z-10 ${posClass}`}>
                
                {/* Connecting lines for subnodes */}
                <AnimatePresence>
                  {isActive && (
                    <svg className="absolute overflow-visible pointer-events-none select-none z-0 w-1 h-1 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      {dom.subNodes.map((sub, idx) => {
                        const rad = (sub.angle * Math.PI) / 180;
                        const x = Math.cos(rad) * sub.distance;
                        const y = Math.sin(rad) * sub.distance;
                        return (
                          <motion.line
                            key={idx}
                            x1="0"
                            y1="0"
                            x2={x}
                            y2={y}
                            stroke={dom.color}
                            strokeWidth="1"
                            strokeOpacity="0.4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            exit={{ pathLength: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.04 }}
                          />
                        );
                      })}
                    </svg>
                  )}
                </AnimatePresence>

                {/* Sub Nodes */}
                <AnimatePresence>
                  {isActive && dom.subNodes.map((sub, idx) => {
                    const rad = (sub.angle * Math.PI) / 180;
                    const x = Math.cos(rad) * sub.distance;
                    const y = Math.sin(rad) * sub.distance;
                    return (
                      <motion.div
                        key={sub.name}
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, scale: 1, x, y }}
                        exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 150, damping: 15, delay: idx * 0.03 }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                      >
                        <span className="px-2.5 py-1 rounded bg-black/80 border border-white/5 text-[10px] font-mono text-white/90 whitespace-nowrap shadow-md">
                          {sub.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Main Domain Bubble */}
                <motion.button
                  onHoverStart={() => setActiveDomain(dom.id)}
                  onClick={() => setActiveDomain(isActive ? null : dom.id)}
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center cursor-pointer transition-all ${
                    isActive 
                      ? `text-white ${dom.glowClass}` 
                      : "border-white/10 text-text-secondary bg-background-deep hover:border-white/20"
                  }`}
                  style={{
                    borderColor: isActive ? dom.color : undefined,
                    backgroundColor: isActive ? `${dom.color}20` : undefined,
                  }}
                >
                  {dom.icon}
                </motion.button>
                <div className="text-[10px] font-mono font-bold tracking-tight text-text-secondary mt-1.5 text-center whitespace-nowrap">
                  {dom.name}
                </div>

              </div>
            );
          })}

        </div>

        {/* Right Side: Technical Specs Board */}
        <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6 text-left flex flex-col justify-center h-full">
          <AnimatePresence mode="wait">
            {activeDomain ? (
              <motion.div
                key={activeDomain}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: domains.find(d => d.id === activeDomain)?.color }}
                  />
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    {domains.find(d => d.id === activeDomain)?.name} Spec
                  </h3>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {domains.find(d => d.id === activeDomain)?.summary}
                </p>

                <div className="flex flex-col gap-1.5 mt-2">
                  <span className="text-[9px] font-mono text-text-muted tracking-widest uppercase font-bold">
                    Primary Tech Nodes
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {domains.find(d => d.id === activeDomain)?.subNodes.map((sub) => (
                      <span
                        key={sub.name}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6 text-text-muted font-mono text-xs">
                Hover over domain bubble nodes to extract parameters.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </section>
  );
}
