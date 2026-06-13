"use client";

import { useState } from "react";
import type { LLMMessage } from "@/lib/llm";

type Status = "idle" | "loading" | "crisis" | "complete";

export function ConversationalIntake() {
  const [messages, setMessages] = useState<LLMMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function send() {
    if (!input.trim() || status === "loading") return;

    const next: LLMMessage[] = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setStatus("loading");

    const res = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });
    const data = await res.json();

    if (data.action === "crisis_handoff") {
      setStatus("crisis");
      return;
    }
    if (data.action === "complete") {
      setStatus("complete");
      return;
    }

    setMessages([...next, { role: "assistant", content: data.message }]);
    setStatus("idle");
  }

  if (status === "crisis") {
    return (
      <div>
        <p>
          It sounds like you&rsquo;re in a really hard moment. Please reach out to
          someone who can help right now:
        </p>
        <ul>
          <li>
            988 Suicide &amp; Crisis Lifeline: call or text <strong>988</strong>
          </li>
          <li>
            Crisis Text Line: text HOME to <strong>741741</strong>
          </li>
        </ul>
        <p>We&rsquo;ll be here when you&rsquo;re ready.</p>
      </div>
    );
  }

  if (status === "complete") {
    return (
      <p>
        Thanks for sharing that. We&rsquo;ll be in touch within 24 hours to connect
        you with your pod.
      </p>
    );
  }

  return (
    <div>
      <div>
        {messages.length === 0 && (
          <p>
            Hi. Tell me what happened — I&rsquo;m here to listen and help figure
            out what comes next.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} data-role={m.role}>
            {m.content}
          </div>
        ))}
        {status === "loading" && <div aria-live="polite">...</div>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status === "loading"}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button type="submit" disabled={status === "loading"}>
          Send
        </button>
      </form>
    </div>
  );
}
