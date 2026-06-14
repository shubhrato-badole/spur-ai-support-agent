import { timeAgo } from './helpers';

export type Conversation = {
  id: string;
  title: string | null;
  updatedAt: string;
};

interface Props {
  conversations: Conversation[];
  sessionId?: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export default function Sidebar({ conversations, sessionId, onSelect, onNewChat }: Props) {
  return (
    <aside className="w-[250px] shrink-0 border-r border-white/[0.06] flex flex-col bg-[#0d0d12]">

    
      <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-white/[0.05]">
        <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M13 2L4 14h7l-2 7 9-11h-7z"/>
          </svg>
        </div>
        <div>
          <p className="text-[14px] font-semibold text-white/90 leading-tight tracking-[-0.01em]">Spur</p>
          <p className="text-[11px] text-white/25 mt-0.5">Support AI</p>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="mx-3 mt-3 mb-1 flex items-center gap-2 px-3 py-2 text-[12.5px] text-white/50 border border-white/[0.09] rounded-[9px] bg-white/[0.03] hover:bg-emerald-900/20 hover:border-emerald-500/30 hover:text-white/85 transition-all font-sans"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New conversation
      </button>

   
      <p className="px-4 pt-3.5 pb-1.5 text-[10px] uppercase tracking-[0.08em] text-white/20">Conversations</p>

      <div className="flex-1 overflow-y-auto px-1.5 space-y-0.5">
        {conversations.length === 0 && (
          <p className="px-3 py-3 text-[12px] text-white/20">No conversations yet</p>
        )}
        {conversations.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all font-sans ${
              c.id === sessionId
                ? 'bg-emerald-900/20 border-emerald-500/20 '
                : 'border-transparent hover:bg-white/[0.04]'
            }`}
          >
            <p className={`text-[12.5px] font-medium truncate ${
              c.id === sessionId ? 'text-white/88' : 'text-white/45'
            }`}>
              {c.title || 'New conversation'}
            </p>
            <p className={`text-[10.5px] mt-0.5 ${
              c.id === sessionId ? 'text-emerald-500/60' : 'text-white/20'
            }`}>
              {timeAgo(c.updatedAt)}
            </p>
          </button>
        ))}
      </div>


      

    </aside>
  );
}