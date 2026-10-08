import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, TabNav } from '../components/ui';
import * as api from '../api';

interface AuthScreenProps {
  setToken: (t: string) => void;
}

export function AuthScreen({ setToken }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState('login');
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
      if (activeTab === 'login') {
        const data = await api.login(email, password);
        setToken(data.access_token);
      } else {
        await api.register(email, password, fullName);
        setActiveTab('login');
        setError('Registration successful! Please log in.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--color-ink)] font-sans">
      
      {/* Left side: branding */}
      <div className="flex-1 p-12 flex flex-col justify-center relative overflow-hidden bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="relative z-10 max-w-xl mx-auto md:mx-0">
          <h1 className="font-display text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Show up.<br/>Belong.
          </h1>
          <p className="font-mono text-sm tracking-widest font-bold uppercase text-[var(--color-paper-dim)]">
            NexusClubs // Campus Pass Ecosystem
          </p>
        </div>
        
        {/* Decorative Ticket */}
        <motion.div 
          className="absolute -bottom-20 -right-10 w-96 h-48 bg-[var(--color-paper)] border-4 border-[var(--color-paper-dim)] opacity-20 pointer-events-none"
          initial={{ rotate: -10, y: 100 }}
          animate={{ rotate: -15, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="absolute left-8 top-0 bottom-0 w-4 border-l-4 border-dashed border-[var(--color-paper-dim)]" />
          <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-[var(--color-ink)]" />
          <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-full bg-[var(--color-ink)]" />
        </motion.div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--color-paper-dim)]">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[12px_12px_0_0_var(--color-ink)] flex flex-col"
        >
          <TabNav 
            tabs={[{ id: 'login', label: 'Login' }, { id: 'register', label: 'Register' }]}
            activeTab={activeTab}
            onChange={(id) => { setActiveTab(id); setError(''); }}
            className="border-b-2 border-[var(--color-ink)] pt-0 px-0 [&>button]:flex-1 [&>button]:border-t-0 [&>button]:border-x-0 [&>button]:border-r-2 [&>button]:rounded-none [&>button]:pb-3"
          />
          
          <div className="p-8 text-[var(--color-ink)]">
            {error && (
              <div className={`p-4 border-2 mb-6 font-mono text-xs font-bold uppercase ${error.includes('successful') ? 'bg-[var(--color-stamp)] border-[var(--color-ink)]' : 'bg-[var(--color-void)] text-[var(--color-paper)] border-[var(--color-ink)]'}`}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'register' && (
                <div>
                  <label className="font-mono text-xs font-bold tracking-widest uppercase block mb-2">Full Name</label>
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full bg-transparent border-2 border-[var(--color-ink)] px-4 py-3 font-sans focus:outline-none focus:bg-[var(--color-ink)] focus:text-[var(--color-paper)] transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="font-mono text-xs font-bold tracking-widest uppercase block mb-2">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent border-2 border-[var(--color-ink)] px-4 py-3 font-sans focus:outline-none focus:bg-[var(--color-ink)] focus:text-[var(--color-paper)] transition-colors"
                />
              </div>
              <div>
                <label className="font-mono text-xs font-bold tracking-widest uppercase block mb-2">Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent border-2 border-[var(--color-ink)] px-4 py-3 font-sans focus:outline-none focus:bg-[var(--color-ink)] focus:text-[var(--color-paper)] transition-colors"
                />
              </div>
              
              <Button type="submit" isLoading={loading} className="w-full mt-4">
                {activeTab === 'login' ? 'Authenticate' : 'Create Pass'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
