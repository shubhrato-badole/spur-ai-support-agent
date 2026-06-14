import { useEffect, useRef } from 'react';
import { formatTime, SUGGESTIONS } from './helpers';
import type { Message } from '../App';

interface Props {
  messages: Message[];
  isLoading: boolean;
  onSuggest: (text: string) => void;
}

const BotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L4 14h7l-2 7 9-11h-7z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function MessageList({ messages, isLoading, onSuggest }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 2L4 14h7l-2 7 9-11h-7z"/>
          </svg>
        </div>
        <h2 className="text-[15px] font-semibold text-white/80 mb-1 tracking-[-0.01em]">
          Hey! I'm Spur's support agent.
        </h2>
        <p className="text-[12.5px] text-white/30 mb-7">
          Ask me anything about orders, shipping, or returns.
        </p>
        <div className="flex flex-wrap gap-2 justify-center max-w-sm">
          {SUGGESTIONS.map(q => (
            <button
              key={q}
              onClick={() => onSuggest(q)}
              className="px-3 py-1.5 text-[11.5px] border border-white/[0.09] rounded-full text-white/40 bg-white/[0.03] hover:border-emerald-500/40 hover:text-emerald-400/80 hover:bg-emerald-900/20 transition-all"
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
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex gap-3 max-w-[82%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : ''}`}
        >
          {/* Avatar */}
          <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
            msg.sender === 'user'
              ? 'bg-white/[0.07] border border-white/[0.08] text-white/35'
              : msg.isError
              ? 'bg-red-900/30 border border-red-500/20 text-red-400'
              : 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white'
          }`}>
            {msg.sender === 'ai' ? <BotIcon /> : <UserIcon />}
          </div>

          {/* Bubble + time */}
          <div className={`flex flex-col gap-1.5 ${msg.sender === 'user' ? 'items-end' : ''}`}>
            <div className={`px-4 py-2.5 text-[13px] leading-relaxed rounded-2xl ${
              msg.sender === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-sm'
                : msg.isError
                ? 'bg-red-900/20 border border-red-500/20 text-red-300/80 rounded-tl-sm'
                : 'bg-white/[0.06] border border-white/[0.07] text-white/75 rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
            <p className="text-[10px] text-white/20 px-1">{formatTime(msg.createdAt)}</p>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isLoading && (
        <div className="flex gap-3 max-w-[82%]">
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shrink-0 text-white">
            <BotIcon />
          </div>
          <div className="flex items-center gap-1.5 px-4 py-3 bg-white/[0.06] border border-white/[0.07] rounded-2xl rounded-tl-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}