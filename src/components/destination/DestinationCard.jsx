import { Link } from 'react-router-dom';
import { Star, MapPin, Users, IndianRupee } from 'lucide-react';
import { toINR } from '@/utils/formatBudget';
import { CROWD_LEVELS } from '@/utils/constants';
import clsx from 'clsx';
import { memo } from 'react';

const DestinationCard = memo(({ destination }) => {
  const { id, name, state, images, rating, entryFee, crowdLevel, category, tags = [] } = destination;
  const crowdInfo = CROWD_LEVELS[crowdLevel] || CROWD_LEVELS.Medium;

  // Extract numeric price from entryFee string for display (mock logic)
  const priceDisplay = entryFee.includes('Free') ? 'Free' : entryFee.split(' ')[0];

  return (
    <Link to={`/explore/${id}`} className="group block h-full">
      <div className="bg-surface rounded-card overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 h-full flex flex-col">
        
        {/* Image Section */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img
            src={images[0]}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <div
              className="px-2 py-1 rounded-chip text-xs font-semibold backdrop-blur-md text-bg flex items-center gap-1 shadow-sm"
              style={{ backgroundColor: crowdInfo.color }}
            >
              <Users size={12} strokeWidth={3} />
              {crowdInfo.label} Crowd
            </div>
            {tags.includes('festivals') && (
              <div className="px-2 py-1 rounded-chip text-xs font-semibold bg-accent text-bg shadow-sm truncate max-w-[120px]">
                🎉 Festive
              </div>
            )}
          </div>

          <div className="absolute top-3 right-3 px-2 py-1 rounded-chip bg-bg/80 backdrop-blur-md text-text text-xs font-bold flex items-center gap-1 border border-border">
            <Star size={12} className="text-warning fill-warning" />
            {rating.toFixed(1)}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-heading font-semibold text-lg text-text group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
          </div>
          
          <div className="flex items-center gap-1 text-muted text-sm mb-3">
            <MapPin size={14} />
            <span className="truncate">{state}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4 mt-auto">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-chip bg-surface-2 text-xs text-muted border border-border capitalize">
                {tag.replace(' & ', ' ')}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="px-2 py-0.5 rounded-chip bg-surface-2 text-xs text-muted border border-border">
                +{tags.length - 2}
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted">Entry / Activity</span>
              <span className="font-medium text-sm text-text truncate max-w-[120px]">
                {priceDisplay}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

DestinationCard.displayName = 'DestinationCard';
export default DestinationCard;
