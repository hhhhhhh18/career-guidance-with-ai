"use client";
import { useState, useEffect, useRef } from "react";
import { X, MessageSquare, Plus, Menu, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AICareerChat({ onClose, userProfile}) {
  const [input, setInput] = useState("");
  const generateRoadmap = async (userProfile) => {
    const prompt = `
  Act as a career mentor.
  
  User:
  Name: ${userProfile.name}
  Skills: ${userProfile.skills}
  Goal: ${userProfile.role}
  
  Give:
  1. Step-by-step roadmap
  2. Best learning resources (YouTube, docs)
  3. 2-3 project ideas
  4. Job/internship platforms (Unstop, Naukri, Indeed)
  
  Keep it structured and beginner-friendly.
  `;
  
    // 🧠 CALL YOUR AI API HERE
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: prompt }),
    });
  
    const data = await res.json();
  
    // ✅ ONLY ADD AI MESSAGE (NOT USER MESSAGE)
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.reply,
      },
    ]);
  };
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    fetchConversations();
  }, []);
  useEffect(() => {
    if (userProfile) {
      generateRoadmap(userProfile);
    }
  }, [userProfile]);

  async function fetchConversations() {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();

      if (Array.isArray(data)) {
        setConversations(data);
        if (data.length > 0 && !currentId) {
          loadConversation(data[0].id);
        }
      } else {
        setConversations([]);
      }
    } catch {
      setConversations([]);
    }
  }

  async function loadConversation(id) {
    setCurrentId(id);
    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/${id}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      console.error("Failed to load chat");
    } finally {
      setLoading(false);
      setShowSidebar(false);
    }
  }

  async function startNewChat() {
    try {
      const res = await fetch("/api/conversations", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create chat");
  
      const newConvo = await res.json();
  
      const greeting = {
        role: "ai",
        content:
          "Hi! I’m your AI career advisor 👋 Tell me about your background and career goals.",
      };
  
      // Persist greeting
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: newConvo.id,
          role: "ai",
          content: greeting.content,
        }),
      });
  
      // ✅ THESE LINES MAKE IT OPEN IMMEDIATELY
      setCurrentId(newConvo.id);
      setMessages([greeting]);
      setConversations((prev) => [newConvo, ...prev]);
  
      setShowSidebar(false);
    } catch (err) {
      console.error("Failed to start new chat", err);
    }
  }
  

  async function deleteConversation(id) {
    const ok = confirm("Delete this chat?");
    if (!ok) return;

    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" });

      setConversations((prev) => prev.filter((c) => c.id !== id));

      if (currentId === id) {
        setCurrentId(null);
        setMessages([]);
      }
    } catch {
      console.error("Failed to delete chat");
    }
  }

  async function handleSend() {
    const messageToSend = input.trim();
    if (!messageToSend) return;

    setInput("");
    let activeId = currentId;

    try {
      if (!activeId) {
        const res = await fetch("/api/conversations", { method: "POST" });
        if (!res.ok) throw new Error();
        const newConvo = await res.json();
        activeId = newConvo.id;
        setCurrentId(activeId);
        setConversations((prev) => [newConvo, ...prev]);
      }

      setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
      setLoading(true);

      const aiRes = await fetch("/api/inngest/ai-career-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          conversationId: activeId,
        }),
      });

      if (!aiRes.ok) throw new Error();

      const data = await aiRes.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);

      fetchConversations();
    } catch {
      setInput(messageToSend);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-background w-full max-w-5xl h-[85vh] md:h-[600px] rounded-xl shadow-2xl flex overflow-hidden border">

        {/* SIDEBAR */}
        <div
          className={`${
            showSidebar ? "absolute inset-0 z-20" : "hidden"
          } md:relative md:flex flex-col w-64 border-r bg-muted/20`}
        >
          <div className="p-4 border-b flex justify-between items-center bg-background">
            <Button
              onClick={startNewChat}
              className="flex-1 mr-2 gap-2"
              variant="outline"
            >
              <Plus size={16} /> New Chat
            </Button>
            <button className="md:hidden" onClick={() => setShowSidebar(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {Array.isArray(conversations) &&
              conversations.map((convo) => (
                <div
                  key={convo.id}
                  className={`group flex items-center justify-between rounded-lg mb-1 transition-all ${
                    currentId === convo.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <button
                    onClick={() => loadConversation(convo.id)}
                    className="flex-1 text-left p-3 text-sm flex items-center gap-2 truncate"
                  >
                    <MessageSquare size={14} />
                    <span className="truncate">{convo.title}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(convo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 mr-1"
                    title="Delete chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* MAIN CHAT */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <header className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden"
                onClick={() => setShowSidebar(true)}
              >
                <Menu size={20} />
              </button>
              <h2 className="text-xl font-bold tracking-tight">
                AI Career Guidance
              </h2>
            </div>
            <button onClick={onClose}>
              <X size={24} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-2 rounded-2xl flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce [animation-delay:150ms]">
                    ●
                  </span>
                  <span className="animate-bounce [animation-delay:300ms]">
                    ●
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your career..."
                className="flex-1 border rounded-xl px-4 py-3 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="rounded-xl px-4"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
