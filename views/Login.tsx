import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
  onNavigateRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateRegister }) => {
  const [email, setEmail] = useState('alice@startupos.dev');
  const [password, setPassword] = useState('password');

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
          <p className="text-gray-500">A plataforma tudo-em-um para gerenciar sua startup.</p>
        </div>
        <div className="bg-white shadow-md rounded-lg px-8 py-8">
          <form onSubmit={(e) => { e.preventDefault(); onLogin(email); }}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Endereço de Email
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" 
                id="email" 
                type="email" 
                placeholder="voce@empresa.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Senha
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary" 
                id="password" 
                type="password" 
                placeholder="******************" 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-between">
              <button 
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
                type="submit"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={onNavigateRegister}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Não tem uma conta? Cadastre-se
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
