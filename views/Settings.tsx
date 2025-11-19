
import React, { useState, useEffect } from 'react';
import type { UseStartupDataReturn } from '../types';

interface SettingsProps {
  data: UseStartupDataReturn;
}

const Settings: React.FC<SettingsProps> = ({ data }) => {
  const { settings, currentUser, updateSettings } = data;
  const [formData, setFormData] = useState(settings);
  const [showSuccess, setShowSuccess] = useState(false);

  const isCeo = currentUser.roleType === 'ceo';

  useEffect(() => {
      setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!isCeo) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-800">Acesso Restrito</h2>
              <p className="text-gray-500 mt-2">Apenas o CEO/Admin tem a chave desta masmorra de configurações.</p>
          </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-8">
          <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-2xl shadow-lg transform -rotate-3">
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-dark ml-4">Configurações do Reino (Admin)</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-card p-8 border-2 border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div className="col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Nome da Startup (Guilda)</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all text-lg font-semibold"
                    placeholder="Ex: Tech Wizards Inc."
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Missão (Quest Principal)</label>
                <textarea
                    name="mission"
                    rows={2}
                    value={formData.mission}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Visão (O Futuro)</label>
                <textarea
                    name="vision"
                    rows={2}
                    value={formData.vision}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Moeda</label>
                    <select 
                        name="currency" 
                        value={formData.currency} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:ring-0 transition-all"
                    >
                        <option value="R$">Reais (R$)</option>
                        <option value="$">Dólar ($)</option>
                        <option value="€">Euro (€)</option>
                        <option value="🪙">Gold Coins (🪙)</option>
                    </select>
                </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end space-x-4">
             {showSuccess && (
                 <span className="text-green-500 font-bold animate-pulse">Configurações salvas com sucesso! 🎉</span>
             )}
             <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl shadow-game transform hover:translate-y-1 transition-all active:shadow-none active:translate-y-2"
             >
                Salvar Alterações
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
