import React, { useState } from 'react';
import type { TeamMember } from '../types';

interface RegisterProps {
  onRegister: (user: Omit<TeamMember, 'id' | 'avatar' | 'roleType'>) => void;
  onNavigateLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateLogin }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && role && email && password) {
        onRegister({ name, role, email });
    } else {
        alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-lg p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h1 className="text-3xl font-bold ml-4 text-dark">StartupOS</h1>
          </div>
          <p className="text-gray-500">Crie sua conta para gerenciar sua startup.</p>
        </div>
        <div className="bg-white shadow-md rounded-lg px-8 py-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nome Completo</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" id="name" type="text" placeholder="Seu Nome" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Cargo</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" id="role" type="text" placeholder="Ex: CEO, Desenvolvedor" value={role} onChange={e => setRole(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Endereço de Email</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" id="email" type="email" placeholder="voce@empresa.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Senha</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" id="password" type="password" placeholder="******************" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="flex flex-col items-center justify-between">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">Cadastrar</button>
              <button onClick={onNavigateLogin} className="mt-4 text-sm text-primary hover:underline">Já tem uma conta? Faça login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
