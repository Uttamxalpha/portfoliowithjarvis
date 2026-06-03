"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Menu, X, Download } from "lucide-react";

interface NavItem {
  name: string;
  id: string;
}

const navItems: NavItem[] = [
  { name: "Home", id: "home" },
  { name: "Jarvis", id: "jarvis" },
  { name: "Projects", id: "projects" },
  { name: "Skills", id: "skills" },
  { name: "Experience", id: "experience" },
  { name: "Contact", id: "contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    // Setup IntersectionObserver for active section spy
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // triggers when section is in middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 transition-all duration-300">
      <motion.div
        animate={{
          y: 0,
          scale: scrolled ? 0.98 : 1,
          width: scrolled ? "auto" : "100%",
        }}
        initial={{ y: -100 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 max-w-5xl w-full ${
          scrolled
            ? "glass-pill shadow-[0_4px_30px_rgba(0,0,0,0.4)] shadow-indigo-950/20 backdrop-blur-md border border-white/10"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Brand/Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="flex items-center gap-2 text-white font-mono font-bold tracking-tight text-lg group"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full bg-brand-indigo/15 border border-brand-indigo/35 flex items-center justify-center text-brand-indigo"
          >
            <Cpu className="w-4 h-4" />
          </motion.div>
          <span>
            uttam<span className="text-brand-indigo">.</span>os
          </span>
        </a>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full select-none ${
                  isActive ? "text-white" : "text-text-secondary hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activePill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-white/5 rounded-full border border-white/10"
                  />
                )}
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://drive.google.com/file/d/1BgYIlSXvJ3HW9JNddz8d8Br5KOLA4bOd/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 text-xs font-mono font-semibold tracking-wider text-brand-cyan uppercase bg-brand-cyan/10 border border-brand-cyan/50 hover:bg-brand-cyan hover:text-background-deep transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Resume
          </a>
          <a
            href="#jarvis"
            onClick={(e) => handleNavClick(e, "jarvis")}
            className="px-5 py-2 text-xs font-mono font-semibold tracking-wider text-white uppercase bg-brand-indigo/10 border border-brand-indigo/50 hover:bg-brand-indigo hover:border-brand-indigo transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.35)] cursor-pointer"
          >
            Ask Jarvis
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden text-white hover:text-brand-indigo transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-20 left-4 right-4 glass-panel-strong rounded-3xl p-6 flex flex-col gap-4 border border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? "bg-brand-indigo/10 text-white border-l-2 border-brand-indigo"
                        : "text-text-secondary hover:text-white"
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>
            <a
              href="https://drive.google.com/file/d/1BgYIlSXvJ3HW9JNddz8d8Br5KOLA4bOd/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="w-full text-center py-3 text-sm font-mono font-semibold tracking-wider text-brand-cyan uppercase bg-brand-cyan/10 border border-brand-cyan/50 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
            <a
              href="#jarvis"
              onClick={(e) => handleNavClick(e, "jarvis")}
              className="w-full text-center py-3 text-sm font-mono font-semibold tracking-wider text-white uppercase bg-brand-indigo border border-brand-indigo rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.25)] cursor-pointer"
            >
              Ask Jarvis
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
