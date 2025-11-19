
import { useState } from 'react';
import type { StartupData, UseStartupDataReturn, TeamMember, Transaction, ChatMessage, CompanySettings } from '../types';

const initialData: Omit<StartupData, 'currentUser'> = {
  settings: {
    name: 'StartupOS Tycoon',
    mission: 'Gamificar o gerenciamento de startups.',
    vision: 'Tornar o trabalho divertido e produtivo.',
    currency: 'R$',
    primaryColor: '#8B5CF6'
  },
  team: [
    { id: 1, name: 'Alice Johnson', role: 'CEO & Founder', roleType: 'ceo', avatar: 'https://i.pravatar.cc/150?u=alice', email: 'alice@startupos.dev', xp: 1200, level: 5, badges: ['👑', '🚀'] },
    { id: 2, name: 'Beto Williams', role: 'CTO & Co-Founder', roleType: 'developer', avatar: 'https://i.pravatar.cc/150?u=bob', email: 'beto@startupos.dev', xp: 850, level: 3, badges: ['💻', '🐛'] },
    { id: 3, name: 'Carlos Brown', role: 'Lead Designer', roleType: 'developer', avatar: 'https://i.pravatar.cc/150?u=charlie', email: 'carlos@startupos.dev', xp: 600, level: 2, badges: ['🎨'] },
    { id: 4, name: 'Diana Miller', role: 'Marketing Lead', roleType: 'marketing', avatar: 'https://i.pravatar.cc/150?u=diana', email: 'diana@startupos.dev', xp: 950, level: 4, badges: ['📢', '📈'] },
  ],
  financials: [
    { id: 1, type: 'revenue', description: 'Investimento Semente', amount: 500000, date: '2023-01-15' },
    { id: 2, type: 'expense', description: 'QG da Guilda (Aluguel)', amount: 15000, date: '2023-01-20' },
    { id: 3, type: 'expense', description: 'Servidores (Mana)', amount: 2500, date: '2023-01-31' },
    { id: 4, type: 'revenue', description: 'Loot do 1º Cliente', amount: 25000, date: '2023-02-10' },
    { id: 5, type: 'expense', description: 'Ouro da Equipe (Salários)', amount: 45000, date: '2023-02-28' },
  ],
  roadmap: {
    todo: [
      { id: 'task-1', content: 'Sistema de Login Mágico', xpReward: 50 },
      { id: 'task-2', content: 'Arte da Landing Page', xpReward: 30 },
    ],
    inProgress: [
      { id: 'task-3', content: 'Codar Dashboard Épico', xpReward: 100 },
    ],
    done: [
      { id: 'task-4', content: 'Configurar o Reino (Setup)', xpReward: 20 },
      { id: 'task-5', content: 'Escrever Pergaminhos (Docs)', xpReward: 40 },
    ],
  },
  okrs: [
    {
      id: 1,
      title: 'Dominação Mundial (Market Fit)',
      keyResults: [
        { id: 1, description: 'NPS nível Lendário (40+)', progress: 35 },
        { id: 2, description: 'Conquistar 10 Clientes Pagantes', progress: 80 },
        { id: 3, description: 'Reduzir Churn (Game Over) < 5%', progress: 20 },
      ],
    },
    {
      id: 2,
      title: 'Montar a Party Ideal (Equipe)',
      keyResults: [
        { id: 1, description: 'Recrutar 2 Magos (Devs)', progress: 50 },
        { id: 2, description: 'Quests de Performance Trimestrais', progress: 100 },
      ],
    },
  ],
  chatMessages: [
      { id: 1, senderId: 1, receiverId: 2, text: 'Beto, como está a mana para o deploy?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { id: 2, senderId: 2, receiverId: 1, text: 'Mana cheia! Soltando a magia até sexta.', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
      { id: 3, senderId: 1, receiverId: 2, text: 'GG!', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  ]
};

export const useStartupData = (): UseStartupDataReturn => {
  const [data, setData] = useState<Omit<StartupData, 'currentUser'>>(initialData);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);

  const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 50)) + 1;

  const awardXP = (userId: number, amount: number) => {
      setData(prev => {
          const updatedTeam = prev.team.map(member => {
              if (member.id === userId) {
                  const newXP = member.xp + amount;
                  const newLevel = calculateLevel(newXP);
                  // You could trigger a level up notification here
                  return { ...member, xp: newXP, level: newLevel };
              }
              return member;
          });
          
          // Update current user if it's them
          if (currentUser && currentUser.id === userId) {
             const me = updatedTeam.find(m => m.id === userId);
             if(me) setCurrentUser(me);
          }

          return { ...prev, team: updatedTeam };
      });
  };

  const registerUser = (user: Omit<TeamMember, 'id' | 'avatar' | 'roleType' | 'xp' | 'level' | 'badges'>) => {
      const newUser: TeamMember = {
          ...user,
          id: Date.now(),
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
          roleType: 'developer',
          xp: 0,
          level: 1,
          badges: ['🌱']
      };
      setData(prev => ({
          ...prev,
          team: [...prev.team, newUser]
      }));
      setCurrentUser(newUser);
  };

  const addTeamMember = (member: Omit<TeamMember, 'id' | 'avatar' | 'xp' | 'level' | 'badges'>) => {
    setData(prev => ({
      ...prev,
      team: [
        ...prev.team,
        { 
          ...member, 
          id: Date.now(), 
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
          xp: 0,
          level: 1,
          badges: ['🌱']
        }
      ]
    }));
  };

  const updateTeamMember = (updatedMember: TeamMember) => {
    setData(prev => ({
      ...prev,
      team: prev.team.map(member => member.id === updatedMember.id ? updatedMember : member)
    }));
  };

  const removeTeamMember = (memberId: number) => {
    setData(prev => ({
      ...prev,
      team: prev.team.filter(member => member.id !== memberId)
    }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setData(prev => ({
      ...prev,
      financials: [
        ...prev.financials,
        { ...transaction, id: Date.now() }
      ]
    }));
  };

  const updateRoadmap = (newRoadmap: StartupData['roadmap']) => {
    setData(prev => ({
      ...prev,
      roadmap: newRoadmap
    }));
  };

  const updateOkrProgress = (okrId: number, krId: number, progress: number) => {
    setData(prev => ({
      ...prev,
      okrs: prev.okrs.map(okr =>
        okr.id === okrId
          ? {
              ...okr,
              keyResults: okr.keyResults.map(kr =>
                kr.id === krId ? { ...kr, progress } : kr
              ),
            }
          : okr
      ),
    }));
  };

  const sendMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      setData(prev => ({
          ...prev,
          chatMessages: [
              ...prev.chatMessages,
              {
                  ...message,
                  id: Date.now(),
                  timestamp: new Date().toISOString()
              }
          ]
      }));
  };

  const updateSettings = (settings: CompanySettings) => {
      setData(prev => ({ ...prev, settings }));
  };

  return {
    ...data,
    currentUser: currentUser!, 
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    addTransaction,
    updateRoadmap,
    updateOkrProgress,
    sendMessage,
    registerUser,
    setCurrentUser: (user: TeamMember) => setCurrentUser(user),
    updateSettings,
    awardXP
  };
};
