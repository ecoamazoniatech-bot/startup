
import React, { useState, useRef, useEffect } from 'react';
import type { TeamMember } from '../types';

interface HeaderProps {
  user: TeamMember;
  onLogout: () => void;
  companyName: string;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, companyName }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    <header className="bg-transparent p-6 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-black text-dark tracking-tight">Olá, {user.name.split(' ')[0]}! 👋</h2>
        <p className="text-medium font-medium">{companyName} &bull; Nível {user.level}</p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all hover:text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center bg-white rounded-full pl-1 pr-4 py-1 shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="relative">
                 <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-primary" />
                 <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white">
                     {user.level}
                 </div>
            </div>
            <span className="hidden md:block font-bold text-dark ml-3">{user.name}</span>
            <svg className={`w-4 h-4 ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase">Status do Jogador</p>
                  <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-semibold">XP Atual</span>
                      <span className="text-sm font-bold text-primary">{user.xp} XP</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(user.xp % 100)}%` }}></div>
                  </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-bold flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Sair do Jogo
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
