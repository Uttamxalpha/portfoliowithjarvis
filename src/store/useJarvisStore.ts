import { create } from "zustand";
import { persist } from "zustand/middleware";

const generateUUID = () => {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export interface Attachment {
  name: string;
  url: string;
  size: number;
}

export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: number;
  thinkingProcess?: string; // Thought process log (DeepSeek R1 style)
  sources?: Source[];       // RAG source citation list (Perplexity style)
  files?: Attachment[];     // User uploaded image attachments
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

interface JarvisStore {
  sessions: ChatSession[];
  activeSessionId: string | null;
  backendHealth: "checking" | "online" | "offline";
  isLoading: boolean;
  isThinkMode: boolean;
  isSearchMode: boolean;
  isCanvasMode: boolean;
  
  // Actions
  createSession: (title?: string) => string;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  selectSession: (id: string) => void;
  addMessage: (sessionId: string, message: Omit<Message, "id" | "timestamp">) => void;
  updateLastMessageContent: (sessionId: string, content: string, thinkingProcess?: string, sources?: Source[]) => void;
  setLoading: (loading: boolean) => void;
  setThinkMode: (active: boolean) => void;
  setSearchMode: (active: boolean) => void;
  setCanvasMode: (active: boolean) => void;
  checkBackendHealth: () => Promise<void>;
  clearHistory: () => void;
}

export const useJarvisStore = create<JarvisStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      backendHealth: "checking",
      isLoading: false,
      isThinkMode: false,
      isSearchMode: false,
      isCanvasMode: false,

      createSession: (title) => {
        const id = generateUUID();
        const newSession: ChatSession = {
          id,
          title: title || `New Operation (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
          timestamp: Date.now(),
          messages: [
            {
              id: generateUUID(),
              sender: "assistant",
              content: "Jarvis System Online. I am ready to process requests regarding Uttam's professional capabilities, projects, credentials, and code. How can I assist you?",
              timestamp: Date.now(),
            }
          ],
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: id,
        }));
        return id;
      },

      deleteSession: (id) => {
        set((state) => {
          const filtered = state.sessions.filter((s) => s.id !== id);
          let nextActive = state.activeSessionId;
          if (state.activeSessionId === id) {
            nextActive = filtered.length > 0 ? filtered[0].id : null;
          }
          return {
            sessions: filtered,
            activeSessionId: nextActive,
          };
        });
      },

      renameSession: (id, title) => {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, title } : s)),
        }));
      },

      selectSession: (id) => {
        set({ activeSessionId: id });
      },

      addMessage: (sessionId, message) => {
        const newMessage: Message = {
          ...message,
          id: generateUUID(),
          timestamp: Date.now(),
        };

        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id !== sessionId) return s;

            // Generate a better title based on the first user query
            let updatedTitle = s.title;
            if (s.messages.length === 1 && message.sender === "user") {
              const query = message.content;
              updatedTitle = query.length > 28 ? query.substring(0, 25) + "..." : query;
            }

            return {
              ...s,
              title: updatedTitle,
              messages: [...s.messages, newMessage],
            };
          }),
        }));
      },

      updateLastMessageContent: (sessionId, content, thinkingProcess, sources) => {
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id !== sessionId) return s;
            const updatedMessages = [...s.messages];
            if (updatedMessages.length === 0) return s;
            
            const last = updatedMessages[updatedMessages.length - 1];
            if (last.sender === "assistant") {
              updatedMessages[updatedMessages.length - 1] = {
                ...last,
                content,
                ...(thinkingProcess !== undefined ? { thinkingProcess } : {}),
                ...(sources !== undefined ? { sources } : {}),
              };
            }
            return {
              ...s,
              messages: updatedMessages,
            };
          }),
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setThinkMode: (active) => set({
        isThinkMode: active,
        ...(active ? { isSearchMode: false, isCanvasMode: false } : {}),
      }),

      setSearchMode: (active) => set({
        isSearchMode: active,
        ...(active ? { isThinkMode: false, isCanvasMode: false } : {}),
      }),

      setCanvasMode: (active) => set({
        isCanvasMode: active,
        ...(active ? { isThinkMode: false, isSearchMode: false } : {}),
      }),

      checkBackendHealth: async () => {
        try {
          const res = await fetch("http://localhost:8000/health", { signal: AbortSignal.timeout(2000) });
          if (res.ok) {
            const data = await res.json();
            if (data.status === "ok") {
              set({ backendHealth: "online" });
              return;
            }
          }
          set({ backendHealth: "offline" });
        } catch (e) {
          set({ backendHealth: "offline" });
        }
      },

      clearHistory: () => {
        set({ sessions: [], activeSessionId: null });
      },
    }),
    {
      name: "jarvis-system-sessions",
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
      }),
    }
  )
);
