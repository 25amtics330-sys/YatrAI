import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { toggleChat } from '@/store/chatbotSlice';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { MessageCircle } from 'lucide-react';
import ChatWindow from '@/components/chatbot/ChatWindow';

// Lazy loading could be added here, using static for now per requirements
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Explore from '@/pages/Explore';
import DestinationDetail from '@/pages/DestinationDetail';
import Recommendations from '@/pages/Recommendations';
import Planner from '@/pages/Planner';
import Chatbot from '@/pages/Chatbot';
import Profile from '@/pages/Profile';
import AdminAnalytics from '@/pages/AdminAnalytics';
import NotFound from '@/pages/NotFound';

import { supabase } from '@/lib/supabase';

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Live Analytics Tracking
  useEffect(() => {
    const trackView = async () => {
      try {
        const { data: current } = await supabase.from('analytics').select('*').limit(1).single();
        if (current) {
          const today = new Date().toISOString().split('T')[0];
          const daily = current.daily_views || {};
          daily[today] = (daily[today] || 0) + 1;
          
          const sessions = current.active_sessions || {};
          const sessId = user?.email || 'guest-' + Math.random().toString(36).substring(7);
          sessions[sessId] = Date.now();

          await supabase.from('analytics').update({
            total_views: (current.total_views || 0) + 1,
            daily_views: daily,
            active_sessions: sessions
          }).eq('id', current.id);
        }
      } catch (e) {
        console.warn('Analytics sync delayed');
      }
    };

    trackView();
    // Re-track every 2 minutes to keep session alive
    const interval = setInterval(trackView, 120000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-bg text-text selection:bg-primary selection:text-bg">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/explore/:id" element={<DestinationDetail />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
              <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
              <Route path="/planner/:tripId" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
              <Route path="/chat" element={<Chatbot />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />

          {/* Global UI Overlays */}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              },
              success: { iconTheme: { primary: 'var(--color-success)', secondary: '#fff' } },
              error: { iconTheme: { primary: 'var(--color-danger)', secondary: '#fff' } },
            }}
          />

          {/* Global Floating Chatbot (Desktop only, mobile has dedicated route/bottom nav) */}
          <button
            onClick={() => dispatch(toggleChat())}
            className="hidden md:flex fixed bottom-6 right-6 z-[60] w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full shadow-glow items-center justify-center text-bg hover:scale-110 active:scale-95 transition-transform"
            aria-label="Open AI Assistant"
          >
            <MessageCircle size={28} />
          </button>
          
          <div className="hidden md:block">
            <ChatWindow />
          </div>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
