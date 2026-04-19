import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, IndianRupee, Sparkles, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { formatToIndian } from '@/utils/formatDate';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { toggleReplanModal } from '@/store/plannerSlice';

const SLOT_COLORS = {
  sightseeing: 'border-primary text-primary',
  food: 'border-warning text-warning',
  adventure: 'border-danger text-danger',
  historical: 'border-secondary text-secondary',
  culture: 'border-accent text-accent',
  spiritual: 'border-success text-success',
};

export default function DayCard({ day, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const dispatch = useDispatch();

  const isRainy = day.weather?.condition?.toLowerCase().includes('rain') || day.weather?.condition?.toLowerCase().includes('storm');

  return (
    <div className="bg-surface border border-border rounded-card overflow-hidden transition-all hover:border-border/80 relative">
      {/* Weather Strip */}
      {isRainy && (
        <div className="absolute top-0 left-0 right-0 bg-secondary/80 text-bg text-xs font-semibold px-4 py-1 flex items-center justify-between z-10 backdrop-blur-sm">
          <span>🌧️ Rain expected. Outdoor plans might be affected.</span>
          <button 
            onClick={(e) => { e.stopPropagation(); dispatch(toggleReplanModal()); }}
            className="underline hover:text-bg/80"
          >
            Ask AI to Replan
          </button>
        </div>
      )}

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={clsx(
          "w-full text-left p-4 flex items-center justify-between transition-colors",
          isRainy ? "pt-8" : "",
          expanded ? "bg-surface-2" : "hover:bg-surface-2"
        )}
      >
        <div>
          <h3 className="font-heading font-semibold text-text text-lg">
            {day.label}
          </h3>
          <p className="text-muted text-sm flex items-center gap-2 mt-1">
            {formatToIndian(day.date)}
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-1">
              {day.weather.icon} {day.weather.temp}°C
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <span className="text-xs text-muted block">Slots</span>
            <span className="text-sm font-medium text-text">{day.slots.length}</span>
          </div>
          {expanded ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {day.slots.map((slot, slotIdx) => (
                <motion.div
                  key={slotIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: slotIdx * 0.1 }}
                  className={clsx(
                    "relative pl-4 border-l-2",
                    SLOT_COLORS[slot.type] || "border-border text-text"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold mb-1 opacity-80">
                        <Clock size={12} />
                        {slot.time} ({slot.duration})
                      </div>
                      <h4 className="font-heading font-semibold text-text text-base flex items-center gap-1.5">
                        <MapPin size={16} className="shrink-0" />
                        {slot.place}
                      </h4>
                      <p className="text-sm text-muted mt-1">{slot.activity}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-surface-2 px-2 py-1 rounded-chip text-xs font-medium self-start shrink-0">
                      <IndianRupee size={12} />
                      {slot.cost > 0 ? slot.cost : 'Free'}
                    </div>
                  </div>

                  {slot.tip && (
                    <div className="mt-3 bg-primary/10 border border-primary/20 rounded-md p-3 flex gap-2 items-start relative">
                      <div className="absolute -left-1.5 -top-1.5 bg-bg rounded-full p-0.5">
                        <Sparkles size={14} className="text-primary" />
                      </div>
                      <span className="text-primary shrink-0 mt-0.5 font-semibold text-xs">AI Tip:</span>
                      <p className="text-xs text-text leading-relaxed">
                        {slot.tip}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
