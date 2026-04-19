import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { LogOut, Settings, Camera, MapPin, Calendar, Heart, Shield, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'My Profile | YatrAI';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Profile Card */}
      <div className="bg-surface border border-border rounded-card p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
        
        {/* Avatar */}
        <div className="relative group shrink-0">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-lg group-hover:border-primary/50 transition-colors"
          />
          <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary text-bg flex items-center justify-center hover:scale-110 shadow-glow transition-transform">
            <Camera size={14} />
          </button>
        </div>

        {/* Info */}
        <div className="text-center md:text-left flex-1">
          <h1 className="font-heading text-3xl font-bold text-text mb-1">{user.name}</h1>
          <p className="text-muted flex items-center justify-center md:justify-start gap-2 mb-4">
            {user.email} <span className="w-1 h-1 rounded-full bg-border" /> {user.language === 'hi' ? 'Hindi' : 'English'}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
            {user.preferences?.map(pref => (
              <span key={pref} className="px-3 py-1 bg-surface-2 border border-border rounded-chip text-xs text-text capitalize">
                {pref}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
             <button className="px-5 py-2 bg-surface-2 border border-border text-text rounded-button text-sm font-medium hover:bg-surface transition-colors flex items-center gap-2">
               <Settings size={16} /> Edit Profile
             </button>
             <button 
                onClick={handleLogout}
                className="px-5 py-2 text-danger border border-danger/30 hover:bg-danger/10 rounded-button text-sm font-medium transition-colors flex items-center gap-2"
              >
               <LogOut size={16} /> Logout
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Past Trips Timeline */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-heading text-xl font-bold text-text flex items-center gap-2">
            <Calendar className="text-primary" size={20} /> Past Adventures
          </h2>
          <div className="bg-surface border border-border rounded-card p-6">
              <div className="relative border-l-2 border-border/50 ml-3 space-y-8">
                {user.pastTrips?.map((trip, i) => (
                  <div key={trip.id} className="relative pl-6">
                     <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-primary" />
                     <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">{trip.date}</span>
                        <span className="text-xs text-muted">({trip.duration} days)</span>
                     </div>
                     <h3 className="text-lg font-bold text-text mb-2">{trip.title}</h3>
                     <div className="flex items-center gap-1 text-sm text-warning font-medium bg-warning/10 w-fit px-2 py-0.5 rounded-chip">
                        Star Rating: {trip.rating}
                     </div>
                  </div>
                )) || <div className="pl-6 text-muted italic">No past trips recorded yet.</div>}
              </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="font-heading font-semibold text-text mb-4 flex items-center gap-2">
               <Heart className="text-danger" size={18} /> Saved Places
            </h3>
            <div className="space-y-3">
              {['Jaipur', 'Varanasi', 'Rishikesh'].map(place => (
                <div key={place} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <MapPin size={16} className="text-muted" />
                     <span className="text-sm font-medium">{place}</span>
                  </div>
                  <Link to="/explore" className="text-xs text-primary hover:underline">View</Link>
                </div>
              ))}
            </div>
            <Link to="/explore" className="block text-center mt-4 text-sm text-muted hover:text-text w-full py-2 border border-border rounded-button">
              Browse More
            </Link>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-card p-5 flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center mb-3">
               <Award className="text-accent" size={24} />
             </div>
             <h4 className="font-bold text-text mb-1">Explorer Badge</h4>
             <p className="text-xs text-muted">You've planned 3 trips with YatrAI. Next badge at 5 trips!</p>
          </div>
        </div>

      </div>
    </div>
  );
}
