export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export interface MockResponse {
  thinkingProcess: string;
  content: string;
  sources: Source[];
}

const SOURCES: Record<string, Source> = {
  resume: {
    title: "Uttam_Tiwari_Resume.pdf",
    url: "file:///knowledge_base/resume.pdf",
    snippet: "Uttam Tiwari - AI Engineer specializing in Generative AI, LLM Engineering, Agentic AI, RAG, and Machine Learning."
  },
  ragProj: {
    title: "Medical AI Chatbot GitHub Repository",
    url: "https://github.com/Uttamxalpha/voice_medi_chat",
    snippet: "Medical AI Chatbot (RAG-Based Question Answering System): LangChain, Vector Search, LLMs."
  },
  agenticProj: {
    title: "Misinfo Buster GitHub Repository",
    url: "https://github.com/Uttamxalpha/whatsapp-agent",
    snippet: "Misinfo Buster – AI-Powered WhatsApp Misinformation Detection System: LangGraph, RAG, LLMs, Streamlit."
  },
  plantProj: {
    title: "Plant Disease Detection GitHub Repository",
    url: "https://github.com/Uttamxalpha/plant-health-app",
    snippet: "Plant Disease Detection System: CNN, MobileNetV3, Deep Learning, Computer Vision."
  },
  skillsGraph: {
    title: "Uttam's Skills Graph Schema",
    url: "file:///knowledge_base/skills_network.json",
    snippet: "Trigonometric model mapping key capabilities including LangChain, LlamaIndex, PyTorch, HuggingFace, Next.js, and FastAPI."
  },
  roiScorecard: {
    title: "Recruiter ROI scorecard",
    url: "file:///knowledge_base/roi_scorecard.json",
    snippet: "Full scorecard detail: onboarding reduction, development velocity, architecture efficiency, and hiring highlights."
  }
};

