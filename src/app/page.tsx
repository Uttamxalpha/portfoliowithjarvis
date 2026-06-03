import React from "react";
import Hero from "@/components/sections/Hero";
import JarvisCommandCenter from "@/components/sections/JarvisCommandCenter";
import ArchitectureShowcase from "@/components/sections/ArchitectureShowcase";
import Projects from "@/components/sections/Projects";
import SkillsNetwork from "@/components/sections/SkillsNetwork";
import Experience from "@/components/sections/Experience";
import WhyHire from "@/components/sections/WhyHire";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="relative z-10 w-full flex flex-col overflow-hidden">
      
      {/* 1. Hero Landing Section */}
      <Hero />

      {/* 2. Jarvis Command Center Chat System (Central OS Hub) */}
      <JarvisCommandCenter />

      {/* 3. System Architecture Workflow */}
      <ArchitectureShowcase />

      {/* 4. Mini Launch Project Case Studies */}
      <Projects />

      {/* 5. Skills Capability Dashboard (Knowledge Network) */}
      <SkillsNetwork />

      {/* 6. Professional Milestones Timeline */}
      <Experience />

      {/* 7. Recruiter ROI Matrix (Why Hire Uttam) */}
      <WhyHire />

      {/* 8. Contact Terminal & Footer */}
      <Contact />

    </div>
  );
}
