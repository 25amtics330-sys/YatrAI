import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleReplanModal, replanTrip, dismissAlert } from '@/store/plannerSlice';
import ItineraryTimeline from '@/components/planner/ItineraryTimeline';
import BudgetTracker from '@/components/planner/BudgetTracker';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Printer, Map as MapIcon, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatDateRange } from '@/utils/formatDate';

export default function Planner() {
  const { tripId } = useParams();
  const dispatch = useDispatch();
  const { currentTrip: trip, days, alerts, showReplanModal, replanStatus } = useSelector((state) => state.planner);

  useEffect(() => {
    document.title = trip ? `${trip.title} | Planner` : 'Trip Planner | YatrAI';
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-text mb-4">No Trip Selected</h2>
        <Link to="/explore" className="text-primary hover:underline">Start planning a new trip</Link>
      </div>
    );
  }

  const handleReplan = () => {
    // Pass the first active alert to replan if available
    const activeAlert = alerts[0] || { type: 'general' };
    dispatch(replanTrip({ tripId: trip.id, alertData: activeAlert }));
  };

  const closeReplanModal = () => {
    dispatch(toggleReplanModal());
    if (alerts[0]) dispatch(dismissAlert(alerts[0].id));
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Planner Header */}
      <div className="bg-surface border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text">{trip.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted mt-1">
                <span>{trip.state}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button className="px-4 py-2 bg-surface-2 border border-border rounded-button text-sm font-medium hover:bg-surface transition-colors flex items-center gap-2 whitespace-nowrap">
                <MapIcon size={16} /> Map View
              </button>
              <button className="px-4 py-2 bg-surface-2 border border-border rounded-button text-sm font-medium hover:bg-surface transition-colors flex items-center gap-2">
                <Share2 size={16} /> Share
              </button>
              <button className="px-4 py-2 bg-surface-2 border border-border rounded-button text-sm font-medium hover:bg-surface transition-colors flex items-center gap-2">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Itinerary (Takes up 7 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-text">Itinerary</h2>
              <span className="text-sm text-muted">Drag days to reorder</span>
            </div>
            
            <ItineraryTimeline days={days} alerts={alerts} />
          </div>

          {/* Right Column - Budget & Tools (Takes up 5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
            <BudgetTracker />
            
            {/* Smart Suggestions Panel */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-card p-5">
               <h3 className="font-medium text-text mb-2 flex items-center gap-2">
                 <Sparkles size={16} className="text-primary" /> AI Assistant Suggests
               </h3>
               <p className="text-sm text-muted mb-4">
                 You have ₹3,500 remaining in your budget. Consider adding a sunset boat ride in Udaipur on Day 3!
               </p>
               <button className="w-full py-2 bg-primary/20 text-primary rounded-button text-sm font-medium hover:bg-primary/30 transition-colors">
                 Add Boat Ride (₹800)
               </button>
            </div>
            </div>
          </div>

        </div>
      </div>

      {/* Replan Modal Overlay */}
      <AnimatePresence>
        {showReplanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface border border-border rounded-card p-6 max-w-md w-full shadow-glow relative overflow-hidden"
            >
              <button 
                onClick={closeReplanModal}
                className="absolute top-4 right-4 p-2 text-muted hover:text-text rounded-full hover:bg-surface-2 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-4">
                <Sparkles size={24} />
              </div>

              <h2 className="font-heading text-xl font-bold text-text mb-2">
                Smart Itinerary Replan
              </h2>

              {replanStatus === 'idle' && (
                <>
                  <p className="text-muted text-sm mb-6">
                    Our AI has detected a weather alert for your trip. We can automatically rearrange your outdoor activities to indoor alternatives or shift them to clearer days.
                  </p>
                  <button 
                    onClick={handleReplan}
                    className="w-full py-3 bg-secondary text-bg font-bold rounded-button flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors"
                  >
                    Adjust My Plan
                  </button>
                </>
              )}

              {replanStatus === 'loading' && (
                <div className="py-8 flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-text font-medium">Re-calculating routes...</p>
                  <p className="text-xs text-muted mt-2">Checking indoor venues & transport</p>
                </div>
              )}

              {replanStatus === 'success' && (
                <div className="py-4">
                  <div className="flex items-center gap-2 text-success font-bold mb-4">
                    <CheckCircle2 size={24} />
                    Plan Updated Successfully!
                  </div>
                  <p className="text-sm text-muted mb-6">
                    We moved your forts tour to Day 2 and replaced Day 3 with a museum and culinary trail.
                  </p>
                  <button 
                    onClick={closeReplanModal}
                    className="w-full py-3 bg-surface-2 text-text font-medium rounded-button hover:bg-surface transition-colors"
                  >
                    Review Changes
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