export const getMockResponse = (query: string): MockResponse => {
  const q = query.toLowerCase();

  // 1. SKILLS
  if (q.includes("skills") || q.includes("technology") || q.includes("tech") || q.includes("stack") || q.includes("languages") || q.includes("frameworks") || q.includes("tools")) {
    return {
      thinkingProcess: `<intent_classification> User is asking about technical skills, developer stack, and core tools.
<rag_retrieval> Searching document chunks for "skills", "languages", "frameworks".
Found match in resume.pdf section: "Technical Competencies".
Found match in skills_network.json.
<synthesis> Group skills into: Generative AI/LLMs, Agentic Frameworks, Machine Learning, Backend, and Frontend. Add details about specific libraries like LangChain, LlamaIndex, PyTorch, HuggingFace, FastAPI, and Next.js.
Formatting response with bullet points, inline code, and sources.`,
      content: `### 🛠️ Uttam Tiwari's Technical Ecosystem

Uttam's engineering capabilities span the entire lifecycle of intelligent applications, from machine learning models to production-grade deployment [1]:

#### 🤖 Generative AI & Large Language Models
* **Frameworks & Orchestration**: LangChain, LlamaIndex, LangGraph (stateful multi-agent systems) [3].
* **Vector Databases**: ChromaDB, Pinecone, FAISS, Milvus.
* **Techniques**: Retrieval-Augmented Generation (RAG), Query Optimization, Semantic Search, Agentic Workflows, and Tool Use [1, 2].
* **Models**: Llama, GPT, Claude, DeepSeek, SentenceTransformers [2, 3].

#### 🧠 Machine Learning & NLP
* **Core Libraries**: PyTorch, Hugging Face, Scikit-Learn, NumPy, Pandas.
* **Specialties**: Natural Language Processing (NLP), Text Classification, Named Entity Recognition (NER), Semantic Embeddings [1].

#### ⚙️ Backend & Architecture
* **Languages**: Python, SQL, JavaScript/TypeScript.
* **Frameworks**: FastAPI, Flask, Node.js [1].
* **Database & Storage**: PostgreSQL, SQLite, MongoDB.
* **Cloud & DevOps**: Docker, Git, RESTful API Design.

#### 🎨 Frontend (OS / Visualization)
* **Frameworks**: React, Next.js (App Router), Tailwind CSS v4, Framer Motion.
* **Data Visualization**: Custom SVG neural paths, trigonometric animation layers [4].

*(Offline Mode: Simulating response locally. Run backend on port 8000 for full live PDF-grounded RAG query support)*`,
      sources: [SOURCES.resume, SOURCES.skillsGraph, SOURCES.agenticProj]
    };
  }

  // 2. PROJECTS
  if (q.includes("project") || q.includes("portfolio") || q.includes("work") || q.includes("apps") || q.includes("build") || q.includes("github")) {
    return {
      thinkingProcess: `<intent_classification> User is inquiring about featured projects or GitHub repositories.
<rag_retrieval> Querying resume.pdf and GitHub links for project details.
Matches found: "Misinfo Buster", "Plant Disease Detection System", "Medical AI Chatbot".
<synthesis> Compile list of exactly 3 key projects, summarizing their problems, solutions, tech stacks, and results. Detail LangGraph, MobileNetV3, and LangChain integrations.
Formatting response as a clean Markdown list with code tags and sources.`,
      content: `### 🚀 Core Portfolio Projects

Here are the featured intelligent systems built by Uttam [1]:

#### 1. Misinfo Buster – AI-Powered WhatsApp Misinformation Detection System [3]
* **Goal**: Enable autonomous verification of forwarded WhatsApp messages through coordinated reasoning and retrieval workflows.
* **Solution**: Designed and implemented a **Hybrid Retrieval (Dense + Semantic Search) RAG pipeline** and a modular **3-stage agent architecture** (Claim Extraction, Evidence Retrieval, and Verdict Generation) orchestrated using **LangGraph** stateful workflows.
* **Result**: Generates interpretable, evidence-backed decisions via a 3-way classification framework (True / False / Uncertain) with **~2–3 second end-to-end inference latency**. Deployed on Streamlit Cloud.
* **Tech Stack**: \`LangGraph\`, \`RAG\`, \`LLMs\`, \`Streamlit\`, \`Python\`

#### 2. Plant Disease Detection System [4]
* **Goal**: Automate leaf disease classification to identify crop health issues using computer vision.
* **Solution**: Developed and optimized Deep Learning models for plant disease classification using a dataset of **56K+ leaf images**, fine-tuning **MobileNetV3** using transfer learning and extensive data augmentation.
* **Result**: Achieved **93% prediction accuracy** across multiple disease categories; integrated into a real-time web-based platform.
* **Tech Stack**: \`CNN\`, \`MobileNetV3\`, \`Deep Learning\`, \`Computer Vision\`, \`Python\`

#### 3. Medical AI Chatbot (RAG-Based Question Answering System) [2]
* **Goal**: Enable evidence-grounded medical question answering from dense scientific documents.
* **Solution**: Built a **Retrieval-Augmented Generation (RAG)** pipeline using **LangChain** to process, clean, and index **1,000+ medical documents** with semantic vector similarity search.
* **Result**: Delivered grounded, accurate healthcare responses with optimized context selection and minimal out-of-scope query failures.
* **Tech Stack**: \`LangChain\`, \`Vector Search\`, \`LLMs\`, \`Python\`

*(Offline Mode: Simulating response locally. Run backend on port 8000 for full live PDF-grounded RAG query support)*`,
      sources: [SOURCES.resume, SOURCES.ragProj, SOURCES.agenticProj, SOURCES.plantProj]
    };
  }

  // 3. EXPERIENCE / CAREER / EDUCATION
  if (q.includes("experience") || q.includes("jobs") || q.includes("work") || q.includes("history") || q.includes("career") || q.includes("timeline") || q.includes("education") || q.includes("college") || q.includes("university")) {
    return {
      thinkingProcess: `<intent_classification> User is asking about professional career history, work experience, or background.
<rag_retrieval> Querying resume.pdf sections: "Professional Experience", "Education".
Matches found: Machine Learning Intern at Robotronix, B.Tech CS & AI student at Medi-Caps University.
<synthesis> Outline career timeline milestones for Uttam Tiwari. Focus on his ML Internship at Robotronix and B.Tech studies in Indore.
Formatting response with internship achievements, education, and sources.`,
      content: `### 💼 Professional Experience & Background

Uttam Tiwari is a dedicated Machine Learning and AI developer. His professional profile is summarized below [1]:

#### 🤖 Professional Experience
* **Machine Learning Intern** | **Robotronix Tech Pvt. Ltd.** (Jun 2025 – Sep 2025)
  * Improved fraud detection model accuracy from **78% to 87%** by designing advanced feature engineering pipelines, performing hyperparameter optimization, and implementing scalable Scikit-learn workflows.
  * Developed and evaluated multiple Machine Learning and Deep Learning models for classification problems, optimizing performance, generalization, and inference reliability.
  * Conducted comprehensive validation using Precision-Recall Analysis, Confusion Matrices, F1-Score, and ROC-AUC metrics.
  * Automated data preprocessing, feature selection, and training workflows to reduce experimentation time.
  * Collaborated with mentors and engineering teams to present technical findings.

#### 🎓 Education
* **B.Tech in Computer Science & AI** | **Medi-Caps University** (2023 – 2027)
  * Specializing in artificial intelligence, neural network architectures, and data engineering.
  * Core coursework in Data Structures, Algorithms, Python systems, and Machine Learning.

*(Offline Mode: Simulating response locally. Run backend on port 8000 for full live PDF-grounded RAG query support)*`,
      sources: [SOURCES.resume]
    };
  }

  // 4. CONTACT / REACH
  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("reach") || q.includes("linkedin") || q.includes("github") || q.includes("meet") || q.includes("schedule")) {
    return {
      thinkingProcess: `<intent_classification> User is asking for contact channels, email address, LinkedIn profile, or GitHub link.
<rag_retrieval> Querying contact info block in resume.pdf.
<synthesis> Extract email, LinkedIn, and GitHub links. Present them as interactive buttons or clean Markdown links.
Formatting response for direct communication.`,
      content: `### 📬 Get in Touch with Uttam Tiwari

You can contact Uttam directly using the details below or by submitting a message via the **Contact** card at the bottom of the OS dashboard [1]:

* **✉️ Email**: [uttamt2006@gmail.com](mailto:uttamt2006@gmail.com) (Primary response channel)
* **🔗 LinkedIn**: [linkedin.com/in/uttamtiwa](https://www.linkedin.com/in/uttamtiwa/) (Professional network)
* **💻 GitHub**: [github.com/Uttamxalpha](https://github.com/Uttamxalpha) (Codebases, tools, and templates)
* **📅 Calendar**: [Schedule a direct 15-min call](https://calendly.com)

If you have specific project requirements or a role in mind, check the **WhyHire Scorecard** to calculate the development velocity and ROI of onboarding Uttam to your engineering team.

*(Offline Mode: Simulating response locally. Run backend on port 8000 for full live PDF-grounded RAG query support)*`,
      sources: [SOURCES.resume, SOURCES.roiScorecard]
    };
  }

  // 5. WHY HIRE
  if (q.includes("why hire") || q.includes("hire") || q.includes("value") || q.includes("roi") || q.includes("cost") || q.includes("scorecard")) {
    return {
      thinkingProcess: `<intent_classification> User is evaluating Uttam for hire (recruiter intent).
<rag_retrieval> Retrieving ROI metrics and onboarding analysis.
<synthesis> Highlight specific recruiter-focused metrics: Onboarding time reduction, feature release velocity, API billing optimizer, and code refactor success rates.
Formatting response with bulleted metrics and sources.`,
      content: `### 📈 Recruiting Analytics: Why Hire Uttam Tiwari?

Onboarding Uttam Tiwari as an AI Engineer delivers measurable advantages in development speed, cost optimization, and architecture robustness [5]:

* **⚡ Onboarding Velocity**: Reaches full productivity on existing Next.js, FastAPI, and LangGraph architectures in **<7 days** due to full-stack domain proficiency.
* **💲 Model Cost Optimization**: Achieves up to **35% reduction** in LLM API bills through advanced prompt compression, selective caching, and deploying local SentenceTransformers or Mistral nodes.
* **🛠️ RAG Retrieval Accuracy**: Replaces vanilla chunking with structural parsing, raising retrieval accuracy from **64% to 98%** and minimizing model hallucinations.
* **⛓️ Graph Architecture**: Implements stateful agent workflows with loop limits and fallback edges, guaranteeing production stability and preventing API rate lockups.

If you are a technical recruiter or hiring manager, you can customize the live metrics dashboard in the **WhyHire Converter** section on the main page to calculate real-world savings!

*(Offline Mode: Simulating response locally. Run backend on port 8000 for full live PDF-grounded RAG query support)*`,
      sources: [SOURCES.roiScorecard, SOURCES.resume]
    };
  }

  // 6. GREETING / FALLBACK / INFO SUMMARY
  return {
    thinkingProcess: `<intent_classification> User is saying hello, greeting the system, or asking a generic question about Uttam's profile.
<rag_retrieval> Querying resume.pdf for core bio details.
<synthesis> Synthesize a premium summary statement introducing Uttam Tiwari. Explain that this dashboard is Jarvis OS, designed to demonstrate RAG, agents, and modern frontend styling.
Provide list of recommended questions for the user to try.`,
    content: `### 🤖 Welcome to Jarvis OS — Uttam's AI Operating System

I am **Jarvis**, an intelligent assistant grounded in Uttam Tiwari's technical background, system architectures, and professional credentials [1].

#### About Uttam Tiwari
Uttam is a specialized **AI Engineer** who designs and implements next-generation generative AI products, robust **RAG pipelines** [2], and stateful **multi-agent networks** [3]. He is proficient in Python, Next.js, FastAPI, LangGraph, and Vector Databases [1, 4].

#### Suggested Queries to Try:
* **"What are your core technical skills?"** — Displays a detailed list of language, library, and tool proficiencies.
* **"Tell me about your RAG and agent projects."** — Explains the architecture, challenges, tradeoffs, and outcomes of featured projects.
* **"Why should we hire you?"** — Shows recruiter-focused metrics, onboarding times, and API cost savings.
* **"How do I contact you?"** — Provides email, GitHub, LinkedIn, and scheduling links.

*Feel free to toggle **Think Mode** (to see my step-by-step logic) or **Search Mode** (to cite sources) using the capsules below!*

*(Offline Mode: Simulating response locally. Run backend on port 8000 for full live PDF-grounded RAG query support)*`,
    sources: [SOURCES.resume, SOURCES.skillsGraph]
  };
};
