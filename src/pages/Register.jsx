import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Globe, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    language: 'en'
  });
  const { register, loading, error, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign Up | YatrAI';
    if (isLoggedIn) navigate('/dashboard', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      await register(formData).unwrap();
      toast.success('Account created successfully!');
      navigate('/recommendations');
    } catch (err) {
      toast.error(err || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-surface">
        <div className="absolute inset-0 z-0">
          {/* A completely different vibe for register - Kerala backwaters */}
          <img 
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1080&q=80" 
            alt="Kerala Backwaters" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 w-fit bg-surface/50 backdrop-blur-md px-4 py-2 rounded-button">
            <span className="font-heading font-bold text-xl text-text">
              Yatr<span className="text-secondary">AI</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-heading font-bold text-text mb-4">
              Join a community of modern explorers.
            </h2>
            <div className="flex items-center gap-3 mt-6">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-bg" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-bg" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-bg bg-secondary flex items-center justify-center text-xs font-bold text-bg">10k+</div>
              </div>
              <p className="text-sm font-medium text-text">Travelers planning right now.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-bg relative">
        <div className="absolute top-6 right-6">
         <p className="text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="max-w-md w-full space-y-8 mt-10">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text mb-2">Create Account</h1>
            <p className="text-muted">Set up your profile to save trips and get personalized recommendations.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-surface border border-border rounded-input py-3 pl-10 pr-4 text-text placeholder:text-muted focus:outline-none focus:border-secondary transition-colors"
                  placeholder="Arjun Sharma"
                />
                <User className="absolute left-3 top-3.5 text-muted" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-surface border border-border rounded-input py-3 pl-10 pr-4 text-text placeholder:text-muted focus:outline-none focus:border-secondary transition-colors"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-3.5 text-muted" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-surface border border-border rounded-input py-3 pl-10 pr-4 text-text placeholder:text-muted focus:outline-none focus:border-secondary transition-colors"
                  placeholder="At least 8 characters"
                />
                <Lock className="absolute left-3 top-3.5 text-muted" size={18} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Preferred Language</label>
              <div className="relative">
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="w-full bg-surface border border-border rounded-input py-3 pl-10 pr-4 text-text appearance-none focus:outline-none focus:border-secondary transition-colors"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                </select>
                <Globe className="absolute left-3 top-3.5 text-muted" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-secondary text-bg rounded-button font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-70 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign Up <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted">
            By signing up, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
