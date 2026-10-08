import React, { useState, useEffect } from 'react';
import { Shield, LayoutDashboard, Users, Calendar, LogOut, ArrowRight, Activity, Plus, CheckCircle, AlertCircle, ChevronRight, Lock } from 'lucide-react';
import * as api from './api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  if (!token) {
    return <AuthScreen setToken={(t) => {
      localStorage.setItem('token', t);
      setToken(t);
    }} />;
  }

  return <DashboardScreen onLogout={() => {
    localStorage.removeItem('token');
    setToken(null);
  }} />;
}

function AuthScreen({ setToken }: { setToken: (t: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const data = await api.login(email, password);
        setToken(data.access_token);
      } else {
        await api.register(email, password, fullName);
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white text-center tracking-tight mb-2">
          Nexus<span className="text-blue-500">Clubs</span>
        </h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Secure College Ecosystem</p>

        {error && (
          <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm border ${error.includes('successful') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {error.includes('successful') ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Full Name</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="John Doe" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="student@college.edu" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="••••••••" />
          </div>
          <button disabled={loading} type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
            {loading ? <Activity className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-400 hover:text-blue-300 font-medium">
            {isLogin ? 'Register securely' : 'Sign in securely'}
          </button>
        </p>
      </div>
    </div>
  );
}

function DashboardScreen({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clubs, setClubs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [clubsData, eventsData, userData] = await Promise.all([api.fetchClubs(), api.fetchEvents(), api.fetchMe()]);
      setClubs(clubsData);
      setEvents(eventsData);
      setUser(userData);
    } catch (err: any) {
      showToast(err.message, 'error');
      if (err.message.includes('validate credentials')) onLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleJoinClub = async (id: number) => {
    try {
      await api.joinClub(id);
      showToast('Successfully joined the club!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createClub(newClubName, newClubDesc);
      showToast('Successfully created the club!', 'success');
      setShowCreateClub(false);
      setNewClubName('');
      setNewClubDesc('');
      loadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleRegisterEvent = async (id: number) => {
    try {
      await api.registerForEvent(id);
      showToast('Successfully registered for event!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col md:flex-row font-sans selection:bg-blue-500/30">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-10
          ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium">{toast.msg}</p>
        </div>
      )}

      {/* Sidebar */}
      <nav className="bg-slate-900 border-r border-slate-800 w-full md:w-72 p-6 flex flex-col shrink-0 z-10 relative">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">Nexus<span className="text-blue-500">Clubs</span></div>
        </div>

        <div className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Users />} label="Explore Clubs" active={activeTab === 'clubs'} onClick={() => setActiveTab('clubs')} />
          <NavItem icon={<Calendar />} label="Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
        </div>

        <button onClick={onLogout} className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight capitalize mb-2">{activeTab}</h1>
            <p className="text-slate-400">Secure College Club Platform</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/80 p-2 pl-4 rounded-full border border-slate-800 shadow-xl backdrop-blur-md">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3" /> {user?.role || 'STUDENT'}
            </span>
            <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-slate-800">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'ME'}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Activity className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard title="Active Clubs" value={clubs.length.toString()} icon={<Users />} color="blue" />
                  <StatCard title="Upcoming Events" value={events.length.toString()} icon={<Calendar />} color="indigo" />
                  <StatCard title="Security Status" value="Secure" icon={<Shield />} color="emerald" />
                </div>
              </div>
            )}

            {/* Clubs View */}
            {activeTab === 'clubs' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {user?.role === 'ADMIN' && (
                  <div className="flex justify-end">
                    <button onClick={() => setShowCreateClub(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition-colors">
                      <Plus className="w-4 h-4" /> Create New Club
                    </button>
                  </div>
                )}
                
                {showCreateClub && (
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Create a New Club</h3>
                    <form onSubmit={handleCreateClub} className="space-y-4 max-w-md">
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1">Club Name</label>
                        <input type="text" required value={newClubName} onChange={e => setNewClubName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1">Description</label>
                        <textarea required value={newClubDesc} onChange={e => setNewClubDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 font-medium">Create Club</button>
                        <button type="button" onClick={() => setShowCreateClub(false)} className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 font-medium transition-colors">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clubs.length === 0 ? <p className="text-slate-500 col-span-full">No active clubs available.</p> : 
                    clubs.map(club => (
                    <div key={club.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl hover:bg-slate-900 transition-all group hover:border-slate-700 shadow-lg relative overflow-hidden">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-xl text-white font-bold mb-6 group-hover:scale-110 transition-transform">
                        {club.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{club.name}</h3>
                      <p className="text-sm text-slate-400 mb-8 line-clamp-2">{club.description}</p>
                      <button onClick={() => handleJoinClub(club.id)} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600/10 text-blue-400 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" /> Join Club
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events View */}
            {activeTab === 'events' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                {events.length === 0 ? <p className="text-slate-500">No upcoming events.</p> :
                  events.map(event => (
                  <div key={event.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:bg-slate-900 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
                    <div className="flex items-center gap-6">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-w-[80px]">
                        <span className="text-xs font-bold text-blue-500 uppercase">Capacity</span>
                        <span className="text-xl font-extrabold text-white">{event.capacity}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                        <p className="text-sm text-slate-400 mb-2">{event.description || 'Join us for this amazing event.'}</p>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Calendar className="w-3 h-3" /> {new Date(event.start_time).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleRegisterEvent(event.id)} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shrink-0">
                      Register Now <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium 
      ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: 'blue'|'indigo'|'emerald' }) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 blur-2xl opacity-20 ${color === 'blue' ? 'bg-blue-500' : color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-slate-400 font-medium mb-1">{title}</h3>
      <p className="text-3xl font-extrabold text-white">{value}</p>
    </div>
  );
}
