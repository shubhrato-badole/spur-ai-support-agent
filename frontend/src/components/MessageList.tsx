import { useEffect, useRef } from "react";
import { formatTime, SUGGESTIONS } from "../helpers";
import type { Message } from "../App";

interface Props {
  messages: Message[];
  isLoading: boolean;
  onSuggest: (text: string) => void;
}

const BotIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M13 2L4 14h7l-2 7 9-11h-7z" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function MessageList({ messages, isLoading, onSuggest }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M13 2L4 14h7l-2 7 9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-[15px] font-semibold text-gray-900 mb-1 tracking-[-0.01em]">
          Hey! I'm Spur's support agent.
        </h2>
        <p className="text-[12.5px] text-gray-400 mb-7">
          Ask me anything about orders, shipping, or returns.
        </p>
        <div className="flex flex-wrap gap-2 justify-center max-w-sm">
          {SUGGESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onSuggest(q)}
              className="px-3 py-1.5 text-[11.5px] border border-gray-200 rounded-full text-gray-500 bg-white hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 max-w-[82%] ${msg.sender === "user" ? "self-end flex-row-reverse" : ""}`}
        >
          <div
            className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              msg.sender === "user"
                ? "bg-gray-100 border border-gray-200 text-gray-500"
                : msg.isError
                  ? "bg-red-100 border border-red-200 text-red-500"
                  : "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white"
            }`}
          >
            {msg.sender === "ai" ? <BotIcon /> : <UserIcon />}
          </div>

          <div
            className={`flex flex-col gap-1.5 ${msg.sender === "user" ? "items-end" : ""}`}
          >
            <div
              className={`px-4 py-2.5 text-[13.5px] leading-relaxed rounded-2xl ${
                msg.sender === "user"
                  ? "bg-emerald-600 text-white rounded-tr-sm"
                  : msg.isError
                    ? "bg-red-50 border border-red-200 text-red-700 rounded-tl-sm"
                    : "bg-gray-100 border border-gray-200 text-gray-800 rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
            <p className="text-[10px] text-gray-400 px-1">
              {formatTime(msg.createdAt)}
            </p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3 max-w-[82%]">
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0 text-white">
            <BotIcon />
          </div>
          <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl rounded-tl-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
