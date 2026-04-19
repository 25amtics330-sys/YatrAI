import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createTrip } from '@/store/plannerSlice';
import useRecommendations from '@/hooks/useRecommendations';
import PreferenceForm from '@/components/recommendation/PreferenceForm';
import RecommendCard from '@/components/recommendation/RecommendCard';
import Loader from '@/components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, FlipHorizontal } from 'lucide-react';

export default function Recommendations() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { preferences, recommendations, loading, submitPreferences } = useRecommendations();
  const [showForm, setShowForm] = useState(recommendations.length === 0);
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    document.title = 'AI Recommendations | YatrAI';
  }, []);

  const handlePreferencesSubmit = (prefs) => {
    setShowForm(false);
    submitPreferences(prefs);
  };

  const handleSelectRecommendation = (state) => {
    // Convert recommendation to a trip and navigate to planner
    dispatch(createTrip({ 
      title: `${state.name} Trip`,
      state: state.name,
      destinations: state.destinations,
      budget: { total: preferences.budget * preferences.duration, spent: 0 }
    }));
    navigate('/planner');
  };

  if (showForm) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-bg relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-3xl mx-auto mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-chip bg-surface border border-border">
            <Sparkles size={16} className="text-secondary" />
            <span className="text-sm font-medium text-text">AI Trip Architect</span>
          </div>
        </div>

        <PreferenceForm initialPreferences={preferences} onSubmit={handlePreferencesSubmit} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowForm(true)}
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-surface-2 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-text flex items-center gap-2">
              <Sparkles className="text-primary" size={24} /> 
              Your AI Matches
            </h1>
            <p className="text-sm text-muted">Based on your interests and live data</p>
          </div>
        </div>

        <button 
          onClick={() => setCompareMode(!compareMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium border transition-colors ${compareMode ? 'bg-primary border-primary text-bg' : 'bg-surface border-border text-muted hover:text-text'}`}
        >
          <FlipHorizontal size={16} />
          {compareMode ? 'Exit Compare' : 'Compare Options'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader />
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1 }}
              className="mt-6 text-muted font-medium text-center max-w-sm"
            >
              Analyzing real-time weather, crowd density, and local festivals...
            </motion.p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              className={`grid gap-6 ${
                compareMode 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {recommendations.map((rec, i) => (
                <RecommendCard 
                  key={rec.id} 
                  index={i} 
                  recommendation={rec} 
                  onSelect={() => handleSelectRecommendation(rec)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
