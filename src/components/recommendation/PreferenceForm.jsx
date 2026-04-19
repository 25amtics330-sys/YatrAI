import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INTEREST_TYPES, BUDGET_RANGES } from '@/utils/constants';
import clsx from 'clsx';
import { ChevronRight, ChevronLeft, CalendarIcon, Users, Sparkles } from 'lucide-react';
import DatePicker from 'react-datepicker';

export default function PreferenceForm({ initialPreferences, onSubmit }) {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState({
    interests: initialPreferences?.interests || [],
    budget: initialPreferences?.budget || 5000,
    groupType: initialPreferences?.groupType || 'couple',
    duration: initialPreferences?.duration || 5,
    startDate: initialPreferences?.startDate ? new Date(initialPreferences.startDate) : null,
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const toggleInterest = (id) => {
    setPrefs((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...prefs,
      startDate: prefs.startDate ? prefs.startDate.toISOString() : null,
    });
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Progress Bar */}
      <div className="mb-8 relative flex justify-between">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-surface-2 -z-10 -translate-y-1/2 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500" 
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors delay-100',
              step >= num ? 'bg-primary text-bg box-shadow-glow' : 'bg-surface-2 text-muted'
            )}
          >
            {num}
          </div>
        ))}
      </div>

      <div className="glass rounded-card p-6 md:p-8 min-h-[400px] flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* STEP 1: Interests */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1"
            >
              <h2 className="font-heading text-2xl font-bold text-text mb-2">What brings you joy?</h2>
              <p className="text-muted mb-6 text-sm">Select exactly the experiences you crave on a holiday.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {INTEREST_TYPES.map((type) => {
                  const isSelected = prefs.interests.includes(type.id);
                  return (
                    <div
                      key={type.id}
                      onClick={() => toggleInterest(type.id)}
                      className={clsx(
                        'cursor-pointer p-4 rounded-card border-2 transition-all duration-300 text-center select-none',
                        isSelected 
                          ? 'border-primary bg-primary/10 shadow-glow' 
                          : 'border-border bg-surface hover:border-primary/50'
                      )}
                    >
                      <div className="text-3xl mb-2">{type.emoji}</div>
                      <div className="font-medium text-sm text-text">{type.label}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Basics */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 space-y-8"
            >
              <div>
                <h2 className="font-heading text-2xl font-bold text-text mb-2">Who are you traveling with?</h2>
                <div className="flex flex-wrap gap-3 mt-4">
                  {['solo', 'couple', 'family', 'friends'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setPrefs({ ...prefs, groupType: g })}
                      className={clsx(
                        'px-5 py-3 rounded-button border font-medium capitalize flex items-center gap-2 transition-colors',
                        prefs.groupType === g
                          ? 'border-primary bg-primary text-bg'
                          : 'border-border bg-surface text-muted hover:border-primary/50'
                      )}
                    >
                      <Users size={18} />
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-text mb-4">Duration & Budget</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-surface rounded-card border border-border">
                    <label className="text-sm text-muted block mb-2">Days: {prefs.duration}</label>
                    <input
                      type="range"
                      min="2"
                      max="21"
                      value={prefs.duration}
                      onChange={(e) => setPrefs({ ...prefs, duration: parseInt(e.target.value) })}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted mt-1">
                      <span>2</span>
                      <span>21</span>
                    </div>
                  </div>

                  <div className="p-4 bg-surface rounded-card border border-border">
                    <label className="text-sm text-muted block mb-2">Budget per day: ₹{prefs.budget}</label>
                    <input
                      type="range"
                      min="1500"
                      max="20000"
                      step="500"
                      value={prefs.budget}
                      onChange={(e) => setPrefs({ ...prefs, budget: parseInt(e.target.value) })}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted mt-1">
                      <span>Budget</span>
                      <span>Luxury</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Dates */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center text-center pt-8"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent mb-6 mx-auto">
                <CalendarIcon size={32} />
              </div>
              <h2 className="font-heading text-2xl font-bold text-text mb-2">When are you going?</h2>
              <p className="text-muted mb-8 text-sm max-w-md mx-auto">
                We'll match your dates with local festivals and ideal weather patterns. Leave blank for "flexible".
              </p>

              <div className="relative z-20">
                <DatePicker
                  selected={prefs.startDate}
                  onChange={(date) => setPrefs({ ...prefs, startDate: date })}
                  minDate={new Date()}
                  placeholderText="Select start date"
                  className="w-64 px-4 py-3 bg-surface border border-border rounded-button text-text outline-none text-center font-medium cursor-pointer"
                  dateFormat="dd MMM yyyy"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="flex items-center gap-1 font-medium text-muted hover:text-text transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && prefs.interests.length === 0}
              className="px-6 py-2 bg-primary text-bg rounded-button font-medium flex items-center gap-1 shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              Next Step
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-gradient-to-r from-primary to-accent text-bg rounded-button font-bold flex items-center gap-2 shadow-glow transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles size={18} />
              Find Destinations
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
