"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, FileText, ArrowUpRight, Copy, Check, Sparkles } from "lucide-react";

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const emailStr = "uttamt2006@gmail.com";

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(emailStr);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="py-24 relative z-10 max-w-6xl mx-auto px-4 border-t border-white/5 overflow-hidden">
      
      {/* Cinematic glows */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50vw] h-[25vh] bg-gradient-to-t from-brand-indigo/10 via-brand-cyan/5 to-transparent blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-4"
        >
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>CONTACT INTERACTION TERMINAL</span>
        </motion.div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tight max-w-2xl leading-tight">
          Let&apos;s Build Something <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-cyan font-semibold font-serif">
            Intelligent Together.
          </span>
        </h2>
        <p className="text-text-secondary max-w-lg mx-auto mt-4 text-sm md:text-base mb-12">
          Connect to explore full-time roles, GenAI agent pipeline developments, internships, or technical collaborations.
        </p>

        {/* Contact Grid Card Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full text-left">
          
          {/* Card: Email */}
          <div className="glass-panel p-6 rounded-3xl border-white/5 relative group hover:border-brand-indigo/40 transition-all flex flex-col justify-between h-[160px] shadow-lg">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 border border-brand-indigo/30 flex items-center justify-center text-brand-indigo">
                <Mail className="w-5 h-5" />
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg border border-white/5 hover:border-white/20 text-text-secondary hover:text-white transition-colors cursor-pointer"
                title="Copy Email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-brand-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold text-text-muted uppercase">
                Direct Communication
              </span>
              <span className="text-sm font-semibold text-white truncate">
                {emailStr}
              </span>
            </div>
          </div>

          {/* Card: LinkedIn */}
          <a
            href="https://www.linkedin.com/in/uttamtiwa/"
            target="_blank"
            rel="noreferrer"
            className="glass-panel p-6 rounded-3xl border-white/5 relative group hover:border-brand-purple/40 transition-all flex flex-col justify-between h-[160px] shadow-lg cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="p-1.5 rounded-lg border border-white/5 text-text-secondary group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold text-text-muted uppercase">
                Professional Network
              </span>
              <span className="text-sm font-semibold text-white">
                linkedin.com/in/uttamtiwa/
              </span>
            </div>
          </a>

          {/* Card: GitHub */}
          <a
            href="https://github.com/Uttamxalpha"
            target="_blank"
            rel="noreferrer"
            className="glass-panel p-6 rounded-3xl border-white/5 relative group hover:border-brand-cyan/40 transition-all flex flex-col justify-between h-[160px] shadow-lg cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <Github className="w-5 h-5" />
              </div>
              <div className="p-1.5 rounded-lg border border-white/5 text-text-secondary group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold text-text-muted uppercase">
                Source Repository
              </span>
              <span className="text-sm font-semibold text-white">
                github.com/Uttamxalpha
              </span>
            </div>
          </a>

        </div>

        {/* Footer legalities */}
        <div className="mt-20 text-[10px] font-mono text-text-muted flex flex-col md:flex-row items-center gap-4 border-t border-white/5 pt-8 w-full max-w-4xl justify-between">
          <span>© {new Date().getFullYear()} UTTAM TIWARI OS. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <a href="#home" className="hover:text-white transition-colors">HOME</a>
            <span>•</span>
            <a href="#jarvis" className="hover:text-white transition-colors">JARVIS CLIENT</a>
            <span>•</span>
            <a href="#projects" className="hover:text-white transition-colors">SPEC LAUNCH</a>
          </div>
        </div>

      </div>

    </section>
  );
}
