import React, { useState } from 'react';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';

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
