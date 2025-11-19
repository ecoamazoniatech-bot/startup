import React, { useState } from 'react';
import type { UseStartupDataReturn, TeamMember, RoleType } from '../types';

interface TeamProps {
  data: UseStartupDataReturn;
}

const MemberModal: React.FC<{
  member?: TeamMember | null;
  onClose: () => void;
  onSave: (member: Omit<TeamMember, 'id' | 'avatar'>) => void;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h3 className="text-xl font-bold text-dark mb-4">{member ? 'Editar Membro' : 'Adicionar Membro'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Título do Cargo</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Ex: Desenvolvedor Frontend Sênior" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
           {isCeo && (
             <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Função</label>
                <select value={roleType} onChange={e => setRoleType(e.target.value as RoleType)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                    {(Object.keys(roleLabels) as Array<RoleType>).map(key => (
                        <option key={key} value={key}>{roleLabels[key]}</option>
                    ))}
                </select>
             </div>
           )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">{member ? 'Salvar' : 'Adicionar'}</button>
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

  const handleSaveMember = (memberData: Omit<TeamMember, 'id' | 'avatar'>) => {
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
      <h1 className="text-3xl font-bold text-dark mb-6">Membros da Equipe</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {team.map(member => (
            <div key={member.id} className="relative text-center bg-gray-50 p-4 rounded-lg group border border-transparent hover:border-primary transition-all duration-300">
              <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-white" />
              <h3 className="font-bold text-lg text-dark">{member.name}</h3>
              <p className="text-primary font-semibold">{member.role}</p>
              <p className="text-sm text-medium">{member.email}</p>
              {isCeo && currentUser.id !== member.id && (
                  <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(member)} className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
                      </button>
                      <button onClick={() => window.confirm(`Tem certeza que deseja remover ${member.name}?`) && removeTeamMember(member.id)} className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
                      </button>
                  </div>
              )}
            </div>
          ))}
          {isCeo && (
            <button onClick={() => setIsModalOpen(true)} className="text-center bg-gray-50 p-4 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary hover:text-primary transition-all duration-300">
                <span className="font-semibold text-lg">+ Adicionar Membro</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;