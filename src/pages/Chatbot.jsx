import { useEffect } from 'react';
import ChatWindow from '@/components/chatbot/ChatWindow';
import { useDispatch, useSelector } from 'react-redux';
import { openChat } from '@/store/chatbotSlice';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen } = useSelector((state) => state.chatbot);

  useEffect(() => {
    document.title = 'YatrAI Assistant';
    dispatch(openChat());
    
    // Auto-redirect if accessed directly on desktop to avoid weird empty page
    if (window.innerWidth >= 768) {
       navigate('/dashboard', { replace: true });
    }
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-bg relative md:hidden">
      {/* Mobile only page - on desktop it's an overlay */}
      <div className="pt-20 px-6">
        <h1 className="text-2xl font-bold font-heading mb-2">How can I help?</h1>
        <p className="text-muted">Your AI assistant is ready.</p>
      </div>
      
      {/* Forces ChatWindow to render as full screen on mobile */}
      {isOpen && <ChatWindow />}
    </div>
  );
}
