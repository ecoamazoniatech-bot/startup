
import React, { useState } from 'react';
import type { UseStartupDataReturn, TeamMember, RoleType } from '../types';

interface TeamProps {
  data: UseStartupDataReturn;
}

const MemberModal: React.FC<{
  member?: TeamMember | null;
  onClose: () => void;
  onSave: (member: Omit<TeamMember, 'id' | 'avatar' | 'xp' | 'level' | 'badges'>) => void;
  isCeo: boolean;
}> = ({ member, onClose, onSave, isCeo }) => {
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [email, setEmail] = useState(member?.email || '');
  const [roleType, setRoleType] = useState<RoleType>(member?.roleType || 'developer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && role && email) {
      onSave({ name, role, email, roleType });
      onClose();
    }
  };
  
  const roleLabels: Record<RoleType, string> = {
      ceo: 'CEO',
      developer: 'Desenvolvedor',
      marketing: 'Marketing'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-black text-dark mb-6">{member ? 'Editar Personagem' : 'Criar Novo Personagem'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Nome do Avatar</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Classe (Cargo)</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Ex: Mago do Frontend" className="w-full px-4 py-2 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all" required />
          </div>
           {isCeo && (
             <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Especialização</label>
                <select value={roleType} onChange={e => setRoleType(e.target.value as RoleType)} className="w-full px-4 py-2 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all">
                    {(Object.keys(roleLabels) as Array<RoleType>).map(key => (
                        <option key={key} value={key}>{roleLabels[key]}</option>
                    ))}
                </select>
             </div>
           )}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Email de Contato</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all" required />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancelar</button>
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-xl shadow-game transform active:translate-y-1 active:shadow-none transition-all">{member ? 'Salvar' : 'Invocar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Team: React.FC<TeamProps> = ({ data }) => {
  const { currentUser, team, addTeamMember, removeTeamMember, updateTeamMember } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleSaveMember = (memberData: Omit<TeamMember, 'id' | 'avatar' | 'xp' | 'level' | 'badges'>) => {
    if (editingMember) {
      updateTeamMember({ ...editingMember, ...memberData });
    } else {
      addTeamMember(memberData);
    }
    setEditingMember(null);
  };
  
  const openEditModal = (member: TeamMember) => {
      setEditingMember(member);
      setIsModalOpen(true);
  }
  
  const isCeo = currentUser.roleType === 'ceo';

  return (
    <div>
      {isModalOpen && <MemberModal member={editingMember} onClose={() => { setIsModalOpen(false); setEditingMember(null); }} onSave={handleSaveMember} isCeo={isCeo} />}
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-dark">Guilda de Heróis</h1>
          {isCeo && (
            <button onClick={() => setIsModalOpen(true)} className="bg-secondary hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-xl shadow-game transform hover:-translate-y-1 transition-all flex items-center">
                <span className="text-xl mr-2">+</span> Invocar Membro
            </button>
          )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map(member => (
            <div key={member.id} className="relative bg-white rounded-3xl p-6 shadow-card hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-primary group">
               {/* Level Badge */}
               <div className="absolute -top-4 -left-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-white z-10">
                   {member.level}
               </div>

               {/* Avatar & Info */}
               <div className="flex flex-col items-center">
                   <div className="relative mb-4">
                       <img src={member.avatar} alt={member.name} className="w-28 h-28 rounded-2xl object-cover ring-4 ring-gray-50 shadow-lg transform group-hover:scale-105 transition-transform" />
                       <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                           {member.roleType.toUpperCase()}
                       </div>
                   </div>
                   
                   <h3 className="font-black text-xl text-dark mt-2">{member.name}</h3>
                   <p className="text-primary font-bold">{member.role}</p>
                   
                   {/* XP Bar */}
                   <div className="w-full mt-4">
                       <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                           <span>XP</span>
                           <span>{member.xp} / {member.level * 500}</span>
                       </div>
                       <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                           <div 
                                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${Math.min(100, (member.xp / (member.level * 500)) * 100)}%` }}
                           ></div>
                       </div>
                   </div>

                   {/* Badges */}
                   <div className="flex gap-2 mt-4 bg-gray-50 p-2 rounded-xl w-full justify-center">
                       {member.badges.length > 0 ? member.badges.map((badge, i) => (
                           <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>{badge}</span>
                       )) : <span className="text-xs text-gray-400 py-1">Sem conquistas</span>}
                   </div>
               </div>

               {/* Actions (Admin Only) */}
               {isCeo && currentUser.id !== member.id && (
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(member)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
                      </button>
                      <button onClick={() => window.confirm(`Banir ${member.name} da guilda?`) && removeTeamMember(member.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
                      </button>
                  </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Team;
