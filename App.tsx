import React, { useState, useMemo } from 'react';
import Login from './views/Login';
import Register from './views/Register';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Team from './views/Team';
import Financials from './views/Financials';
import Roadmap from './views/Roadmap';
import OKRs from './views/OKRs';
import Chat from './views/Chat';
import { useStartupData } from './hooks/useStartupData';
import type { Page } from './types';

type AuthState = 'LOGGED_OUT' | 'REGISTERING' | 'LOGGED_IN';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('LOGGED_OUT');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const startupData = useStartupData();

  const handleLogin = (email: string) => {
    const user = startupData.team.find(u => u.email === email);
    if(user) {
        startupData.setCurrentUser(user);
        setAuthState('LOGGED_IN');
        setCurrentPage('dashboard');
    } else {
        alert("Usuário não encontrado!");
    }
  };
  
  const handleRegister = (user: Omit<import('./types').TeamMember, 'id' | 'avatar' | 'roleType'>) => {
      startupData.registerUser(user);
      setAuthState('LOGGED_IN');
      setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    startupData.setCurrentUser(null!);
    setAuthState('LOGGED_OUT');
  };

  const CurrentView = useMemo(() => {
    // startupData.currentUser can be null for a brief moment.
    if (!startupData.currentUser) return <Dashboard data={startupData} />;

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard data={startupData} />;
      case 'team':
        return <Team data={startupData} />;
      case 'financials':
        return <Financials data={startupData} />;
      case 'roadmap':
        return <Roadmap data={startupData} />;
      case 'okrs':
        return <OKRs data={startupData} />;
      case 'chat':
        return <Chat data={startupData} />;
      default:
        return <Dashboard data={startupData} />;
    }
  }, [currentPage, startupData]);

  if (authState === 'LOGGED_OUT') {
    return <Login onLogin={handleLogin} onNavigateRegister={() => setAuthState('REGISTERING')} />;
  }
  
  if (authState === 'REGISTERING') {
      return <Register onRegister={handleRegister} onNavigateLogin={() => setAuthState('LOGGED_OUT')} />
  }

  return (
    <div className="flex h-screen bg-light text-dark">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={startupData.currentUser} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light p-4 sm:p-6 lg:p-8">
          {CurrentView}
        </main>
      </div>
    </div>
  );
};

export default App;