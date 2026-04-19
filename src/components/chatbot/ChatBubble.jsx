import { formatChatTime } from '@/utils/formatDate';
import clsx from 'clsx';
import { Bot, User } from 'lucide-react';

export default function ChatBubble({ message }) {
  const isAi = message.sender === 'ai';

  return (
    <div className={clsx("flex gap-3 mb-4 max-w-[85%]", isAi ? "self-start" : "self-end flex-row-reverse")}>
      
      {/* Avatar */}
      <div className={clsx(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto",
        isAi ? "bg-secondary text-bg" : "bg-primary text-bg"
      )}>
        {isAi ? <Bot size={16} /> : <User size={16} />}
      </div>

      {/* Bubble */}
      <div className="flex flex-col gap-1">
        <div className={clsx(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
          isAi 
            ? "bg-surface-2 text-text border border-border rounded-bl-sm" 
            : "bg-primary text-bg rounded-br-sm"
        )}>
          {message.text}
        </div>
        
        {/* Timestamp */}
        <span className={clsx(
          "text-[10px] text-muted font-medium",
          isAi ? "text-left ml-1" : "text-right mr-1"
        )}>
          {formatChatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
