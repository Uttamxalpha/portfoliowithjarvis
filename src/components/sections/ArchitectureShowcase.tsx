"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, FileCode, Cpu, Layers, MessageSquare, 
  ChevronRight, Sparkles, Database
} from "lucide-react";

interface NodeSpec {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  color: string;
}

export default function ArchitectureShowcase() {
  const [activeNode, setActiveNode] = useState<string>("query");
  const [pulseIndex, setPulseIndex] = useState(0);

  const nodes: NodeSpec[] = [
    {
      id: "query",
      title: "User Query",
      subtitle: "Semantic intent classifier",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Incoming queries are classified to determine if they are portfolio queries or out-of-scope prompts, preventing LLM hallucinations.",
      details: [
        "Groq-powered Llama 3 8B classification node",
        "Deterministic routing based on JSON output schemas",
        "Fallback response handlers for off-topic requests"
      ],
      color: "border-brand-indigo text-brand-indigo bg-brand-indigo/5"
    },
    {
      id: "embedding",
      title: "Embedding Model",
      subtitle: "Sentence Transformers",
      icon: <Layers className="w-5 h-5" />,
      description: "Converts queries and source resume documents into high-dimensional semantic vectors locally.",
      details: [
        "Local execution of all-MiniLM-L6-v2 embeddings model",
        "No API overhead or cost for vectorization",
        "High alignment with general technical resume terminologies"
      ],
      color: "border-brand-purple text-brand-purple bg-brand-purple/5"
    },
    {
      id: "vector",
      title: "Vector Database",
      subtitle: "ChromaDB Storage",
      icon: <Database className="w-5 h-5" />,
      description: "Stores and queries text chunk embeddings using fast similarity searches.",
      details: [
        "ChromaDB persistent local collection storage",
        "Fast cosine similarity vector lookups",
        "Metadata indexing for exact section mapping"
      ],
      color: "border-brand-cyan text-brand-cyan bg-brand-cyan/5"
    },
    {
      id: "retriever",
      title: "Retriever Node",
      subtitle: "LangChain Retriever",
      icon: <Search className="w-5 h-5" />,
      description: "Fetches top-5 highest-scoring semantic context chunks from the database corresponding to the query.",
      details: [
        "K-Nearest Neighbor similarity indexing",
        "Custom LangChain document fetch scripting",
        "Redundant chunk prevention filters"
      ],
      color: "border-brand-indigo text-brand-indigo bg-brand-indigo/5"
    },
    {
      id: "reranker",
      title: "Reranker Filter",
      subtitle: "Coherence Scoring",
      icon: <FileCode className="w-5 h-5" />,
      description: "Validates retrieved chunks, filtering out low-score matches to keep the LLM context clean and accurate.",
      details: [
        "Relevance filters based on semantic distance",
        "Prevents rate limits by purging unrelated data",
        "Ensures zero hallucinations during general chats"
      ],
      color: "border-brand-purple text-brand-purple bg-brand-purple/5"
    },
    {
      id: "llm",
      title: "LLM Orchestration",
      subtitle: "Groq Llama 3 70B",
      icon: <Cpu className="w-5 h-5" />,
      description: "Generates fully grounded responses using the fetched resume segments as system prompts.",
      details: [
        "Groq cloud inference running at ultra-low latency",
        "Llama 3 70B model with grounding strictness instructions",
        "Rate limit handlers returning graceful feedback"
      ],
      color: "border-brand-cyan text-brand-cyan bg-brand-cyan/5"
    },
    {
      id: "response",
      title: "Response Stream",
      subtitle: "FastAPI SSE Tokens",
      icon: <Sparkles className="w-5 h-5" />,
      description: "Streams tokens back to the Jarvis terminal client in real-time, accompanied by search source citations.",
      details: [
        "FastAPI Server-Sent Events (SSE) stream endpoints",
        "Smooth chunk decoder processing in the browser",
        "Direct rendering of citation keys and source cards"
      ],
      color: "border-brand-indigo text-brand-indigo bg-brand-indigo/5"
    }
  ];

  // Animate the signal pulse through the nodes periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % nodes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [nodes.length]);

  return (
    <section id="architecture" className="py-20 relative z-10 max-w-6xl mx-auto px-4 border-t border-white/5">
      
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-mono mb-4"
        >
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>SYSTEM FLOW COGNITION</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tight">
          How Uttam Builds <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-purple">AI Systems</span>
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mt-3 text-sm md:text-base">
          An interactive walkthrough of the actual RAG pipeline powering the Jarvis operating system running behind this portfolio.
        </p>
      </div>

      {/* Pipeline Diagram */}
      <div className="glass-panel-strong rounded-3xl p-6 md:p-8 border-white/5 mb-8 shadow-xl">
        
        {/* SVG Horizontal Flow (Desktop) */}
        <div className="hidden lg:flex items-center justify-between relative py-6">
          
          {/* Connecting SVG Path Line */}
          <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 w-full pointer-events-none select-none z-0">
            <line
              x1="0"
              y1="8"
              x2="100%"
              y2="8"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            {/* Pulsing signal indicator */}
            <motion.circle
              cx={`${(pulseIndex / (nodes.length - 1)) * 96 + 2}%`}
              cy="8"
              r="4"
              fill="#6366f1"
              className="glow-indigo"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          </svg>

          {nodes.map((node, i) => {
            const isActive = activeNode === node.id;
            const isPulsing = pulseIndex === i;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                className="flex flex-col items-center gap-3 relative z-10 cursor-pointer focus:outline-none group"
              >
                {/* Node bubble */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${
                    isActive 
                      ? "border-brand-indigo text-white bg-brand-indigo/15 shadow-[0_0_20px_rgba(99,102,241,0.25)]" 
                      : isPulsing
                      ? "border-brand-purple text-white bg-brand-purple/10"
                      : "border-white/10 text-text-secondary bg-background-deep group-hover:border-white/20"
                  }`}
                >
                  {node.icon}
                </motion.div>

                {/* Node Title */}
                <div className="flex flex-col items-center">
                  <span className={`text-xs font-mono font-bold tracking-tight ${
                    isActive ? "text-white" : "text-text-secondary group-hover:text-white"
                  }`}>
                    {node.title}
                  </span>
                  <span className="text-[9px] font-mono text-text-muted">
                    {node.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Vertical Flow (Mobile/Tablet) */}
        <div className="flex lg:hidden flex-col gap-6 relative pl-8 py-2">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 top-4 bottom-4 w-[2px] bg-white/10 border-dashed border-l border-white/5" />

          {nodes.map((node, i) => {
            const isActive = activeNode === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                className="flex items-center gap-4 text-left relative z-10 cursor-pointer focus:outline-none group"
              >
                {/* Mobile bubble */}
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive 
                    ? "border-brand-indigo text-white bg-brand-indigo/15 shadow-[0_0_15px_rgba(99,102,241,0.25)]" 
                    : "border-white/10 text-text-secondary bg-background-deep"
                }`}>
                  {React.cloneElement(node.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })}
                </div>

                <div className="flex flex-col">
                  <span className={`text-xs font-mono font-bold ${
                    isActive ? "text-white" : "text-text-secondary"
                  }`}>
                    {node.title}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    {node.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Node Description Details Board */}
      <AnimatePresence mode="wait">
        {activeNode && (
          <motion.div
            key={activeNode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 glass-panel rounded-3xl p-6 md:p-8 border-white/5 shadow-lg items-start text-left"
          >
            {/* Header info */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <span className="font-mono text-xs font-bold text-brand-indigo tracking-wider uppercase">
                Pipeline Stage Specs
              </span>
              <h3 className="text-2xl font-serif text-white font-medium">
                {nodes.find(n => n.id === activeNode)?.title}
              </h3>
              <span className="font-mono text-xs text-brand-purple">
                {nodes.find(n => n.id === activeNode)?.subtitle}
              </span>
              <p className="text-sm text-text-secondary leading-relaxed mt-2">
                {nodes.find(n => n.id === activeNode)?.description}
              </p>
            </div>

            {/* In-Depth Checklist */}
            <div className="md:col-span-7 flex flex-col gap-3.5 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
              <span className="font-mono text-[10px] font-bold text-text-muted tracking-widest uppercase">
                Technical Execution Parameters
              </span>
              <div className="flex flex-col gap-2.5">
                {nodes.find(n => n.id === activeNode)?.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <ChevronRight className="w-4 h-4 text-brand-indigo flex-shrink-0 mt-0.5" />
                    <span className="text-white/90 leading-relaxed font-sans">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
