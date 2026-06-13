"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import type { LLMMessage } from "@/lib/llm";

type Phase = "contact" | "conversation" | "crisis" | "complete";

interface DisplayMessage {
  role: "assistant" | "user";
  content: string;
}

const OPENER =
  "Hi. Tell me what happened — I'm here to listen, and to help you figure out what comes next.";

export function ConversationalIntake() {
  const [phase, setPhase] = useState<Phase>("contact");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: "assistant", content: OPENER },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, phase]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const updated: DisplayMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    // Slice off the hardcoded opener — API receives only user/assistant turns
    const apiMessages: LLMMessage[] = updated
      .slice(1)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, name, contact }),
      });

      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();

      if (data.action === "crisis_handoff") {
        setPhase("crisis");
        return;
      }
      if (data.action === "complete") {
        setPhase("complete");
        return;
      }

      setMessages([...updated, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "Something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const userTurns = messages.filter((m) => m.role === "user").length;

  if (phase === "contact") {
    return (
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          setPhase("conversation");
        }}
        className="flex flex-col gap-5 max-w-md"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-neutral-700">
            Your name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="First name is fine"
            className="border border-neutral-300 rounded-lg px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact"
            className="text-sm font-medium text-neutral-700"
          >
            Email or phone
          </label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            autoComplete="email"
            placeholder="We'll reach you here once you're matched"
            className="border border-neutral-300 rounded-lg px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-colors"
        >
          Start talking
        </button>
      </form>
    );
  }

  if (phase === "crisis") {
    return (
      <div
        role="alert"
        className="flex flex-col gap-4 max-w-md p-6 bg-amber-50 border border-amber-200 rounded-xl"
      >
        <p className="text-lg leading-relaxed">
          It sounds like you&rsquo;re in a really hard moment right now. Please
          reach out to someone who can help:
        </p>
        <ul className="flex flex-col gap-3">
          <li>
            <strong>988 Suicide &amp; Crisis Lifeline</strong> — call or text{" "}
            <a
              href="tel:988"
              className="underline font-semibold"
            >
              988
            </a>
          </li>
          <li>
            <strong>Crisis Text Line</strong> — text HOME to{" "}
            <strong>741741</strong>
          </li>
        </ul>
        <p className="text-neutral-600 text-sm mt-1">
          We&rsquo;ll be here when you&rsquo;re ready.
        </p>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="flex flex-col gap-4 max-w-md p-6 bg-neutral-50 border border-neutral-200 rounded-xl">
        <p className="text-lg font-medium">Thanks, {name}.</p>
        <p className="leading-relaxed">
          We&rsquo;ve heard you. We&rsquo;ll be in touch within 24 hours to
          connect you with your pod — people who know what you&rsquo;re going
          through because they&rsquo;re going through it too.
        </p>
        <p className="text-neutral-500 text-sm">We&rsquo;ll reach you at {contact}.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" style={{ height: "65vh" }}>
      {/* Progress */}
      <div
        className="flex items-center gap-1.5"
        aria-label={`${userTurns} of 5 questions answered`}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full transition-colors ${
              n <= userTurns ? "bg-neutral-900" : "bg-neutral-200"
            }`}
          />
        ))}
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[78%] px-4 py-3 rounded-2xl text-base leading-relaxed ${
                m.role === "user"
                  ? "bg-neutral-900 text-white rounded-br-sm"
                  : "bg-neutral-100 text-neutral-900 rounded-bl-sm"
              }`}
            >
              {m.content}
            </p>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <p
              aria-live="polite"
              className="bg-neutral-100 text-neutral-400 px-4 py-3 rounded-2xl rounded-bl-sm text-sm tracking-widest"
            >
              &bull;&bull;&bull;
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2 items-end"
      >
        <label htmlFor="message-input" className="sr-only">
          Your message
        </label>
        <textarea
          id="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={2}
          placeholder="Type your reply… (Enter to send)"
          className="flex-1 border border-neutral-300 rounded-xl px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className="bg-neutral-900 text-white px-5 py-3 rounded-xl font-medium hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
