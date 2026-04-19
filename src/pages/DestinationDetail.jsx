import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinationById } from '@/store/destinationSlice';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, Info, Calendar, Hotel, Utensils, Navigation, ArrowLeft, Heart, Share2, Sparkles } from 'lucide-react';
import { CROWD_LEVELS } from '@/utils/constants';

export default function DestinationDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: dest, loading } = useSelector((state) => state.destinations);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchDestinationById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (dest) document.title = `${dest.name} | YatrAI`;
  }, [dest]);

  if (loading || !dest) {
    return <div className="min-h-screen flex items-center justify-center">Loading destination...</div>;
  }

  const crowdInfo = CROWD_LEVELS[dest.crowdLevel] || CROWD_LEVELS.Medium;

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Hero Parallax */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${dest.images[0]})`, backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        
        {/* Top Nav */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-10">
          <Link to="/explore" className="w-10 h-10 rounded-full bg-surface/50 backdrop-blur-md flex items-center justify-center text-text hover:bg-surface transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-surface/50 backdrop-blur-md flex items-center justify-center text-text hover:bg-surface hover:text-danger transition-colors">
              <Heart size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-surface/50 backdrop-blur-md flex items-center justify-center text-text hover:bg-surface hover:text-primary transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Title Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-7xl mx-auto z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-chip text-sm font-bold backdrop-blur-md uppercase tracking-wider">
                  {dest.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-text/80 backdrop-blur-md bg-surface/30 px-2 py-1 rounded-chip">
                  <MapPin size={14} /> {dest.state}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-text drop-shadow-lg">
                {dest.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-4 bg-surface/80 backdrop-blur-md p-3 rounded-card border border-border shrink-0">
               <div>
                  <span className="text-xs text-muted block mb-0.5">Rating</span>
                  <div className="flex items-center gap-1 font-bold">
                    <Star className="text-warning fill-warning" size={16} />
                    {dest.rating} <span className="text-xs text-muted font-normal">({dest.reviews} reviews)</span>
                  </div>
               </div>
               <div className="w-px h-8 bg-border" />
               <div>
                  <span className="text-xs text-muted block mb-0.5">Live Crowd</span>
                  <div className="flex items-center gap-1 font-bold" style={{ color: crowdInfo.color }}>
                    <Users size={16} />
                    {crowdInfo.label}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left, 2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-2 border-b border-border no-scrollbar">
            {['overview', 'hotels', 'food', 'tips'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-heading font-bold text-text mb-3">About</h3>
                  <p className="text-muted leading-relaxed">
                    Experience the magic of {dest.name}, a crown jewel of {dest.state}. Known for its breathtaking {dest.category} elements, this destination represents the rich diversity of India. 
                    Whether you're looking for peaceful serenity or vibrant cultural immersion, {dest.name} delivers an unforgettable experience.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface rounded-card border border-border">
                    <span className="text-xs text-muted block mb-1">Entry Fee / Cost</span>
                    <span className="font-semibold text-text">{dest.entryFee}</span>
                  </div>
                  <div className="p-4 bg-surface rounded-card border border-border">
                    <span className="text-xs text-muted block mb-1">Current Weather</span>
                    <span className="font-semibold text-text flex items-center gap-1">
                      {dest.weatherNow.icon} {dest.weatherNow.temp}°C, {dest.weatherNow.condition}
                    </span>
                  </div>
                </div>

                {dest.images.length > 1 && (
                  <div>
                    <h3 className="text-xl font-heading font-bold text-text mb-3">Gallery</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {dest.images.slice(1).map((img, i) => (
                        <img key={i} src={img} alt="" className="w-full h-48 object-cover rounded-card border border-border" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'hotels' && (
              <div className="space-y-4">
                <h3 className="text-xl font-heading font-bold text-text mb-4">Recommended Stays</h3>
                {dest.nearbyHotels.map((hotel, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-card border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Hotel size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text">{hotel.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-warning mt-0.5">
                          <Star size={12} className="fill-warning" /> {hotel.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-text">₹{hotel.price}</span>
                      <span className="text-xs text-muted block">/ night</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'food' && (
              <div className="space-y-4">
                <h3 className="text-xl font-heading font-bold text-text mb-4">Local Cuisine</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dest.localFood.map((food, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-surface rounded-card border border-border">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-xl">🍛</div>
                      <span className="font-medium text-text">{food}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-4">
                <h3 className="text-xl font-heading font-bold text-text mb-4">AI Travel Tips</h3>
                <div className="space-y-3">
                  {dest.travelTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-card">
                      <Info size={20} className="text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-text leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Context & CTA Column (Right, 1 col) */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="sticky top-24 space-y-6">
            {/* CTA Card */}
            <div className="p-6 bg-surface border border-border rounded-card shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
               <h3 className="text-lg font-heading font-bold text-text mb-2">Ready to explore?</h3>
               <p className="text-sm text-muted mb-6">Add {dest.name} to your itinerary and let AI handle the scheduling.</p>
               
               <Link to="/planner" className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-bg font-bold rounded-button hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-glow">
                 <Calendar size={18} />
                 Add to Planner
               </Link>
            </div>

            {/* Smart Context */}
            <div className="p-5 bg-surface-2 rounded-card border border-border">
              <h4 className="font-semibold text-text mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-secondary" />
                Live Context
              </h4>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted">Crowd Advisory</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: crowdInfo.color }}>{crowdInfo.label} Volume</span>
                    <div className="w-24 h-1.5 bg-bg rounded-full overflow-hidden">
                      <div className="h-full" style={{ width: `${crowdInfo.percent}%`, backgroundColor: crowdInfo.color }} />
                    </div>
                  </div>
                  {dest.crowdLevel === 'High' && (
                    <p className="text-xs text-muted mt-2 leading-tight">Consider visiting early morning to avoid peak tourist groups.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
