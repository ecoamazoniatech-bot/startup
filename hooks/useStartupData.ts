import { useState } from 'react';
import type { StartupData, UseStartupDataReturn, TeamMember, Transaction, ChatMessage } from '../types';

const initialData: Omit<StartupData, 'currentUser'> = {
  team: [
    { id: 1, name: 'Alice Johnson', role: 'CEO & Founder', roleType: 'ceo', avatar: 'https://i.pravatar.cc/150?u=alice', email: 'alice@startupos.dev' },
    { id: 2, name: 'Beto Williams', role: 'CTO & Co-Founder', roleType: 'developer', avatar: 'https://i.pravatar.cc/150?u=bob', email: 'beto@startupos.dev' },
    { id: 3, name: 'Carlos Brown', role: 'Lead Designer', roleType: 'developer', avatar: 'https://i.pravatar.cc/150?u=charlie', email: 'carlos@startupos.dev' },
    { id: 4, name: 'Diana Miller', role: 'Marketing Lead', roleType: 'marketing', avatar: 'https://i.pravatar.cc/150?u=diana', email: 'diana@startupos.dev' },
  ],
  financials: [
    { id: 1, type: 'revenue', description: 'Rodada de Investimento Anjo', amount: 500000, date: '2023-01-15' },
    { id: 2, type: 'expense', description: 'Aluguel do Escritório (Q1)', amount: 15000, date: '2023-01-20' },
    { id: 3, type: 'expense', description: 'Serviços de Nuvem (Jan)', amount: 2500, date: '2023-01-31' },
    { id: 4, type: 'revenue', description: 'Pagamento Primeiro Cliente', amount: 25000, date: '2023-02-10' },
    { id: 5, type: 'expense', description: 'Salários (Fev)', amount: 45000, date: '2023-02-28' },
  ],
  roadmap: {
    todo: [
      { id: 'task-1', content: 'Desenvolver autenticação de usuário' },
      { id: 'task-2', content: 'Design da landing page de marketing' },
    ],
    inProgress: [
      { id: 'task-3', content: 'Implementar funcionalidade principal do dashboard' },
    ],
    done: [
      { id: 'task-4', content: 'Configurar boilerplate do projeto' },
      { id: 'task-5', content: 'Definir guias de estilo da marca' },
    ],
  },
  okrs: [
    {
      id: 1,
      title: 'Alcançar Product-Market Fit',
      keyResults: [
        { id: 1, description: 'Atingir um Net Promoter Score (NPS) de 40', progress: 35 },
        { id: 2, description: 'Conseguir 10 clientes pagantes', progress: 80 },
        { id: 3, description: 'Reduzir churn de usuários para menos de 5%', progress: 20 },
      ],
    },
    {
      id: 2,
      title: 'Construir uma Equipe de Alta Performance',
      keyResults: [
        { id: 1, description: 'Contratar 2 engenheiros sênior', progress: 50 },
        { id: 2, description: 'Implementar avaliações de desempenho trimestrais', progress: 100 },
      ],
    },
  ],
  chatMessages: [
      { id: 1, senderId: 1, receiverId: 2, text: 'Oi Beto, como está o progresso da feature principal?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { id: 2, senderId: 2, receiverId: 1, text: 'Oi Alice! Indo bem, acho que teremos um protótipo até o final da semana.', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
      { id: 3, senderId: 1, receiverId: 2, text: 'Ótimo!', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  ]
};

export const useStartupData = (): UseStartupDataReturn => {
  const [data, setData] = useState<Omit<StartupData, 'currentUser'>>(initialData);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);

  const registerUser = (user: Omit<TeamMember, 'id' | 'avatar' | 'roleType'>) => {
      const newUser: TeamMember = {
          ...user,
          id: Date.now(),
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
          roleType: 'developer' // New users are developers by default
      };
      setData(prev => ({
          ...prev,
          team: [...prev.team, newUser]
      }));
      setCurrentUser(newUser);
  };

  const addTeamMember = (member: Omit<TeamMember, 'id' | 'avatar'>) => {
    setData(prev => ({
      ...prev,
      team: [
        ...prev.team,
        { 
          ...member, 
          id: Date.now(), 
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
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

  return {
    ...data,
    currentUser: currentUser!, // Assuming currentUser will be set after login/register
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    addTransaction,
    updateRoadmap,
    updateOkrProgress,
    sendMessage,
    registerUser,
    setCurrentUser: (user: TeamMember) => setCurrentUser(user),
  };
};