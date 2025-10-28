"use client";

import type { Message } from "@/lib/types";

interface ConversationThreadProps {
  messages: Message[];
}

export function ConversationThread({ messages }: ConversationThreadProps) {
  return (
    <div
      className="flex-1 space-y-4 overflow-y-auto pr-1 pt-4 text-sm text-slate-600 scrollbar-thin"
      role="log"
      aria-live="polite"
    >
      {messages.map((message) => (
        <article
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          } text-sm`}
          aria-label={`${message.sender === "user" ? "User" : "Design Agent"} message`}
        >
          <div
            className={`max-w-[75%] rounded-2xl border px-4 py-3 shadow-sm transition ${
              message.sender === "user"
                ? "border-primary/30 bg-primary/10 text-slate-800"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <p className="font-medium">
              {message.sender === "user" ? "You" : "Design Agent"}
              <span className="ml-2 text-xs font-normal text-slate-500">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit"
                })}
              </span>
            </p>
            <p className="mt-2 whitespace-pre-line leading-relaxed">{message.content}</p>
          </div>
        </article>
      ))}

      {messages.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-6 text-center text-slate-500">
          Start a conversation to guide the AI. Reference prior assets, request refinements, or
          explore new directions.
        </p>
      )}
    </div>
  );
}
