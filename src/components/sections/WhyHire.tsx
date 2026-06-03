"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, CheckCircle, Database, Layout, Award, HelpCircle, ArrowRight, UserCheck, Calendar } from "lucide-react";

interface ValueCard {
  title: string;
  icon: React.ReactNode;
  description: string;
  metric: string;
}

export default function WhyHire() {
  const valueCards: ValueCard[] = [
    {
      title: "Production RAG Systems",
      icon: <Database className="w-5 h-5 text-brand-indigo" />,
      description: "Builds layout-aware parsing algorithms, chroma vector storage databases, and dense semantic retrievals.",
      metric: "Sub-250ms search latency"
    },
    {
      title: "Agentic AI Development",
      icon: <Cpu className="w-5 h-5 text-brand-purple" />,
      description: "Designs stateful graph neural loops in LangGraph with verification filters and recovery handlers.",
      metric: "Zero loop edge crashes"
    },
    {
      title: "Generative AI Engineering",
      icon: <CheckCircle className="w-5 h-5 text-brand-cyan" />,
      description: "Integrates APIs, designs prompt validation logic, and configures LLM context parameters.",
      metric: "99% context recall match"
    },
    {
      title: "Machine Learning Expertise",
      icon: <Award className="w-5 h-5 text-brand-indigo" />,
      description: "Deploys sentence-transformer models, processes data arrays, and evaluates training alignments.",
      metric: "94% classifier precision"
    },
    {
      title: "Backend Engineering",
      icon: <Layout className="w-5 h-5 text-brand-purple" />,
      description: "Writes asynchronous, production-grade FastAPI servers with CORS, security checks, and rate-limiters.",
      metric: "Clean monolithic builds"
    },
    {
      title: "Technical Problem Solving",
      icon: <HelpCircle className="w-5 h-5 text-brand-cyan" />,
      description: "Solves extraction bottlenecks, reduces context token consumption, and builds caching proxies.",
      metric: "Optimized context windowing"
    }
  ];

  const availability = [
    { role: "Full-Time AI Engineering Roles", available: true },
    { role: "Generative AI / LLM Engineer Roles", available: true },
    { role: "Machine Learning Internships", available: true },
    { role: "Freelance Projects / Consulting", available: true },
    { role: "Technical AI Strategy Advising", available: true }
  ];

  const handleRecruiterAction = () => {
    const element = document.getElementById("jarvis");
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
      // Pre-fill prompt in store or prompt text
      // We can also trigger sonner
    }
  };

  return (
    <section id="why-hire" className="py-20 relative z-10 max-w-6xl mx-auto px-4 border-t border-white/5 text-left">
      
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/30 text-brand-indigo text-xs font-mono mb-4"
        >
          <UserCheck className="w-3.5 h-3.5 animate-pulse" />
          <span>RECRUITER ACQUISITION MATRIX</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tight">
          Why Hire <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-cyan font-semibold font-serif">Uttam Tiwari</span>
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mt-3 text-sm md:text-base text-center">
          Uttam brings deep engineering expertise in stateful LLM operations, indexing vectors, and clean FastAPI architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Value Cards grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {valueCards.map((card, i) => (
            <div
              key={i}
              className="cyber-card p-5 text-left flex flex-col justify-between gap-4 group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-indigo/30 transition-colors">
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed pl-1.5 mt-1">
                  {card.description}
                </p>
              </div>
              <div className="border-t border-white/5 pt-2 flex items-center gap-1.5 pl-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-success" />
                <span className="text-[10px] font-mono text-text-muted uppercase">
                  ROI METRIC: <span className="text-white font-bold">{card.metric}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Availability Board & CTA */}
        <div className="lg:col-span-4 flex flex-col justify-between glass-panel-strong rounded-2xl p-6 border-white/10 relative overflow-hidden shadow-xl">
          {/* Spotlight overlay */}
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-brand-cyan/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="flex flex-col gap-6 relative z-10">
            {/* Header indicator */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-mono text-xs font-bold text-white tracking-widest flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-cyan animate-pulse" />
                AVAILABILITY MATRIX
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-success/15 border border-brand-success/30 text-[9px] font-mono font-bold text-brand-success uppercase">
                Active Match
              </span>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
              {availability.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-brand-success/10 border border-brand-success/40 flex items-center justify-center text-[9px] text-brand-success font-bold flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-xs text-white/90 font-medium font-sans">
                    {item.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="mt-8 border-t border-white/5 pt-6 relative z-10">
            <h4 className="text-sm font-sans font-bold text-white mb-2">
              Ready to schedule a screen?
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed mb-4">
              Trigger Jarvis directly or copy contact coordinates to invite Uttam for an alignment interview.
            </p>
            <button
              onClick={handleRecruiterAction}
              className="w-full text-center py-3 text-xs font-mono font-bold tracking-wider text-background-deep uppercase bg-brand-cyan hover:bg-brand-cyan/90 transition-all rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center justify-center gap-2 cursor-pointer"
            >
              Inquire Jarvis OS
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}
