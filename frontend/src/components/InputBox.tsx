import { useRef } from "react";

interface Props {
  input: string;
  isLoading: boolean;
  onChange: (val: string) => void;
  onSend: () => void;
  centered?: boolean;
}

export default function InputBox({
  input,
  isLoading,
  onChange,
  onSend,
  centered,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  function handleInput() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  return (
    <div
      className={`shrink-0 pb-3 pt-2 ${centered ? "" : "border-t border-white/[0.05]"}`}
    >
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="flex gap-0 items-center bg-white/[0.05] border border-white/[0.10] rounded-2xl overflow-hidden focus-within:border-emerald-500/50 transition-colors shadow-lg">
          <textarea
            ref={ref}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            disabled={isLoading}
            placeholder={
              isLoading
                ? "Agent is responding…"
                : "Ask anything about your order…"
            }
            rows={1}
            maxLength={2000}
            className="flex-1 resize-none px-4 py-3.5 text-[14px] text-white/80 bg-transparent border-none outline-none placeholder:text-white/25 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 mr-2 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 hover:bg-emerald-500 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <p className="text-[11px] text-white/20 text-center mt-2.5">
          Spur AI may make mistakes. For urgent help{" "}
          <a
            href="#"
            className="text-white/35 hover:text-white/55 transition-colors underline underline-offset-2"
          >
            contact a human agent
          </a>
          .
        </p>
      </div>
    </div>
  );
}
