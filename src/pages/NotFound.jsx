import { Link } from 'react-router-dom';
import { Home, Search, Map } from 'lucide-react';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 - Lost | YatrAI';
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-[120px] md:text-[180px] font-heading font-extrabold text-surface-2 leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-4 border border-border shadow-glow">
            <span className="text-4xl">🧭</span>
          </div>
          <h2 className="text-3xl font-heading font-bold text-text">Looks like you're lost.</h2>
        </div>
      </div>
      
      <p className="text-muted text-lg max-w-md mx-auto mb-10">
        The destination you are looking for has either moved to another state, or doesn't exist on our map yet.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          to="/"
          className="w-full sm:w-auto px-6 py-3 bg-primary text-bg rounded-button font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Home size={18} /> Take Me Home
        </Link>
        <Link 
          to="/explore"
          className="w-full sm:w-auto px-6 py-3 bg-surface-2 border border-border text-text rounded-button font-medium flex items-center justify-center gap-2 hover:bg-surface transition-colors"
        >
          <Search size={18} /> Search Map
        </Link>
      </div>
    </div>
  );
}
