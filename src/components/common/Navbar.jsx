import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Map, MessageCircle, User, Menu, X, Sparkles } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import clsx from 'clsx';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/recommendations', label: 'AI Guide', icon: Sparkles, auth: true },
  { to: '/planner', label: 'Planner', icon: Map, auth: true },
  { to: '/dashboard', label: 'Dashboard', icon: Home, auth: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  const filteredLinks = NAV_LINKS.filter((link) => !link.auth || isLoggedIn);

  return (
    <>
      {/* Desktop / Tablet Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-button bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-bg font-heading font-bold text-lg">Y</span>
              </div>
              <span className="font-heading font-bold text-xl text-text group-hover:text-primary transition-colors">
                Yatr<span className="text-primary">AI</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {filteredLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/20 text-primary shadow-glow'
                        : 'text-muted hover:text-text hover:bg-surface'
                    )}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <Link to="/profile" className="flex items-center gap-2 group">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border-2 border-primary/50 group-hover:border-primary transition-colors object-cover"
                  />
                  <span className="text-sm text-muted group-hover:text-text transition-colors">
                    {user?.name?.split(' ')[0]}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm text-muted hover:text-text transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm bg-primary text-bg rounded-button font-medium hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-muted hover:text-text transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 z-40 bg-bg/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col p-6 gap-2">
              {filteredLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-card text-base font-medium transition-all',
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted hover:text-text hover:bg-surface'
                    )}
                  >
                    <Icon size={20} />
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-border mt-4 pt-4">
                {isLoggedIn ? (
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-card text-muted hover:text-text hover:bg-surface"
                  >
                    <User size={20} />
                    Profile
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-center text-muted hover:text-text border border-border rounded-button"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-center bg-primary text-bg rounded-button font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {[
            { to: '/', icon: Home, label: 'Home' },
            { to: '/explore', icon: Compass, label: 'Explore' },
            { to: '/planner', icon: Map, label: 'Plan' },
            { to: '/chat', icon: MessageCircle, label: 'Chat' },
            { to: '/profile', icon: User, label: 'Profile' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={clsx(
                  'flex flex-col items-center gap-1 px-3 py-1 transition-colors',
                  isActive ? 'text-primary' : 'text-muted'
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
