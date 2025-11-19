
import React, { useState, useMemo } from 'react';
import type { UseStartupDataReturn } from '../types';
import { generateInsights } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  data: UseStartupDataReturn;
}

const DashboardCard: React.FC<{ title: string; value: string; subValue?: string; color: string; icon: React.ReactNode }> = ({ title, value, subValue, color, icon }) => (
    <div className={`bg-white p-6 rounded-3xl shadow-card border-b-4 hover:-translate-y-1 transition-transform duration-300`} style={{ borderColor: color }}>
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: `${color}20` }}>
                <div style={{ color: color }}>{icon}</div>
            </div>
            {subValue && (
                 <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-500">{subValue}</span>
            )}
        </div>
        <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-black text-dark mt-1">{value}</p>
        </div>
    </div>
);

const AIInsightModal: React.FC<{ insights: string; onClose: () => void }> = ({ insights, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full animate-[bounce_0.5s_ease-out]">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl mr-3">
                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h3 className="text-2xl font-black text-dark">Oráculo da IA</h3>
                </div>
                <button onClick={onClose} className="text-2xl text-gray-400 hover:text-red-500 transition-colors">&times;</button>
            </div>
            <div className="prose max-w-none font-medium text-gray-600" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />').replace(/\*/g, '✨') }} />
             <div className="mt-6 text-right">
                <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-dark font-bold py-2 px-6 rounded-xl transition-colors">
                    Fechar Grimório
                </button>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [aiInsights, setAiInsights] = useState<string | null>(null);
    const { settings } = data;

    const financialSummary = useMemo(() => {
        return data.financials.reduce((acc, t) => {
            if(t.type === 'revenue') acc.revenue += t.amount;
            else acc.expenses += t.amount;
            return acc;
        }, { revenue: 0, expenses: 0 });
    }, [data.financials]);

    const handleGetInsights = async () => {
        setIsLoadingInsights(true);
        const insights = await generateInsights(data);
        setAiInsights(insights);
        setIsLoadingInsights(false);
    };

    const chartData = [
        { name: 'Jan', receita: 4000, despesas: 2400 },
        { name: 'Fev', receita: 3000, despesas: 1398 },
        { name: 'Mar', receita: 2000, despesas: 9800 },
        { name: 'Abr', receita: 2780, despesas: 3908 },
        { name: 'Mai', receita: 1890, despesas: 4800 },
        { name: 'Jun', receita: 2390, despesas: 3800 },
    ];

    return (
        <div>
            {aiInsights && <AIInsightModal insights={aiInsights} onClose={() => setAiInsights(null)} />}
            
            <div className="bg-white rounded-3xl p-8 shadow-card mb-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-dark mb-2">{settings.name}</h1>
                        <p className="text-lg text-gray-500 italic">"{settings.mission}"</p>
                    </div>
                    <button onClick={handleGetInsights} disabled={isLoadingInsights} className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary text-white font-bold py-3 px-6 rounded-2xl shadow-game transform active:scale-95 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoadingInsights ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        )}
                        {isLoadingInsights ? 'Consultando Oráculo...' : 'Invocar Sabedoria IA'}
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard 
                    title="Tesouro Total" 
                    value={`${settings.currency} ${financialSummary.revenue.toLocaleString('pt-BR')}`} 
                    subValue="+12% XP"
                    color="#10B981"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>}
                />
                <DashboardCard 
                    title="Custo de Mana" 
                    value={`${settings.currency} ${financialSummary.expenses.toLocaleString('pt-BR')}`} 
                    subValue="Estável"
                    color="#EF4444"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>}
                />
                <DashboardCard 
                    title="Loot Líquido" 
                    value={`${settings.currency} ${(financialSummary.revenue - financialSummary.expenses).toLocaleString('pt-BR')}`} 
                    color="#8B5CF6"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
                />
                <DashboardCard 
                    title="Heróis Ativos" 
                    value={data.team.length.toString()} 
                    subValue="Party Full"
                    color="#F59E0B"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013-1.197M15 21a9 9 0 00-9-5.197"></path></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-card">
                    <h3 className="font-black text-xl mb-6 text-dark flex items-center">
                        <span className="mr-2">📊</span> Estatísticas do Reino
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" tickLine={false} axisLine={false} />
                            <YAxis tickFormatter={(value) => `${value/1000}k`} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                            <Legend iconType="circle" />
                            <Bar dataKey="receita" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Receita" />
                            <Bar dataKey="despesas" fill="#FCA5A5" radius={[4, 4, 0, 0]} name="Despesas" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white p-6 rounded-3xl shadow-card">
                    <h3 className="font-black text-xl mb-6 text-dark flex items-center">
                        <span className="mr-2">📜</span> Logs de Missão
                    </h3>
                    <ul className="space-y-4">
                        {data.financials.slice(-5).reverse().map(t => (
                            <li key={t.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div>
                                    <p className="font-bold text-sm text-dark">{t.description}</p>
                                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <p className={`font-bold text-sm ${t.type === 'revenue' ? 'text-green-500 bg-green-50 px-2 py-1 rounded-lg' : 'text-red-500 bg-red-50 px-2 py-1 rounded-lg'}`}>
                                    {t.type === 'revenue' ? '+' : '-'}{settings.currency} {t.amount.toLocaleString('pt-BR')}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
