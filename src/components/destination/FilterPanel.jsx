import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '@/store/destinationSlice';
import { INTEREST_TYPES, BUDGET_RANGES, CROWD_LEVELS } from '@/utils/constants';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterPanel() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.destinations);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (catId) => {
    const newCats = filters.category.includes(catId)
      ? filters.category.filter((c) => c !== catId)
      : [...filters.category, catId];
    dispatch(setFilters({ category: newCats }));
  };

  const handleClear = () => {
    dispatch(clearFilters());
  };

  const activeFilterCount =
    filters.category.length +
    (filters.budgetRange ? 1 : 0) +
    (filters.season ? 1 : 0) +
    (filters.crowdLevel ? 1 : 0);

  return (
    <div className="bg-surface border border-border rounded-card overflow-hidden">
      {/* Mobile Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-surface-2 hover:bg-surface-2/80 transition-colors"
      >
        <div className="flex items-center gap-2 font-heading font-semibold text-text">
          <Filter size={18} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary text-bg text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Filter Content */}
      <AnimatePresence initial={false}>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Categories */}
              <div>
                <h4 className="text-sm font-semibold text-text mb-3">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleCategoryToggle(type.id)}
                      className={clsx(
                        'px-3 py-1.5 rounded-chip text-sm border transition-all',
                        filters.category.includes(type.id)
                          ? 'bg-primary border-primary text-bg font-medium pl-2'
                          : 'bg-transparent border-border text-muted hover:border-primary/50'
                      )}
                    >
                      {filters.category.includes(type.id) && <span className="mr-1">✓</span>}
                      {type.emoji} {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <h4 className="text-sm font-semibold text-text mb-3">Budget (Per Day)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(BUDGET_RANGES).map(([key, range]) => (
                    <button
                      key={key}
                      onClick={() => dispatch(setFilters({ budgetRange: filters.budgetRange === key ? null : key }))}
                      className={clsx(
                        'px-3 py-2 rounded-button text-sm border flex items-center justify-center gap-2 transition-all',
                        filters.budgetRange === key
                          ? 'bg-accent/20 border-accent text-accent font-medium'
                          : 'bg-transparent border-border text-muted hover:border-accent/50'
                      )}
                    >
                      <span>{range.emoji}</span>
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crowd Level */}
              <div>
                <h4 className="text-sm font-semibold text-text mb-3">Max Crowd Level</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(CROWD_LEVELS).filter(k => k !== 'Extreme').map((level) => (
                    <button
                      key={level}
                      onClick={() => dispatch(setFilters({ crowdLevel: filters.crowdLevel === level ? null : level }))}
                      className={clsx(
                        'px-3 py-1.5 rounded-chip text-sm border transition-all',
                        filters.crowdLevel === level
                          ? 'border-text text-text font-medium bg-surface-2'
                          : 'border-border text-muted bg-transparent hover:border-text/50'
                      )}
                      style={{
                        borderColor: filters.crowdLevel === level ? CROWD_LEVELS[level].color : undefined,
                        color: filters.crowdLevel === level ? CROWD_LEVELS[level].color : undefined,
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClear}
                  className="w-full flex items-center justify-center gap-2 py-2 text-danger hover:bg-danger/10 rounded-button transition-colors text-sm font-medium"
                >
                  <X size={16} />
                  Clear All Filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
