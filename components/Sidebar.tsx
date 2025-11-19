
import React from 'react';
import type { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  companyName: string;
}

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  icon: React.ReactElement;
  label: string;
}> = ({ page, currentPage, setCurrentPage, icon, label }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`w-full flex items-center p-4 mb-2 rounded-2xl transition-all duration-200 group ${
        isActive
          ? 'bg-primary text-white shadow-lg scale-105'
          : 'text-gray-500 hover:bg-purple-50 hover:text-primary'
      }`}
    >
      <div className={`p-1 transition-transform duration-300 ${isActive ? 'rotate-0' : 'group-hover:rotate-12'}`}>
        {icon}
      </div>
      <span className="ml-3 font-bold tracking-wide">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, companyName }) => {
  return (
    <div className="w-72 bg-white m-4 rounded-3xl shadow-card border border-purple-100 flex-col hidden md:flex overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-primary to-secondary mb-4">
        <h1 className="text-xl font-black text-white tracking-tighter uppercase drop-shadow-md truncate">{companyName}</h1>
        <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-xs font-bold ml-2">ONLINE - V1.0</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 overflow-y-auto">
        <div className="text-xs font-bold text-gray-400 uppercase px-4 mb-2 mt-2">Menu Principal</div>
        <NavItem
          page="dashboard"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>}
          label="Base"
        />
        <NavItem
          page="team"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          label="Guilda"
        />
        <NavItem
          page="financials"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01m0-8c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          label="Tesouro"
        />
        <NavItem
          page="roadmap"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13V7m0 13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2m0 13a2 2 0 002 2h5a2 2 0 002-2V5a2 2 0 00-2-2h-5a2 2 0 00-2 2m0 0v13"></path></svg>}
          label="Quests"
        />
        
        <div className="text-xs font-bold text-gray-400 uppercase px-4 mb-2 mt-6">Social</div>
        <NavItem
          page="okrs"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
          label="Conquistas"
        />
        <NavItem
          page="chat"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>}
          label="Taverna"
        />
        
        <div className="text-xs font-bold text-gray-400 uppercase px-4 mb-2 mt-6">Sistema</div>
        <NavItem
          page="settings"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
          label="Configurações"
        />
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">XP da Guilda</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
