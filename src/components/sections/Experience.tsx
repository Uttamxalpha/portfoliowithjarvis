"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Briefcase, Milestone, ChevronDown, ChevronUp, Calendar, MapPin } from "lucide-react";

interface MilestoneSpec {
  id: string;
  category: "education" | "experience" | "certification" | "achievement";
  title: string;
  subtitle: string;
  date: string;
  location?: string;
  icon: React.ReactNode;
  summary: string;
  details: string[];
}

export default function Experience() {
  const [expandedCard, setExpandedCard] = useState<string | null>("experience-1");

  const milestones: MilestoneSpec[] = [
    {
      id: "experience-1",
      category: "experience",
      title: "Machine Learning Intern",
      subtitle: "Robotronix Tech Pvt. Ltd.",
      date: "Jun 2025 – Sep 2025",
      location: "Indore, India",
      icon: <Briefcase className="w-4 h-4" />,
      summary: "Designed advanced feature engineering pipelines, performed hyperparameter optimization, and implemented scalable Scikit-learn workflows for fraud detection and classification.",
      details: [
        "Improved fraud detection model accuracy from 78% to 87% by designing advanced feature engineering pipelines, performing hyperparameter optimization, and implementing scalable Scikit-learn workflows.",
        "Developed and evaluated multiple Machine Learning and Deep Learning models for real-world classification problems, optimizing model performance, generalization, and inference reliability.",
        "Conducted comprehensive model validation using Precision-Recall Analysis, Confusion Matrices, F1-Score, and ROC-AUC metrics, ensuring production-ready performance and robust decision-making.",
        "Automated data preprocessing, feature selection, and model training workflows, reducing experimentation time and improving reproducibility across projects.",
        "Collaborated with mentors and engineering teams to present technical findings, strengthening technical communication and translating complex ML concepts into actionable business insights.",
        "Gained hands-on experience across the complete ML lifecycle, including data preprocessing, feature engineering, model development, evaluation, optimization, and deployment considerations."
      ]
    },
    {
      id: "education-1",
      category: "education",
      title: "B.Tech in Computer Science & AI",
      subtitle: "Medi-Caps University",
      date: "2023 – 2027",
      location: "Indore, India",
      icon: <BookOpen className="w-4 h-4" />,
      summary: "Pursuing specialized undergraduate studies in Artificial Intelligence, focusing on Machine Learning systems, Neural Networks, and Advanced Data Structures.",
      details: [
        "Specializing in artificial intelligence, neural networks architectures, and data engineering pipelines.",
        "Practical projects covering pattern recognition, text embeddings, and intelligent data systems.",
        "Core coursework in Data Structures, Algorithms, Python systems, and Machine Learning algorithms."
      ]
    }
  ];

  const handleCardToggle = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };



  return (
    <section id="experience" className="py-20 relative z-10 max-w-6xl mx-auto px-4 border-t border-white/5 text-left">
      
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-mono mb-4"
        >
          <Milestone className="w-3.5 h-3.5 animate-pulse" />
          <span>COGNITIVE TIMELINE</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tight">
          Experience & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-cyan font-semibold font-serif">Credentials</span>
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mt-3 text-sm md:text-base text-center">
          Explore the education, internship milestones, achievements, and credentials validating Uttam&apos;s capabilities.
        </p>
      </div>

      {/* Vertical Timeline container */}
      <div className="relative max-w-3xl mx-auto pl-6 md:pl-10">
        
        {/* Vertical Line */}
        <div className="absolute left-[13px] md:left-[21px] top-4 bottom-4 w-[2px] bg-white/10" />

        {/* Milestone Cards */}
        <div className="flex flex-col gap-8">
          {milestones.map((item, idx) => {
            const isExpanded = expandedCard === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline node icon */}
                <div className={`absolute -left-[27px] md:-left-[39px] top-1.5 w-6 h-6 md:w-8 md:h-8 rounded-full border flex items-center justify-center bg-background-deep z-10 ${
                  isExpanded ? "border-brand-indigo text-white" : "border-white/10 text-text-secondary"
                }`}>
                  {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-3 h-3 md:w-4 md:h-4" })}
                </div>

                {/* Glass card panel */}
                <div className={`glass-panel rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isExpanded ? "border-brand-indigo bg-brand-indigo/[0.02]" : "border-white/5 hover:border-white/15"
                }`}>
                  <button
                    onClick={() => handleCardToggle(item.id)}
                    className="w-full p-5 flex items-start justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex flex-col gap-1 pr-4">
                      {/* Meta dates */}
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-indigo" />
                          {item.date}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-purple" />
                            {item.location}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-sans font-bold text-white mt-1">
                        {item.title}
                      </h3>

                      {/* Subtitle */}
                      <span className="text-xs font-mono text-brand-purple font-semibold">
                        {item.subtitle}
                      </span>

                      {/* Summary */}
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-2.5">
                        {item.summary}
                      </p>
                    </div>

                    <div className="text-text-secondary mt-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expandable details list */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-white/5 bg-black/10"
                      >
                        <div className="p-5 flex flex-col gap-3">
                          <span className="font-mono text-[9px] font-bold text-text-muted tracking-widest uppercase">
                            Core Responsibilities & Milestones
                          </span>
                          <div className="flex flex-col gap-2.5">
                            {item.details.map((detail, dIdx) => (
                              <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo mt-2 flex-shrink-0" />
                                <span className="text-white/80 leading-relaxed font-sans">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
