"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function FloatingJarvisButton() {
  const handleClick = () => {
    const element = document.getElementById("jarvis");
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
      // Focus the input box in the prompt console
      setTimeout(() => {
        const textarea = document.getElementById("jarvis-input") as HTMLTextAreaElement | null;
        if (textarea) {
          textarea.focus();
        }
      }, 800);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full flex items-center gap-2.5 cursor-pointer shadow-[0_0_25px_rgba(99,102,241,0.45)] border border-brand-indigo/40 bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-cyan text-white group select-none font-mono text-xs font-bold uppercase tracking-wider"
      title="Talk to Uttam's Agent"
      aria-label="Talk to Uttam's Agent"
    >
      {/* Pulsing external glow ring */}
      <span className="absolute -inset-0.5 rounded-full bg-brand-cyan/20 animate-ping opacity-60 pointer-events-none" />
      
      <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
      <span>Talk to Uttam&apos;s Agent</span>
    </motion.button>
  );
}
