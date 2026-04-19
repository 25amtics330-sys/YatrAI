import { MapPin, Sparkles, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { CROWD_LEVELS } from '@/utils/constants';

export default function RecommendCard({ recommendation, index, onSelect }) {
  const { name, heroImage, matchPercent, whyRecommended, bestSeason, crowdLevel, festivals } = recommendation;
  const crowdInfo = CROWD_LEVELS[crowdLevel] || CROWD_LEVELS.Medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-surface border border-border hover:border-primary/50 relative rounded-card overflow-hidden group cursor-pointer"
      onClick={onSelect}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent z-10 pointer-events-none" />
      
      {/* Background Image Parallax effect on hover */}
      <div className="h-64 sm:h-72 overflow-hidden">
        <img
          src={heroImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
      </div>

      {/* Match Badge */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
         {festivals.length > 0 && (
          <div className="bg-accent/90 backdrop-blur-sm px-3 py-1.5 rounded-chip text-bg font-bold text-xs flex items-center gap-1 shadow-glow-accent">
            <Calendar size={14} />
            {festivals[0].name}
          </div>
        )}
        <div className="bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-chip text-bg font-bold text-sm flex items-center gap-1 shadow-glow">
          <Sparkles size={14} className="animate-pulse" />
          {matchPercent}% Match
        </div>
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={16} className="text-secondary" />
          <span className="text-sm font-medium text-secondary">{bestSeason}</span>
        </div>
        
        <h3 className="font-heading text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
          {name}
        </h3>

        <p className="text-sm text-muted line-clamp-2 mb-4 group-hover:text-text/90 transition-colors">
          {whyRecommended}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: crowdInfo.color }} />
            <span className="text-xs font-medium text-text">{crowdInfo.label} Crowd</span>
          </div>
          
          <button className="text-sm font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Plan Trip
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
