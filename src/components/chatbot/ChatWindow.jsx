import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeChat, sendChatMessage } from '@/store/chatbotSlice';
import ChatBubble from './ChatBubble';
import { X, Send, Mic, Languages, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWindow() {
  const dispatch = useDispatch();
  const { messages, isTyping, quickReplies, isOpen } = useSelector((state) => state.chatbot);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    dispatch(sendChatMessage(input));
    setInput('');
  };

  const handleQuickReply = (text) => {
    dispatch(sendChatMessage(text));
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    
    // Mocking speech recognition logic for stability across browsers
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInput("What's the best time to visit Kerala?");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-0 right-0 md:bottom-20 md:right-6 w-full md:w-[380px] h-full md:h-[600px] z-[60] bg-bg border-l border-t md:border-r md:border-border md:rounded-card shadow-glow overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-surface border-b border-border p-4 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <span className="text-bg font-heading font-bold">Y</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-surface rounded-full" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-text">YatrAI Guide</h3>
            <p className="text-xs text-secondary font-medium">Online • Ready to plan</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-muted hover:text-text hover:bg-surface-2 rounded-full transition-colors">
            <Languages size={18} />
          </button>
          <button 
            onClick={() => dispatch(closeChat())}
            className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col no-scrollbar">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
          <div className="self-start flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-secondary text-bg flex items-center justify-center shrink-0">
               <Sparkles size={16} />
            </div>
            <div className="bg-surface-2 border border-border px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies (show only if last message is AI and not typing) */}
      {!isTyping && messages[messages.length - 1]?.sender === 'ai' && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {quickReplies.map((qr) => (
            <button
              key={qr.id}
              onClick={() => handleQuickReply(qr.text)}
              className="whitespace-nowrap px-3 py-1.5 rounded-chip border border-primary/30 text-primary hover:bg-primary/10 text-xs font-medium transition-colors"
            >
              {qr.text}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-border">
        <form onSubmit={handleSend} className="flex gap-2">
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-3 rounded-button shrink-0 transition-colors ${
              isListening ? 'bg-danger/20 text-danger animate-pulse' : 'bg-surface-2 text-primary hover:bg-primary/10'
            }`}
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about trains, hotels, or tips..."
            className="flex-1 bg-surface-2 border border-border rounded-button px-4 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-primary text-bg rounded-button shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-glow"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
