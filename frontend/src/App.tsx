import { useState, useEffect } from "react";
import axios from "axios";
import {
  sendMessage,
  getConversations,
  getMessages,
  deleteConversation,
} from "./api/Api";
import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import InputBox from "./components/InputBox";

export type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  createdAt: string;
  isError?: boolean;
};

export type Conversation = {
  id: string;
  title: string | null;
  updatedAt: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("sessionId");
    if (saved) loadSession(saved);
    refreshSidebar();
  }, []);

  async function refreshSidebar() {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch {}
  }

  async function loadSession(id: string) {
    try {
      const msgs = await getMessages(id);
      setMessages(msgs);
      setSessionId(id);
      localStorage.setItem("sessionId", id);
    } catch {
      setMessages([
        errorMessage("Failed to load conversation. Please try again."),
      ]);
    }
  }

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, userMessage(msg)]);
    setIsLoading(true);

    try {
      const data = await sendMessage(msg, sessionId);

      if (data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("sessionId", data.sessionId);
      }

      setMessages((prev) => [...prev, aiMessage(data.reply)]);
      refreshSidebar();
    } catch (err) {
      const text = axios.isAxiosError(err)
        ? err.response?.data?.error || "Something went wrong. Please try again."
        : "Sorry, our support agent is temporarily unavailable. Please try again.";
      setMessages((prev) => [...prev, errorMessage(text)]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setSessionId(undefined);
    localStorage.removeItem("sessionId");
  }

  async function handleDelete(id: string) {
    try {
      await deleteConversation(id);
      if (id === sessionId) handleNewChat();
      refreshSidebar();
    } catch {
     
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#1F1F1F] overflow-hidden">
      <Sidebar
        conversations={conversations}
        sessionId={sessionId}
        onSelect={loadSession}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
      />

      <main className="flex flex-col flex-1 min-w-0 border-l border-white/[0.06]">
        <header className="flex items-center justify-between px-5 py-[18px] border-b border-white/[0.05] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white shrink-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M13 2L4 14h7l-2 7 9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-white/85 tracking-[-0.01em]">
                Spur AI Agent
              </p>
              <p
                className={`text-[11px] flex items-center gap-1.5 ${isLoading ? "text-amber-400/70" : "text-emerald-400/70"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-amber-400" : "bg-emerald-400"}`}
                />
                {isLoading ? "Typing…" : "Online"}
              </p>
            </div>
          </div>

        </header>

        <MessageList
          messages={messages}
          isLoading={isLoading}
          onSuggest={handleSend}
        />

        <InputBox
          input={input}
          isLoading={isLoading}
          onChange={setInput}
          onSend={() => handleSend()}
        />
      </main>
    </div>
  );
}

function userMessage(text: string): Message {
  return {
    id: Date.now() + "-user",
    sender: "user",
    text,
    createdAt: new Date().toISOString(),
  };
}

function aiMessage(text: string): Message {
  return {
    id: Date.now() + "-ai",
    sender: "ai",
    text,
    createdAt: new Date().toISOString(),
  };
}

function errorMessage(text: string): Message {
  return {
    id: Date.now() + "-err",
    sender: "ai",
    text,
    createdAt: new Date().toISOString(),
    isError: true,
  };
}
