import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from '@/store/plannerSlice';
import { updateCrowdLevel } from '@/store/destinationSlice';
import { motion } from 'framer-motion';
import { Cloud, MapPin, Users, Calendar, AlertTriangle, ArrowRight, Activity, Bell, Sparkles } from 'lucide-react';
import MapView from '@/components/map/MapView';
import { MOCK_DESTINATIONS, CROWD_LEVELS } from '@/utils/constants';

export default function Dashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { alerts, currentTrip } = useSelector((state) => state.planner);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = 'Dashboard | YatrAI';
    setMounted(true);

    // Simulate Real-time Data
    const weatherInterval = setInterval(() => {
      // 10% chance every 10s to trigger a weather alert if there isn't one
      if (Math.random() > 0.9 && alerts.length === 0) {
        dispatch(addAlert({
          title: 'Weather Alert for Udaipur',
          message: 'Heavy rain expected on Day 3. Would you like AI to replan your outdoor activities?',
          type: 'weather'
        }));
      }
    }, 10000);

    const crowdInterval = setInterval(() => {
      // Update a random destination's crowd level
      const randomDestId = MOCK_DESTINATIONS[Math.floor(Math.random() * MOCK_DESTINATIONS.length)].id;
      const levels = Object.keys(CROWD_LEVELS);
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      dispatch(updateCrowdLevel({ id: randomDestId, crowdLevel: randomLevel }));
    }, 15000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(crowdInterval);
    };
  }, [dispatch, alerts.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-3xl font-bold text-text mb-2">
          Namaste, {user?.name?.split(' ')[0]}! 🙏
        </h1>
        {currentTrip ? (
          <p className="text-muted text-lg">
            Your trip to <strong className="text-text">{currentTrip.title}</strong> starts in <span className="text-primary font-bold">14 days</span>.
          </p>
        ) : (
          <p className="text-muted text-lg">You have no upcoming trips. Let's plan a new adventure!</p>
        )}
      </motion.div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8"
        >
          {alerts.map(alert => (
            <div key={alert.id} className="bg-danger/10 border border-danger/30 p-4 rounded-card flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 shake">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-danger/20 rounded-full text-danger shrink-0">
                  {alert.type === 'weather' ? <Cloud size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-danger">{alert.title}</h4>
                  <p className="text-xs text-danger/80 mt-1">{alert.message}</p>
                </div>
              </div>
              <Link to="/planner" className="shrink-0 px-4 py-2 bg-danger text-bg rounded-button text-sm font-medium hover:bg-danger/90 transition-colors whitespace-nowrap">
                Review Plan
              </Link>
            </div>
          ))}
        </motion.div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Map Widget (takes 2 cols on lg) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-surface border border-border rounded-card p-4 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold flex items-center gap-2">
              <MapPin className="text-primary" size={18} />
              Live Destination Pulses
            </h3>
            <span className="flex items-center gap-1 text-xs text-success font-medium">
              <Activity size={12} className="animate-pulse" /> Live
            </span>
          </div>
          <div className="flex-1 rounded-card overflow-hidden">
            {mounted && <MapView height="300px" embedded />}
          </div>
        </motion.div>

        {/* Live Status Cards */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface border border-border rounded-card p-5"
          >
            <h3 className="text-sm font-medium text-muted mb-4 flex items-center gap-2">
              <Users size={16} /> Live Crowd Meter (Goa)
            </h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-heading font-bold text-warning">High</span>
              <span className="text-sm text-muted mb-1">82% capacity</span>
            </div>
            <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
              <div className="h-full bg-warning w-[82%] crowd-bar" />
            </div>
            <p className="text-xs text-muted mt-3">Baga beach is heavily crowded. Consider South Goa.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-card p-5"
          >
            <h3 className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
              <Calendar size={16} /> Upcoming Major Festival
            </h3>
            <div className="text-2xl font-heading font-bold text-text mb-1">Pushkar Mela</div>
            <p className="text-sm text-text/80 mb-4">Rajasthan • Starts in 45 days</p>
            <Link to="/explore/d1" className="text-sm font-medium text-bg bg-primary px-4 py-2 rounded-button inline-flex items-center gap-1 hover:bg-primary/90 transition-colors">
              Plan Trip <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="font-heading font-semibold text-lg mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Sparkles, label: 'Get Ideas', to: '/recommendations', color: 'text-accent' },
          { icon: MapPin, label: 'Explore Map', to: '/explore', color: 'text-primary' },
          { icon: Bell, label: 'Saved Places', to: '/profile', color: 'text-secondary' },
          { icon: Calendar, label: 'My Trips', to: '/profile', color: 'text-text' },
        ].map((action, i) => (
          <Link 
            key={i} 
            to={action.to}
            className="bg-surface hover:bg-surface-2 border border-border p-4 rounded-card flex flex-col items-center justify-center gap-3 transition-colors group"
          >
            <action.icon size={24} className={`${action.color} group-hover:scale-110 transition-transform`} />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
