"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal as TermIcon, Cpu, Github, ExternalLink, Sparkles, 
  ChevronRight, Award, AlertTriangle, Scale, Database, Zap
} from "lucide-react";

interface ProjectSpec {
  id: string;
  title: string;
  badge: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  challenge: string;
  tradeoff: string;
  result: string;
  githubUrl: string;
  demoUrl: string;
  visualPanel: React.ReactNode;
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState<string>("misinfo");

  const projects: ProjectSpec[] = [
    {
      id: "misinfo",
      title: "Misinfo Buster – AI-Powered WhatsApp Misinformation Detection System",
      badge: "LangGraph • RAG • LLMs • Streamlit",
      problem: "Forwarded WhatsApp misinformation spreads rapidly in unstructured chat formats, bypassing standard media checks and missing critical contextual validation.",
      solution: "Architected a production-grade multi-agent fact-checking system using LangGraph and hybrid retrieval dense-sparse RAG pipelines to verify claims autonomously.",
      features: [
        "Architected a production-grade multi-agent fact-checking system using LangGraph, enabling autonomous verification of forwarded WhatsApp messages through coordinated reasoning and retrieval workflows.",
        "Designed and implemented a Hybrid Retrieval (Dense + Semantic Search) RAG pipeline, improving evidence discovery accuracy and grounding LLM responses on relevant external information sources.",
        "Built a modular 3-stage agent architecture consisting of Claim Extraction, Evidence Retrieval, and Verdict Generation agents, orchestrated through LangGraph stateful workflows.",
        "Developed a 3-way classification framework (True / False / Uncertain) using structured prompt engineering and chain-of-thought reasoning to generate interpretable, evidence-backed decisions.",
        "Integrated multiple LLM-powered reasoning modules for claim decomposition, contextual retrieval, fact validation, and response synthesis, improving robustness against ambiguous or misleading inputs.",
        "Optimized retrieval and orchestration pipelines to achieve ~2–3 second end-to-end inference latency, enabling near real-time fact-checking for user queries.",
        "Improved response quality and factual consistency through iterative prompt tuning, retrieval evaluation, and extensive testing across diverse misinformation scenarios.",
        "Deployed the complete system on Streamlit Cloud, providing an interactive interface for real-time misinformation detection and explainable AI-driven verdict generation."
      ],
      techStack: ["LangGraph", "RAG", "LLMs", "Streamlit", "Python"],
      challenge: "Vague, multi-sentence inputs and ambiguous forwards created massive noise, throwing off vector DB index similarity matches.",
      tradeoff: "Implemented claim decomposition modules to split queries. Achieved k=3 parallel evidence lookups, optimizing latency to ~2-3 seconds while maintaining accuracy.",
      result: "~2–3 second latency",
      githubUrl: "https://github.com/Uttamxalpha/whatsapp-agent",
      demoUrl: "https://github.com/Uttamxalpha/whatsapp-agent",
      visualPanel: (
        <div className="w-full h-full bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[11px] leading-relaxed text-left flex flex-col justify-between select-none">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-text-muted">
            <span className="flex items-center gap-1.5"><TermIcon className="w-3.5 h-3.5" /> whatsapp_graph_state.py</span>
            <span className="w-2 h-2 rounded-full bg-brand-indigo animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col gap-3 justify-center items-center py-2">
            <div className="flex items-center gap-1.5">
              <div className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] text-white">WhatsApp Inbound</div>
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
              <div className="px-2 py-0.5 rounded border border-brand-indigo/35 bg-brand-indigo/10 text-[9px] text-brand-indigo font-semibold">Claim Extractor</div>
            </div>
            <div className="w-[1px] h-3 border-l border-dashed border-white/20" />
            <div className="flex items-center gap-1.5">
              <div className="px-2 py-0.5 rounded border border-brand-purple/35 bg-brand-purple/10 text-[9px] text-brand-purple font-semibold">Hybrid Search (Dense + Semantic)</div>
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
              <div className="px-2 py-0.5 rounded border border-brand-cyan/35 bg-brand-cyan/10 text-[9px] text-brand-cyan font-semibold">Evidence Validator</div>
            </div>
            <div className="w-[1px] h-3 border-l border-dashed border-white/20" />
            <div className="flex items-center gap-1.5">
              <div className="px-2.5 py-0.5 rounded border border-brand-success/35 bg-brand-success/5 text-[9px] text-brand-success font-bold">Verdict: TRUE / FALSE / UNCERTAIN</div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-text-muted flex justify-between">
            <span>INFERENCE: ~2.5 SECONDS</span>
            <span>VERDICT NODE: STABLE</span>
          </div>
        </div>
      )
    },
    {
      id: "plant",
      title: "Plant Disease Detection System",
      badge: "CNN • MobileNetV3 • Deep Learning • Computer Vision",
      problem: "Crop leaf diseases go undetected in traditional farming, leading to poor yields and time-consuming manual vet inspections.",
      solution: "Developed and optimized Deep Learning models for plant disease classification using a dataset of 56K+ leaf images, achieving 93% prediction accuracy across categories.",
      features: [
        "Developed and optimized Deep Learning models for plant disease classification using a dataset of 56K+ leaf images, achieving 93% prediction accuracy across multiple disease categories.",
        "Fine-tuned MobileNetV3 using transfer learning techniques to improve feature extraction, model generalization, and classification performance.",
        "Applied data augmentation and preprocessing pipelines to reduce overfitting and enhance robustness on unseen image samples.",
        "Evaluated model performance using confusion matrix analysis, precision, recall, and F1-score metrics to identify improvement opportunities and ensure reliable predictions.",
        "Collaborated within a team to integrate trained models into a real-time web-based disease detection platform for automated crop health assessment."
      ],
      techStack: ["CNN", "MobileNetV3", "Deep Learning", "Computer Vision", "Python"],
      challenge: "Overfitting on specific high-resolution greenhouse samples caused high classification error rates on low-quality outdoor mobile camera images.",
      tradeoff: "Adopted heavy dataset data augmentations (color jitters, random croppings) and fine-tuned MobileNetV3. Lowered initial training speeds by 15% but boosted test accuracy from 81% to 93%.",
      result: "93% accuracy on 56K+ images",
      githubUrl: "https://github.com/Uttamxalpha/plant-health-app",
      demoUrl: "https://plant-health-app-yivo.onrender.com",
      visualPanel: (
        <div className="w-full h-full bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[11px] leading-relaxed text-left flex flex-col justify-between select-none">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-text-muted">
            <span className="flex items-center gap-1.5"><TermIcon className="w-3.5 h-3.5" /> crop_health_classifier.py</span>
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5 text-white/90 justify-center">
            <div className="flex items-center justify-between text-[10px] text-text-secondary">
              <span>Leaf Corpus:</span>
              <span className="text-white">56,000+ Image Samples</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-text-secondary">
              <span>Classifier Model:</span>
              <span className="text-brand-purple">MobileNetV3 (Fine-Tuned)</span>
            </div>
            <div className="h-[2px] w-full bg-white/5 my-1" />
            <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded p-2 text-center">
              <div className="text-[10px] text-text-muted">CLASSIFICATION TARGET</div>
              <div className="text-sm font-bold text-brand-cyan mt-0.5">93% Accuracy: Tomato Early Blight</div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-text-muted flex justify-between">
            <span>LIVE ENVIRONMENT: RENDER</span>
            <span>PREDICTION: RESOLVED</span>
          </div>
        </div>
      )
    },
    {
      id: "medical",
      title: "Medical AI Chatbot (RAG-Based Question Answering System)",
      badge: "LangChain • Vector Search • LLMs",
      problem: "Generic large language models hallucinate clinical data and lack medical grounding, generating unsafe health responses.",
      solution: "Developed core components of a Retrieval-Augmented Generation (RAG) pipeline using LangChain to enable evidence-grounded medical question answering.",
      features: [
        "Developed core components of a Retrieval-Augmented Generation (RAG) pipeline using LangChain to enable evidence-grounded medical question answering.",
        "Processed, cleaned, and indexed 1,000+ medical documents, creating a semantic retrieval system capable of delivering contextually relevant information.",
        "Implemented document chunking, embedding generation, and vector similarity search workflows to improve retrieval precision and response quality.",
        "Performed retrieval evaluation and query testing to optimize context selection and reduce irrelevant responses.",
        "Collaborated in building an AI-powered medical assistant that combined semantic search with LLM reasoning for accurate and explainable healthcare-related responses."
      ],
      techStack: ["LangChain", "Vector Search", "LLMs", "Python", "ChromaDB"],
      challenge: "Medical journals contain dense, overlapping vocabularies that led standard vector search algorithms to retrieve irrelevant sections.",
      tradeoff: "Utilized customized chunking with semantic heading tracking and strict score thresholds. This filtered out irrelevant context and cut hallucinations by 75%.",
      result: "Zero-hallucination medical context indexes",
      githubUrl: "https://github.com/Uttamxalpha/voice_medi_chat",
      demoUrl: "https://github.com/Uttamxalpha/voice_medi_chat",
      visualPanel: (
        <div className="w-full h-full bg-black/60 rounded-2xl p-4 border border-white/5 font-mono text-[11px] leading-relaxed text-left flex flex-col justify-between select-none">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-text-muted">
            <span className="flex items-center gap-1.5"><TermIcon className="w-3.5 h-3.5" /> medical_vector_db.py</span>
            <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5 text-white/90">
            <div><span className="text-brand-purple">from</span> langchain_community.vectorstores <span className="text-brand-purple">import</span> Chroma</div>
            <div className="text-text-muted"># Semantic index retrieval query</div>
            <div>db = Chroma(persist_directory=&quot;./medical_db&quot;)</div>
            <div>query = &quot;clinical symptoms categorization&quot;</div>
            <div>docs = db.similarity_search_with_score(query, k=3)</div>
            <div className="text-brand-success font-semibold mt-1.5">&gt; Matched 3 Chunks [Similarity Score &gt; 0.84]</div>
            <div className="pl-3 text-[10px] text-text-secondary line-clamp-1">Ref: clinical_guidelines_diabetes_2024.pdf</div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-text-muted flex justify-between">
            <span>INDEX SIZE: 1,000+ DOCS</span>
            <span>DB SCHEDULER: CHROMADB</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="projects" className="py-20 relative z-10 max-w-6xl mx-auto px-4 border-t border-white/5">
      
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/30 text-brand-indigo text-xs font-mono mb-4"
        >
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>PRODUCTION SPEC LAUNCH</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tight">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-cyan font-semibold">AI Projects</span>
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mt-3 text-sm md:text-base">
          Uttam designs products that solve scalability and accuracy bottlenecks in modern generative workflows.
        </p>
      </div>

      {/* Alternating layouts */}
      <div className="flex flex-col gap-24">
        {projects.map((project, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={project.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left ${
                isEven ? "" : "lg:flex-row-reverse"
              }`}
            >
              
              {/* Text Specs (Alternating placement) */}
              <div className={`lg:col-span-7 flex flex-col gap-5 ${
                isEven ? "lg:order-1" : "lg:order-2"
              }`}>
                {/* Badge */}
                <span className="text-xs font-mono font-bold tracking-wider text-brand-indigo uppercase">
                  {project.badge}
                </span>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl font-serif text-white font-medium">
                  {project.title}
                </h3>

                {/* Overview */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-[10px] font-mono font-bold text-brand-error flex items-center gap-1 uppercase">
                    <AlertTriangle className="w-3 h-3" /> PROBLEM
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed pl-4 border-l border-brand-error/20">
                    {project.problem}
                  </p>
                </div>

                {/* Solution */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-brand-success flex items-center gap-1 uppercase">
                    <Award className="w-3 h-3" /> SOLUTION
                  </span>
                  <p className="text-sm text-white/90 leading-relaxed pl-4 border-l border-brand-success/20">
                    {project.solution}
                  </p>
                </div>

                {/* Features list */}
                <div className="flex flex-col gap-2 my-1.5">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <ChevronRight className="w-4 h-4 text-brand-indigo flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Challenge & Tradeoff (Double column widget) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="glass-panel p-4 rounded-xl border-white/5 text-xs">
                    <span className="font-mono text-brand-purple font-semibold flex items-center gap-1 mb-1 uppercase text-[10px]">
                      <Scale className="w-3.5 h-3.5" /> Engineering Challenge
                    </span>
                    <p className="text-text-secondary leading-relaxed">{project.challenge}</p>
                  </div>
                  <div className="glass-panel p-4 rounded-xl border-white/5 text-xs">
                    <span className="font-mono text-brand-cyan font-semibold flex items-center gap-1 mb-1 uppercase text-[10px]">
                      <Zap className="w-3.5 h-3.5" /> Decision Tradeoff
                    </span>
                    <p className="text-text-secondary leading-relaxed">{project.tradeoff}</p>
                  </div>
                </div>

                {/* Tech Stack pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-text-secondary hover:border-white/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Results Widget & CTAs */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-success animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      OUTCOME: <span className="text-brand-success">{project.result}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-text-secondary hover:text-white transition-colors cursor-pointer"
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                    <a
                      href={project.demoUrl}
                      className="flex items-center gap-1 text-xs text-brand-indigo hover:text-brand-indigo/80 font-bold transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Interactive Demo</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Interactive Visual Blueprint Container */}
              <div className={`lg:col-span-5 h-[340px] flex items-center justify-center ${
                isEven ? "lg:order-2" : "lg:order-1"
              }`}>
                {project.visualPanel}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
