import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Tag, Crest, ClubCard, Ticket, PassCard, Ticker, TabNav, HoldButton, Modal, Table } from '../components/ui';
import * as api from '../api';

interface DashboardScreenProps {
  onLogout: () => void;
}

export function DashboardScreen({ onLogout }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [clubs, setClubs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // Modals
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  
  // Forms
  const [newClubName, setNewClubName] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');
  const [newEvent, setNewEvent] = useState({ clubId: '', title: '', desc: '', date: '', capacity: 100 });
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [clubMembers, setClubMembers] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [clubsData, eventsData, userData] = await Promise.all([api.fetchClubs(), api.fetchEvents(), api.fetchMe()]);
      setClubs(clubsData);
      setEvents(eventsData);
      setUser(userData);
    } catch (err: any) {
      if (err.message.includes('validate credentials')) onLogout();
    }
  };

  useEffect(() => { loadData(); }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Handlers
  const handleJoinClub = async (id: number) => {
    try { await api.joinClub(id); loadData(); } catch (err) { alert(err); }
  };
  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createClub(newClubName, newClubDesc);
      setShowCreateClub(false); setNewClubName(''); setNewClubDesc(''); loadData();
    } catch (err) { alert(err); }
  };
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEvent(parseInt(newEvent.clubId), newEvent.title, newEvent.desc, new Date(newEvent.date).toISOString(), newEvent.capacity);
      setShowCreateEvent(false); setNewEvent({ clubId: '', title: '', desc: '', date: '', capacity: 100 }); loadData();
    } catch (err) { alert(err); }
  };
  const handleDeleteEvent = async (id: number) => {
    try { await api.deleteEvent(id); loadData(); } catch (err) { alert(err); }
  };
  const handleRegisterEvent = async (id: number) => {
    try { await api.registerForEvent(id); loadData(); } catch (err) { alert(err); }
  };
  const handleViewMembers = async (club: any) => {
    try {
      setSelectedClub(club);
      const members = await api.fetchClubMembers(club.id);
      setClubMembers(members);
      setShowMembers(true);
    } catch (err) { alert(err); }
  };
  const handleKickMember = async (userId: number) => {
    try {
      await api.kickClubMember(selectedClub.id, userId);
      const members = await api.fetchClubMembers(selectedClub.id);
      setClubMembers(members);
    } catch (err) { alert(err); }
  };

  const isAdminOrCoord = user?.role === 'ADMIN' || user?.role === 'COORDINATOR';

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
      {user?.role === 'ADMIN' && (
        <div className="h-2 w-full fixed top-0 left-0 z-50" style={{ background: 'repeating-linear-gradient(-45deg, var(--color-staff) 0 10px, var(--color-ink) 10px 20px)' }} />
      )}

      {/* Top Header */}
      <header className={`flex justify-between items-center px-6 pt-8 pb-4 ${user?.role === 'ADMIN' ? 'mt-2' : ''}`}>
        <h1 className="font-display font-black text-3xl tracking-tighter uppercase">NexusClubs</h1>
        <div className="flex gap-4">
          <button onClick={toggleTheme} className="font-mono text-[10px] font-bold uppercase hover:text-[var(--color-signal)]">
            {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
          </button>
          <button onClick={onLogout} className="font-mono text-[10px] font-bold uppercase hover:text-[var(--color-signal)]">
            LOGOUT
          </button>
        </div>
      </header>

      {/* Navigation */}
      <TabNav 
        tabs={[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'clubs', label: 'Clubs' },
          { id: 'events', label: 'Events' }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {/* Ticker */}
      <Ticker items={events.map(e => `${e.title} - ${new Date(e.start_time).toLocaleDateString()}`)} />

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 flex flex-col lg:flex-row gap-12 relative z-0">
        
        {/* Left Column: Pass */}
        <div className="lg:w-80 shrink-0">
          <motion.div
            initial={{ y: -24, rotate: -4, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="sticky top-12"
          >
            <PassCard 
              name={user?.full_name || 'STUDENT'} 
              role={user?.role || 'STUDENT'} 
              clubCount={clubs.length} 
              lastLogin={new Date().toLocaleTimeString()} 
            />
          </motion.div>
        </div>

        {/* Right Column: Content Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              {/* DASHBOARD VIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <h2 className="font-display text-4xl font-black uppercase tracking-tighter">Your Week</h2>
                  <div className="space-y-4">
                    {events.slice(0,3).map(event => (
                      <div key={event.id} className="border-2 border-[var(--color-ink)] p-4 bg-[var(--color-paper)] text-[var(--color-ink)] font-mono text-sm font-bold uppercase flex justify-between items-center shadow-[4px_4px_0_0_var(--color-ink)] hover:-translate-y-1 transition-transform">
                        <span>{event.title}</span>
                        <span>{new Date(event.start_time).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {events.length === 0 && <p className="font-mono text-xs uppercase text-[var(--color-paper-dim)]">NO UPCOMING RSVPS</p>}
                  </div>
                </div>
              )}

              {/* CLUBS VIEW */}
              {activeTab === 'clubs' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="font-display text-4xl font-black uppercase tracking-tighter">Directory</h2>
                    {isAdminOrCoord && (
                      <Button variant="staff" onClick={() => setShowCreateClub(true)}>+ Create Club</Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
                    {clubs.map((club, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={club.id}
                      >
                        <ClubCard name={club.name} description={club.description}>
                          <Button variant="primary" className="w-full" onClick={() => handleJoinClub(club.id)}>JOIN CLUB</Button>
                          {isAdminOrCoord && (
                            <Button variant="ghost" className="w-full mt-2" onClick={() => handleViewMembers(club)}>MANAGE MEMBERS</Button>
                          )}
                        </ClubCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* EVENTS VIEW */}
              {activeTab === 'events' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="font-display text-4xl font-black uppercase tracking-tighter">Schedule</h2>
                    {isAdminOrCoord && (
                      <Button variant="staff" onClick={() => setShowCreateEvent(true)}>+ Create Event</Button>
                    )}
                  </div>
                  
                  <div>
                    {events.map((event, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={event.id}
                      >
                        <Ticket 
                          title={event.title}
                          description={event.description}
                          date={event.start_time}
                          capacity={event.capacity}
                          registeredCount={Math.floor(Math.random() * (event.capacity/2))} // Mocked until API returns count
                          isAdmin={isAdminOrCoord}
                          onRegister={() => handleRegisterEvent(event.id)}
                          onDelete={() => handleDeleteEvent(event.id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <Modal isOpen={showCreateClub} onClose={() => setShowCreateClub(false)} title="New Club Request">
        <form onSubmit={handleCreateClub} className="space-y-6">
          <div>
            <label className="font-mono text-xs font-bold tracking-widest uppercase block mb-2">Club Name</label>
            <input type="text" required value={newClubName} onChange={e => setNewClubName(e.target.value)} className="w-full bg-transparent border-2 border-[var(--color-ink)] px-4 py-3 font-sans focus:outline-none" />
          </div>
          <div>
            <label className="font-mono text-xs font-bold tracking-widest uppercase block mb-2">Description</label>
            <textarea required value={newClubDesc} onChange={e => setNewClubDesc(e.target.value)} className="w-full bg-transparent border-2 border-[var(--color-ink)] px-4 py-3 font-sans focus:outline-none" />
          </div>
          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </Modal>

      <Modal isOpen={showCreateEvent} onClose={() => setShowCreateEvent(false)} title="Issue Ticket (Event)">
        <form onSubmit={handleCreateEvent} className="space-y-6">
          <div>
            <label className="font-mono text-xs font-bold tracking-widest uppercase block mb-2">Club</label>
            <select required value={newEvent.clubId} onChange={e => setNewEvent({...newEvent, clubId: e.target.value})} className="w-full bg-transparent border-2 border-[var(--color-ink)] px-4 py-3 font-sans focus:outline-none">
              <option value="">Select...</option>
              {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs font-bold tracking-widest uppercase block mb-2">Title</label>
            <input type="text" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-transparent border-2 border-[var(--color-ink)] px-4 py-3 font-sans focus:outline-none" />
          </div>
          <div>
            <label className="font-mono text-xs font-bold tracking-widest uppercase block mb-2">Date</label>
            <input type="datetime-local" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-transparent border-2 border-[var(--color-ink)] px-4 py-3 font-sans focus:outline-none" />
          </div>
          <Button type="submit" className="w-full">Create Event</Button>
        </form>
      </Modal>

      <Modal isOpen={showMembers} onClose={() => setShowMembers(false)} title={`Members: ${selectedClub?.name}`}>
        <Table 
          data={clubMembers}
          keyExtractor={(m) => m.id}
          columns={[
            { header: 'NAME', accessor: (m) => m.full_name },
            { header: 'EMAIL', accessor: (m) => m.email },
            { header: 'ACTION', accessor: (m) => <HoldButton onConfirm={() => handleKickMember(m.id)}>KICK</HoldButton> }
          ]}
        />
      </Modal>

    </div>
  );
}
