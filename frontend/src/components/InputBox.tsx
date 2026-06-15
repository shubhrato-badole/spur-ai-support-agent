import { useRef } from "react";

interface Props {
  input: string;
  isLoading: boolean;
  onChange: (val: string) => void;
  onSend: () => void;
}

export default function InputBox({
  input,
  isLoading,
  onChange,
  onSend,
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
    <div className="shrink-0 pb-4 pt-2 border-t border-gray-100">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="flex gap-0 items-center bg-white border border-gray-200 rounded-2xl overflow-hidden focus-within:border-emerald-400 focus-within:shadow-sm transition-all shadow-sm">
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
            className="flex-1 resize-none px-4 py-3.5 text-[14px] text-gray-800 bg-transparent border-none outline-none placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
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
        <p className="text-[11px] text-gray-400 text-center mt-2.5">
          Spur AI may make mistakes. For urgent help{" "}
          <a
            href="#"
            className="text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-2"
          >
            contact a human agent
          </a>
          .
        </p>
      </div>
    </div>
  );
}
