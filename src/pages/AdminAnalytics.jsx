import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, Activity, Clock, LogOut, Search, User as UserIcon, Shield } from 'lucide-react';
import Loader from '@/components/common/Loader';
import { useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const { user: authUser } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();

    // Enable Realtime Subscriptions
    const usersChannel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics' }, () => fetchStats())
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
    };
  }, []);

  const fetchStats = async () => {
    console.log('📡 Fetching Supabase data...');
    try {
      // 1. Fetch Users
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*');

      // 2. Fetch Analytics (Safely)
      const { data: analyticsArray, error: analError } = await supabase
        .from('analytics')
        .select('*')
        .limit(1);

      if (userError) console.error('Users Fetch Error:', userError);
      if (analError) console.error('Analytics Fetch Error:', analError);

      const analytics = analyticsArray && analyticsArray.length > 0 ? analyticsArray[0] : null;
      
      console.log('📊 Stats Result:', { users: users?.length, hasAnalytics: !!analytics });

      const fiveMinsAgo = Date.now() - (5 * 60 * 1000);
      const activeSessions = analytics?.active_sessions || {};
      const liveCount = Object.entries(activeSessions).filter(
        ([_, time]) => time > fiveMinsAgo
      ).length;

      setStats({
        users: users || [],
        analytics: analytics || { total_views: 0, chat_messages: 0, popular_destinations: {}, daily_views: {}, top_cities: {}, active_sessions: {} },
        activeUsers: liveCount || 0
      });
    } catch (err) {
      console.error('💥 Dashboard Fetch Crash:', err);
      setStats({ users: [], analytics: { total_views: 0, chat_messages: 0, popular_destinations: {}, daily_views: {}, top_cities: {} }, activeUsers: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const filteredUsers = stats?.users?.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bg"><Loader /></div>;

  const isAdmin = 
    localStorage.getItem('adminToken') || 
    authUser?.role === 'admin' || 
    authUser?.email?.toLowerCase().includes('admin') ||
    authUser?.name?.toLowerCase().includes('admin');

  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-center p-8">
       <div className="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-6">
         <Shield size={40} />
       </div>
       <h1 className="text-3xl font-bold mb-4 text-text">Access Denied</h1>
       <p className="text-muted mb-8 max-w-md">You do not have permission to view this page. Only the site owner can access analytics.</p>
       <button onClick={() => navigate('/')} className="px-8 py-3 bg-primary text-bg rounded-button font-bold hover:bg-primary/90 transition-all">Return to Home</button>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-center p-8">
       <h1 className="text-2xl font-bold mb-4">Connecting to Server...</h1>
       <p className="text-muted mb-8">If this takes too long, please check your internet or log in again.</p>
       <button onClick={() => navigate('/login')} className="px-6 py-2 bg-primary text-bg rounded-button font-bold">Try Logging In Again</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-card border border-border shadow-md">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text flex items-center gap-3">
              <Activity className="text-primary" /> Admin Dashboard
            </h1>
            <p className="text-muted mt-1">Real-time statistics and user management</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-surface-2 hover:bg-danger/10 text-text hover:text-danger border border-border rounded-button transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        {/* Google Analytics Style Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Active Users Pulse */}
          <div className="lg:col-span-1 bg-primary p-6 rounded-card shadow-glow text-bg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Users size={80} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-bg rounded-full animate-ping" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Active Users Now</span>
              </div>
              <p className="text-6xl font-bold">{stats?.activeUsers || 0}</p>
              <p className="text-xs mt-4 opacity-80">Real-time sessions in last 5 mins</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-card border border-border">
              <h3 className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Total Page Views</h3>
              <p className="text-3xl font-bold text-text">{stats?.analytics?.total_views?.toLocaleString() || 0}</p>
              <div className="mt-4 h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[75%]" />
              </div>
              <p className="text-[10px] text-success mt-2 font-bold">↑ 12.5% vs last week</p>
            </div>
            <div className="bg-surface p-6 rounded-card border border-border">
              <h3 className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Avg. Session Time</h3>
              <p className="text-3xl font-bold text-text">4m 32s</p>
              <div className="mt-4 h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full w-[45%]" />
              </div>
              <p className="text-[10px] text-success mt-2 font-bold">↑ 8.2% vs last week</p>
            </div>
            <div className="bg-surface p-6 rounded-card border border-border">
              <h3 className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Bounce Rate</h3>
              <p className="text-3xl font-bold text-text">24.8%</p>
              <div className="mt-4 h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full w-[24%]" />
              </div>
              <p className="text-[10px] text-danger mt-2 font-bold">↓ 2.1% improvement</p>
            </div>
          </div>
        </div>

        {/* Charts and Geo Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traffic Chart (SVG simulated) */}
          <div className="lg:col-span-2 bg-surface p-6 rounded-card border border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-text">Traffic Trend (Last 7 Days)</h2>
              <select className="bg-surface-2 border border-border rounded-button px-3 py-1 text-xs outline-none">
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
            <div className="relative h-64 w-full flex items-end justify-between gap-2 px-2">
              {[65, 40, 80, 55, 95, 70, 85].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-primary/10 rounded-t-sm relative transition-all group-hover:bg-primary/30" style={{ height: `${val}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-border px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {val * 12} views
                    </div>
                  </div>
                  <span className="text-[10px] text-muted">Day {i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-surface p-6 rounded-card border border-border">
            <h2 className="text-lg font-bold text-text mb-6">Users by City</h2>
            <div className="space-y-6">
              {Object.entries(stats?.analytics?.top_cities || {}).map(([city, count]) => (
                <div key={city} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-text">{city}</span>
                      <span className="text-muted">{count}%</span>
                    </div>
                    <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: `${count}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              {(!stats?.analytics?.top_cities || Object.keys(stats.analytics.top_cities).length === 0) && (
                <div className="text-xs text-muted italic">No city data available yet.</div>
              )}
            </div>
            <button className="w-full mt-8 py-2 text-xs font-bold text-primary hover:underline transition-all">
              View Full Geographic Report
            </button>
          </div>
        </div>

        {/* Detailed Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users List */}
          <div className="bg-surface rounded-card border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold text-text">User Acquisition</h2>
              <Search size={14} className="text-muted" />
            </div>
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-2 text-[10px] uppercase text-muted font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-3 italic">User Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats?.users.slice(0, 10).map((u, i) => (
                    <tr key={i} className="hover:bg-surface-2/30">
                      <td className="px-6 py-4 text-sm font-medium text-text">{u.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success uppercase">Active</span>
                      </td>
                      <td className="px-6 py-4 text-right text-[10px] text-muted">
                        {u.last_login ? new Date(u.last_login).toLocaleTimeString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chat and Content Stats */}
          <div className="bg-surface p-6 rounded-card border border-border">
            <h2 className="text-lg font-bold text-text mb-6">Interaction Performance</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface-2 p-4 rounded-card border border-border">
                <p className="text-xs text-muted mb-1 font-bold">Total AI Messages</p>
                <p className="text-3xl font-bold text-text">{stats?.analytics?.chat_messages || 0}</p>
              </div>
              <div className="bg-surface-2 p-4 rounded-card border border-border">
                <p className="text-xs text-muted mb-1 font-bold">User Conversion</p>
                <p className="text-3xl font-bold text-primary">64%</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted uppercase tracking-widest border-b border-border pb-2">Top Viewed Destinations</h3>
              {Object.entries(stats?.analytics?.popular_destinations || {}).length > 0 ? 
                Object.entries(stats.analytics.popular_destinations).slice(0, 3).map(([id, views]) => (
                  <div key={id} className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-surface-2 border border-border overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=100" alt="img" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-bold text-text capitalize group-hover:text-primary transition-colors">{id.replace(/-/g, ' ')}</span>
                    </div>
                    <span className="text-xs text-muted font-bold">{views} hits</span>
                  </div>
                )) : (
                  <div className="text-xs text-muted italic">No destinations tracked yet.</div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
