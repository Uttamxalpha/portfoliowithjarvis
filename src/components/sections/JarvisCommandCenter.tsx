"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Trash2, Edit3, Send, Compass, Plus, Sparkles, Code, 
  Copy, RefreshCw, Check, AlertCircle, ChevronDown, ChevronUp, 
  ExternalLink, Search, FileText, Database, BookOpen, Terminal,
  HelpCircle, User, Info, Smartphone
} from "lucide-react";
import { useJarvisStore, Message, Source } from "@/store/useJarvisStore";
import { PromptInputBox } from "../ui/ai-prompt-box";
import ReactMarkdown from "react-markdown";
import { getMockResponse } from "@/utils/mockJarvis";

// Custom code component for ReactMarkdown
interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "code";
  const codeContent = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-brand-purple font-mono font-semibold">
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-white/10 bg-background-deep shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02] text-xs text-text-secondary font-mono">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 font-semibold text-white/90">{lang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-brand-success" />
              <span className="text-brand-success font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-white/90 leading-relaxed scrollbar-thin">
        <code>{codeContent}</code>
      </pre>
    </div>
  );
};

export default function JarvisCommandCenter() {
  const {
    sessions,
    activeSessionId,
    backendHealth,
    isLoading,
    isThinkMode,
    isSearchMode,
    isCanvasMode,
    createSession,
    deleteSession,
    renameSession,
    selectSession,
    addMessage,
    updateLastMessageContent,
    setLoading,
    setThinkMode,
    setSearchMode,
    setCanvasMode,
    checkBackendHealth,
    clearHistory
  } = useJarvisStore();

  const [inputVal, setInputVal] = useState("");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simulated reasoning stages (R1 Think Mode)
  const [thinkingStages, setThinkingStages] = useState<{ label: string; status: "pending" | "running" | "done" }[]>([]);
  const [activeThinkingLog, setActiveThinkingLog] = useState("");
  const [expandedThoughts, setExpandedThoughts] = useState<{ [msgId: string]: boolean }>({});

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get active session
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // Poll backend health
  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 15000);
    return () => clearInterval(interval);
  }, [checkBackendHealth]);

  // Create default session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      createSession();
    } else if (!activeSessionId) {
      selectSession(sessions[0].id);
    }
  }, [sessions, activeSessionId, createSession, selectSession]);

  // Scroll to bottom on message updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeSession?.messages, isLoading, activeThinkingLog]);

  const handleCreateSession = () => {
    createSession();
  };

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingSessionId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      renameSession(id, editTitle.trim());
    }
    setEditingSessionId(null);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputVal(prompt);
  };

  // Perform Streaming Call
  const handleSendQuery = async (queryText: string, attachments?: File[]) => {
    if (!queryText.trim() && (!attachments || attachments.length === 0)) return;
    if (isLoading) return;

    let targetSessionId = activeSessionId;
    if (!targetSessionId) {
      targetSessionId = createSession();
    }

    const filesData = attachments?.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f), // Local preview URL
      size: f.size
    }));

    // Add User Message
    addMessage(targetSessionId, {
      sender: "user",
      content: queryText,
      files: filesData
    });

    setLoading(true);
    setActiveThinkingLog("");

    // Set up thinking stages if Think Mode is active
    if (isThinkMode) {
      setThinkingStages([
        { label: "Parsing query semantic intent", status: "running" },
        { label: "Retrieving RAG vector database chunks", status: "pending" },
        { label: "Structuring grounding context", status: "pending" },
        { label: "Formulating LLM system completion", status: "pending" }
      ]);
    } else {
      setThinkingStages([]);
    }

    // Add empty assistant response to fill in later
    addMessage(targetSessionId, {
      sender: "assistant",
      content: "",
      thinkingProcess: ""
    });

    let currentResponseText = "";
    let currentThinkingProcess = "";

    try {
      // Step 1: Run simulated stages for Think Mode
      if (isThinkMode) {
        // Stage 1
        await new Promise((r) => setTimeout(r, 800));
        setThinkingStages(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: "done" } : idx === 1 ? { ...s, status: "running" } : s));
        currentThinkingProcess += "> Parsing query semantic intent: OK\n";
        updateLastMessageContent(targetSessionId, "", currentThinkingProcess);

        // Stage 2
        await new Promise((r) => setTimeout(r, 1000));
        setThinkingStages(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: "done" } : idx === 2 ? { ...s, status: "running" } : s));
        currentThinkingProcess += "> Querying ChromaDB vector index matching 'uttam': Found 5 matching text nodes.\n";
        updateLastMessageContent(targetSessionId, "", currentThinkingProcess);

        // Stage 3
        await new Promise((r) => setTimeout(r, 900));
        setThinkingStages(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: "done" } : idx === 3 ? { ...s, status: "running" } : s));
        currentThinkingProcess += "> Ingesting resume context. Initializing RAG validation flow: SUCCESS\n";
        updateLastMessageContent(targetSessionId, "", currentThinkingProcess);

        // Stage 4
        await new Promise((r) => setTimeout(r, 600));
        setThinkingStages(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: "done" } : s));
        currentThinkingProcess += "> Generating grounded context answer...\n";
        updateLastMessageContent(targetSessionId, "", currentThinkingProcess);
      }

      // Step 2: Call FastAPI or fallback to simulated stream
      let useMock = backendHealth !== "online";
      let response = null;
      
      if (!useMock) {
        try {
          response = await fetch("http://localhost:8000/chat/stream", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: queryText }),
          });
          if (!response.ok) {
            useMock = true;
          }
        } catch (e) {
          console.warn("FastAPI backend offline, falling back to local simulation:", e);
          useMock = true;
        }
      }

      if (useMock) {
        const mockData = getMockResponse(queryText);
        
        // Simulating the thoughts stream first
        if (isThinkMode && mockData.thinkingProcess) {
          const thoughtsLines = mockData.thinkingProcess.split("\n");
          for (const line of thoughtsLines) {
            currentThinkingProcess += line + "\n";
            updateLastMessageContent(targetSessionId, "", currentThinkingProcess);
            await new Promise((r) => setTimeout(r, 100)); // simulated think speed
          }
        }

        // Simulating the text stream
        const text = mockData.content;
        const chunkSize = 8;
        let charIndex = 0;
        
        while (charIndex < text.length) {
          currentResponseText += text.substring(charIndex, charIndex + chunkSize);
          charIndex += chunkSize;
          
          updateLastMessageContent(
            targetSessionId, 
            currentResponseText, 
            currentThinkingProcess || undefined,
            isSearchMode ? mockData.sources : undefined
          );
          
          await new Promise((r) => setTimeout(r, 20)); // simulated token speed
        }
      } else if (response) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("ReadableStream not supported by response.");

        const standardCitations = [
          { title: "Uttam_Tiwari_Resume.pdf", url: "file:///knowledge_base/resume.pdf", snippet: "Uttam Tiwari - AI Engineer specializing in Generative AI, LLM Engineering, Agentic AI, RAG, and Machine Learning." },
          { title: "Misinfo Buster GitHub Repository", url: "https://github.com/Uttamxalpha/whatsapp-agent" }
        ];

        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              const jsonStr = trimmed.substring(6);
              try {
                const data = JSON.parse(jsonStr);
                if (data.token === "[DONE]") {
                  // finished
                } else {
                  currentResponseText += data.token;
                  updateLastMessageContent(
                    targetSessionId, 
                    currentResponseText, 
                    currentThinkingProcess || undefined,
                    isSearchMode ? standardCitations : undefined
                  );
                }
              } catch (err) {
                console.error("Error parsing streaming json:", jsonStr, err);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      // Update with offline message error
      currentResponseText = `### ⚠️ Connection Lost to FastAPI Backend\n\nI was unable to retrieve a response because the backend API is currently offline. \n\n**To resolve this issue:**\n1. Ensure the FastAPI application is running (`+ "`" + `uvicorn main:app --reload` + "`" + ` on port 8000).\n2. Check your local network or run `+ "`" + `curl http://localhost:8000/health` + "`" + ` in a terminal.\n3. Click **Regenerate** below to attempt reconnecting.`;
      updateLastMessageContent(targetSessionId, currentResponseText, currentThinkingProcess || undefined);
    } finally {
      setLoading(false);
      setThinkingStages([]);
    }
  };

  const handleRegenerate = async (msgIndex: number) => {
    if (isLoading || !activeSession || msgIndex <= 0) return;
    
    // Find the previous user query
    const lastUserMessage = activeSession.messages
      .slice(0, msgIndex)
      .reverse()
      .find((m) => m.sender === "user");

    if (lastUserMessage) {
      // Remove everything from the assistant message index forward
      const updatedMessages = activeSession.messages.slice(0, msgIndex);
      sessions.forEach((s) => {
        if (s.id === activeSession.id) {
          s.messages = updatedMessages;
        }
      });
      // Re-trigger query
      handleSendQuery(lastUserMessage.content, []);
    }
  };

  const handleCopyMessage = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const toggleThoughts = (msgId: string) => {
    setExpandedThoughts(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Render Perplexity-style Sources
  const renderSources = (sources: Source[]) => {
    if (!sources || sources.length === 0) return null;

    return (
      <div className="mt-2 mb-4 w-full text-left">
        <div className="flex items-center gap-1.5 text-xs text-brand-cyan font-mono mb-2">
          <Search className="w-3.5 h-3.5" />
          <span>SEARCH SOURCES FOUND ({sources.length})</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
          {sources.map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="glass-panel p-3 rounded-xl hover:border-brand-cyan/40 hover:bg-white/[0.02] transition-all flex flex-col gap-1 text-left"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-white font-mono gap-1">
                <span className="truncate max-w-[130px]">{src.title}</span>
                <ExternalLink className="w-3 h-3 text-text-secondary flex-shrink-0" />
              </div>
              {src.snippet && (
                <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed">
                  {src.snippet}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>
    );
  };

  const suggestionChips = [
    "Tell me about Uttam",
    "Show AI projects",
    "Explain Medical Chatbot",
    "Explain LangGraph Project",
    "Show Resume summary",
    "What is his tech stack?",
    "Why hire Uttam?",
    "Show certifications"
  ];

  return (
    <section id="jarvis" className="py-20 relative z-10 max-w-6xl mx-auto px-4 min-h-screen flex flex-col">
      {/* Title */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/30 text-brand-indigo text-xs font-mono mb-4"
        >
          <Sparkles className="w-3 h-3" />
          <span>COMMAND LINE CORE</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-serif text-white font-medium tracking-tight">
          Uttam&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-cyan">Jarvis AI OS</span>
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mt-3 text-sm md:text-base">
          Query the neural knowledge base loaded with Uttam&apos;s professional history, RAG systems, and AI credentials.
        </p>
      </div>

      {/* Main Terminal Workspace Layout */}
      <div className="glass-panel-strong rounded-3xl border border-white/10 overflow-hidden flex flex-col md:grid md:grid-cols-12 h-[680px] shadow-2xl relative">
        
        {/* Left Sidebar: Session History */}
        <div className={`border-r border-white/10 md:col-span-3 bg-white/[0.01] flex flex-col h-full ${
          isSidebarOpen ? "block" : "hidden md:flex"
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-white tracking-widest flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-brand-indigo" />
              SESSIONS
            </span>
            <button
              onClick={handleCreateSession}
              className="p-1.5 rounded-lg border border-white/10 hover:border-brand-indigo/60 hover:bg-brand-indigo/10 text-white transition-all cursor-pointer"
              title="New Session"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 scrollbar-thin">
            <AnimatePresence initial={false}>
              {sessions.map((s) => {
                const isActive = activeSessionId === s.id;
                const isEditing = editingSessionId === s.id;
                return (
                  <motion.div
                    key={s.id}
                    layoutId={`session-${s.id}`}
                    className={`group rounded-xl p-2.5 flex items-center justify-between text-left transition-all ${
                      isActive 
                        ? "bg-brand-indigo/10 border border-brand-indigo/30 text-white" 
                        : "hover:bg-white/5 border border-transparent text-text-secondary hover:text-white"
                    }`}
                  >
                    <button
                      onClick={() => selectSession(s.id)}
                      className="flex-1 truncate mr-2 text-xs font-mono text-left cursor-pointer"
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleSaveRename(s.id)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveRename(s.id)}
                          className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-white w-full text-xs font-mono focus:outline-none focus:border-brand-indigo"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        s.title
                      )}
                    </button>
                    {!isEditing && (
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartRename(s.id, s.title)}
                          className="p-1 hover:text-white transition-colors cursor-pointer"
                          title="Rename"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {sessions.length > 1 && (
                          <button
                            onClick={() => deleteSession(s.id)}
                            className="p-1 hover:text-brand-error transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Connection health status footer */}
          <div className="p-3 border-t border-white/10 bg-black/20 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${
                backendHealth === "online" 
                  ? "bg-brand-success animate-pulse" 
                  : backendHealth === "checking" 
                  ? "bg-brand-warning animate-pulse" 
                  : "bg-brand-error"
              }`} />
              <span className="font-mono text-text-secondary uppercase">
                Jarvis: <span className={
                  backendHealth === "online" ? "text-brand-success font-semibold" : 
                  backendHealth === "checking" ? "text-brand-warning font-semibold" : "text-brand-error font-semibold"
                }>{backendHealth}</span>
              </span>
            </div>
            {sessions.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-[10px] text-text-muted hover:text-brand-error transition-colors cursor-pointer"
              >
                Clear Cache
              </button>
            )}
          </div>
        </div>

        {/* Center: Conversation Stream */}
        <div className="md:col-span-6 flex flex-col h-full bg-black/5 overflow-hidden">
          {/* Scrollable chat body */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 scrollbar-thin">
            {activeSession?.messages.map((msg, index) => {
              const isUser = msg.sender === "user";
              return (
                <div key={msg.id} className={`flex gap-3 text-left ${isUser ? "justify-end" : "justify-start"}`}>
                  
                  {/* Avatar Icons */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full border border-brand-indigo/30 bg-brand-indigo/10 flex items-center justify-center text-brand-indigo flex-shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                    
                    {/* Timestamp & Name */}
                    <span className="text-[10px] font-mono text-text-muted mb-1 px-1">
                      {isUser ? "USER" : "JARVIS OS"} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                    </span>

                    {/* Collapsible thought processes (DeepSeek R1 style) */}
                    {msg.thinkingProcess && (
                      <div className="w-full mb-2 border-l-2 border-brand-purple/35 bg-brand-purple/5 rounded-r-lg p-2.5 text-xs text-text-secondary">
                        <button
                          onClick={() => toggleThoughts(msg.id)}
                          className="flex items-center gap-1.5 font-semibold text-brand-purple hover:text-brand-purple/80 transition-colors focus:outline-none mb-1 text-[11px] cursor-pointer"
                        >
                          {expandedThoughts[msg.id] ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5" />
                              <span>COLLAPSE DEEP COGNITIVE THINKING PROCESS</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5" />
                              <span>EXPAND DEEP COGNITIVE THINKING PROCESS</span>
                            </>
                          )}
                        </button>
                        {expandedThoughts[msg.id] !== false && (
                          <pre className="font-mono text-[10px] leading-relaxed overflow-x-auto text-brand-purple/80 whitespace-pre-wrap mt-1.5">
                            {msg.thinkingProcess}
                          </pre>
                        )}
                      </div>
                    )}

                    {/* Source citations for search mode */}
                    {isSearchMode && msg.sources && msg.sources.length > 0 && renderSources(msg.sources)}

                    {/* Message content bubble */}
                    <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
                      isUser
                        ? "bg-brand-indigo/15 border border-brand-indigo/30 text-white rounded-tr-none"
                        : "glass-panel text-white rounded-tl-none border-white/5"
                    }`}>
                      
                      {/* Image Preview attachments if present */}
                      {msg.files && msg.files.map((file, i) => (
                        <div key={i} className="mb-2 max-w-[150px] rounded-xl overflow-hidden border border-white/10">
                          <img src={file.url} alt={file.name} className="w-full h-auto object-cover max-h-[120px]" />
                        </div>
                      ))}

                      {msg.content ? (
                        <div className="prose-custom">
                          <ReactMarkdown components={{ code: CodeBlock }}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-text-secondary font-mono text-xs">
                          <span className="w-2 h-2 rounded-full bg-brand-indigo animate-ping" />
                          <span>Streaming neural layers...</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons (copy, regenerate, etc.) */}
                    {!isUser && msg.content && (
                      <div className="flex items-center gap-3 mt-1.5 px-1 opacity-60 hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyMessage(msg.content)}
                          className="flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-white transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                        {index > 1 && (
                          <button
                            onClick={() => handleRegenerate(index)}
                            className="flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-white transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Regenerate</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}

                </div>
              );
            })}

            {/* Simulated Live thinking steps rendering */}
            {isLoading && thinkingStages.length > 0 && (
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full border border-brand-purple/35 bg-brand-purple/10 flex items-center justify-center text-brand-purple flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1 w-full max-w-[80%]">
                  <span className="text-[10px] font-mono text-brand-purple">DEEP THINKING MATRIX</span>
                  <div className="glass-panel p-3.5 rounded-2xl border-brand-purple/20 bg-brand-purple/[0.02] flex flex-col gap-2">
                    {thinkingStages.map((stage, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono">
                        {stage.status === "done" ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-brand-success/20 border border-brand-success flex items-center justify-center text-[8px] text-brand-success font-bold">✓</div>
                        ) : stage.status === "running" ? (
                          <div className="w-3.5 h-3.5 rounded-full border border-brand-purple border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-white/10 bg-white/5" />
                        )}
                        <span className={
                          stage.status === "done" ? "text-text-muted line-through" :
                          stage.status === "running" ? "text-brand-purple font-semibold" : "text-text-muted"
                        }>
                          {stage.label}...
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompt Chips */}
          {activeSession && activeSession.messages.length <= 1 && (
            <div className="px-4 py-2 flex flex-wrap gap-1.5 justify-center max-h-[85px] overflow-y-auto scrollbar-none border-t border-white/5 bg-black/10">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedPrompt(chip)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-full border border-white/5 hover:border-brand-indigo/40 bg-white/[0.02] hover:bg-brand-indigo/10 text-text-secondary hover:text-white transition-all duration-200 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Active Input Box Area */}
          <div className="p-3 border-t border-white/10 bg-[#0c0d0f]">
            <PromptInputBox
              onSend={handleSendQuery}
              isLoading={isLoading}
              externalInput={inputVal}
              setExternalInput={setInputVal}
            />
          </div>
        </div>

        {/* Right Sidebar: Shortcuts Widget Panel */}
        <div className="hidden md:flex md:col-span-3 border-l border-white/10 flex-col h-full bg-white/[0.01]">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center gap-1.5 font-mono text-xs font-bold text-white tracking-widest">
            <Compass className="w-3.5 h-3.5 text-brand-cyan" />
            OPERATIONS
          </div>

          {/* Content Widget Cards */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">
            
            {/* Widget: About shortcut */}
            <div className="glass-panel p-3.5 rounded-2xl border-white/5 text-left hover:border-brand-indigo/40 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white mb-1.5 uppercase">
                <Info className="w-3.5 h-3.5 text-brand-indigo" />
                Who is Uttam?
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed mb-2.5">
                AI Engineer specializing in building full-scale RAG systems, LLM agent workflows, and NLP engines.
              </p>
              <button
                onClick={() => handleSuggestedPrompt("Tell me about Uttam's professional background")}
                className="w-full text-center py-1.5 text-[10px] font-mono font-bold tracking-wider text-white uppercase bg-brand-indigo/10 border border-brand-indigo/40 hover:bg-brand-indigo hover:border-brand-indigo transition-all rounded-lg cursor-pointer"
              >
                Inquire Jarvis
              </button>
            </div>

            {/* Widget: Projects shortcut */}
            <div className="glass-panel p-3.5 rounded-2xl border-white/5 text-left hover:border-brand-purple/40 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white mb-1.5 uppercase">
                <Database className="w-3.5 h-3.5 text-brand-purple" />
                Featured Project
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed mb-2.5">
                **Misinfo Buster**: Multi-agent WhatsApp misinformation detection system built using LangGraph stateful flows.
              </p>
              <button
                onClick={() => handleSuggestedPrompt("Explain LangGraph Project")}
                className="w-full text-center py-1.5 text-[10px] font-mono font-bold tracking-wider text-white uppercase bg-brand-purple/10 border border-brand-purple/40 hover:bg-brand-purple hover:border-brand-purple transition-all rounded-lg cursor-pointer"
              >
                Inspect Agent
              </button>
            </div>

            {/* Widget: Resume Download link */}
            <div className="glass-panel p-3.5 rounded-2xl border-white/5 text-left hover:border-brand-cyan/40 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white mb-1.5 uppercase">
                <FileText className="w-3.5 h-3.5 text-brand-cyan" />
                CV Knowledge Base
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed mb-2.5">
                Download a clean copy of Uttam Tiwari&apos;s PDF resume directly from Google Drive.
              </p>
              <a
                href="https://drive.google.com/file/d/1BgYIlSXvJ3HW9JNddz8d8Br5KOLA4bOd/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center py-1.5 text-[10px] font-mono font-bold tracking-wider text-white uppercase bg-brand-cyan/10 border border-brand-cyan/40 hover:bg-brand-cyan hover:border-brand-cyan transition-all rounded-lg cursor-pointer"
              >
                Download PDF
              </a>
            </div>

            {/* Quick Prompts Helper */}
            <div className="mt-2 text-[10px] font-mono text-text-muted bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col gap-1.5 text-left leading-relaxed">
              <div className="font-bold text-text-secondary flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-brand-indigo" />
                KEYBOARD SHORTCUTS
              </div>
              <div>• `Enter`: Send Message</div>
              <div>• `Shift+Enter`: New line</div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
