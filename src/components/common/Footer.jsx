import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Github, Twitter, Instagram, Heart } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const FOOTER_LINKS = [
  {
    title: 'Explore',
    links: [
      { label: 'Destinations', to: '/explore' },
      { label: 'AI Recommendations', to: '/recommendations' },
      { label: 'Trip Planner', to: '/planner' },
      { label: 'Festival Calendar', to: '/explore' },
    ],
  },
  {
    title: 'Popular States',
    links: [
      { label: 'Rajasthan', to: '/explore' },
      { label: 'Kerala', to: '/explore' },
      { label: 'Goa', to: '/explore' },
      { label: 'Himachal Pradesh', to: '/explore' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/' },
      { label: 'Safety Tips', to: '/' },
      { label: 'Contact Us', to: '/' },
      { label: 'About YatrAI', to: '/' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Github, href: '#', label: 'Github' },
];

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-button bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-bg font-heading font-bold text-lg">Y</span>
              </div>
              <span className="font-heading font-bold text-xl text-text">
                Yatr<span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Your AI-powered companion for exploring incredible India. 
              Discover destinations, plan trips, and experience festivals like never before.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Sections */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="font-heading font-semibold text-text mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted flex items-center gap-1">
            Made with <Heart size={12} className="text-danger fill-danger" /> in India
            <span className="mx-1">•</span>
            © {new Date().getFullYear()} YatrAI
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            {(user?.role === 'admin' || user?.email?.toLowerCase().includes('admin')) && (
              <Link to="/admin/analytics" className="hover:text-primary transition-colors font-bold text-primary">Admin Portal</Link>
            )}
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
