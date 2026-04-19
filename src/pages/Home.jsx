import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Map, Calendar, ArrowRight, Star } from 'lucide-react';
import { INDIAN_STATES, MOCK_DESTINATIONS, FESTIVALS_2025 } from '@/utils/constants';

export default function Home() {
  useEffect(() => {
    document.title = 'YatrAI — AI-Powered Indian Travel Planner';
  }, []);

  const trendingDestinations = MOCK_DESTINATIONS.slice(0, 4);
  const upcomingFestivals = FESTIVALS_2025.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Video/Image mock */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80" 
            alt="India travel abstract" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/80 to-bg" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-chip bg-surface/50 border border-border backdrop-blur-md mb-8"
          >
            <Sparkles size={16} className="text-accent" />
            <span className="text-sm font-medium text-text">Smarter Travel in India</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-extrabold text-text leading-tight mb-6"
          >
            Discover India, <br/>
            <span className="gradient-text">Curated by AI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10"
          >
            Say goodbye to endless research. Choose your vibe, connect with local festivals, and get a personalized, crowd-aware itinerary in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/recommendations" className="w-full sm:w-auto px-8 py-4 bg-primary text-bg rounded-button font-bold text-lg flex items-center justify-center gap-2 shadow-glow hover:scale-105 active:scale-95 transition-all">
              Inspire Me <Sparkles size={20} />
            </Link>
            <Link to="/explore" className="w-full sm:w-auto px-8 py-4 bg-surface-2 text-text border border-border rounded-button font-medium text-lg flex items-center justify-center gap-2 hover:bg-surface hover:border-primary/50 transition-all">
              Explore Destinations <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How it Works / 3-Step */}
      <section className="py-24 bg-surface relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4">How YatrAI Works</h2>
            <p className="text-muted max-w-xl mx-auto">Planning a trip in a culturally dense country like India requires intelligent context. We handle the complexity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Draw a line connecting the dots secretly */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 -translate-y-1/2 z-0" />
            
            {[
              { icon: Sparkles, title: "1. Tell AI Your Vibe", desc: "Select 'Temples', 'Beaches', or 'Street Food'. Define your crowd tolerance and budget.", color: "from-primary to-accent" },
              { icon: Map, title: "2. Get Smart Matches", desc: "Our engine maps your interests against 100+ destinations and live weather patterns.", color: "from-secondary to-accent" },
              { icon: Calendar, title: "3. Auto-Plan Itinerary", desc: "Instantly generate a day-by-day plan with distances, costs, and 'AI Tips' built-in.", color: "from-accent to-warning" }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="bg-bg border border-border rounded-card p-6 text-center relative z-10 hover:-translate-y-2 transition-transform duration-300 hover:shadow-glow glass">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${step.color} p-[2px] mb-6`}>
                    <div className="w-full h-full bg-bg rounded-full flex items-center justify-center">
                      <Icon size={24} className="text-text" />
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-text mb-3">{step.title}</h3>
                  <p className="text-muted text-sm">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-2">Trending Now</h2>
            <p className="text-muted">Most planned destinations this month</p>
          </div>
          <Link to="/explore" className="hidden sm:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all shrink-0">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingDestinations.map((dest) => (
            <div key={dest.id} className="relative">
              <Link to={`/explore/${dest.id}`} className="group block rounded-card overflow-hidden">
                <div className="relative h-96">
                  <img src={dest.images[0]} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1 bg-surface/80 backdrop-blur-sm px-2 py-1 rounded-chip text-xs font-bold text-text w-fit mb-2">
                      <Star size={12} className="text-warning fill-warning" />
                      {dest.rating}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-text mb-1 line-clamp-1">{dest.name}</h3>
                    <p className="text-sm text-muted">{dest.state}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Festivals Strip */}
      <section className="py-16 bg-gradient-to-r from-bg via-surface to-bg border-y border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl">🎪</span>
            <h2 className="text-2xl font-heading font-bold text-text">Upcoming Festivals</h2>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
            {upcomingFestivals.map((fest) => (
              <div key={fest.id} className="min-w-[300px] bg-surface-2 p-5 rounded-card border border-border/50 shrink-0 border-l-[3px] border-l-accent">
                <p className="text-accent text-xs font-bold mb-1">{fest.startDate}</p>
                <h4 className="font-heading font-bold text-text text-lg mb-1">{fest.name}</h4>
                <p className="text-sm text-muted mb-3">{fest.state}</p>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="bg-bg px-2 py-1 rounded-chip border border-border">Expected Crowd: <span className="text-danger">{fest.crowdExpected}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
