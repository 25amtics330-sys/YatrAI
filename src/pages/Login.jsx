import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useAuth from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleLogin, loading, error, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    document.title = 'Login | YatrAI';
    // Only auto-redirect if NOT an admin, otherwise let handleSubmit handle it
    if (isLoggedIn && user?.role !== 'admin') {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    try {
      const response = await login(email, password).unwrap();
      
      const isLoggingInAsAdmin = email.toLowerCase().trim() === 'admin';
      
      if (isLoggingInAsAdmin || response.user?.role === 'admin') {
        localStorage.setItem('adminToken', response.token);
        toast.success('Admin Analytics Access');
        navigate('/admin/analytics', { replace: true });
      } else {
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err || 'Failed to login');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential).unwrap();
      toast.success('Welcome! Signed in with Google 🎉');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err || 'Google sign-in failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google sign-in was cancelled or failed.');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1080&q=80" 
          alt="Rajasthan" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/20 to-bg pb-10" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-button bg-primary flex items-center justify-center">
              <span className="text-bg font-heading font-bold text-xl">Y</span>
            </div>
            <span className="font-heading font-bold text-2xl text-text">YatrAI</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-heading font-bold text-text mb-4">
              Your intelligent <br/>Indian journey begins here.
            </h2>
            <p className="text-text/80 text-lg">
              "We explore to discover, but we plan to conquer the chaos."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-bg">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-heading font-bold text-text mb-2">Welcome Back</h1>
            <p className="text-muted">Sign in to continue planning your trips.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {error && (
              <div className="p-3 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Email Address or Admin ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-border rounded-input py-3 pl-10 pr-4 text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="name@example.com or admin"
                />
                <Mail className="absolute left-3 top-3.5 text-muted" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text">Password</label>
                <a href="#" className="flex text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-border rounded-input py-3 pl-10 pr-4 text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3.5 text-muted" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-bg rounded-button font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-bg text-muted">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_black"
              shape="rectangular"
              size="large"
              text="signin_with"
              logo_alignment="left"
              width="400"
            />
          </div>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
