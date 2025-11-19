import React, { useState, useMemo } from 'react';
import type { UseStartupDataReturn } from '../types';
import { generateInsights } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  data: UseStartupDataReturn;
}

const DashboardCard: React.FC<{ title: string; value: string; change?: string; changeType?: 'increase' | 'decrease'; children: React.ReactNode }> = ({ title, value, change, changeType, children }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-full">
                {children}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-medium">{title}</p>
                <p className="text-2xl font-bold text-dark">{value}</p>
            </div>
        </div>
        {change && (
            <p className={`text-sm mt-2 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                {change} vs último mês
            </p>
        )}
    </div>
);

const AIInsightModal: React.FC<{ insights: string; onClose: () => void }> = ({ insights, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-dark">Consultor de Negócios IA</h3>
                <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
            </div>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />').replace(/\*/g, '•') }} />
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [aiInsights, setAiInsights] = useState<string | null>(null);

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
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
                 <button onClick={handleGetInsights} disabled={isLoadingInsights} className="bg-secondary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors disabled:bg-gray-400">
                    {isLoadingInsights ? 'Gerando...' : 'Obter Insights com IA'}
                 </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <DashboardCard title="Receita Total" value={`R$${financialSummary.revenue.toLocaleString('pt-BR')}`} change="+12.5%" changeType="increase">
                     <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>
                </DashboardCard>
                <DashboardCard title="Despesas Totais" value={`R$${financialSummary.expenses.toLocaleString('pt-BR')}`} change="+8.1%" changeType="decrease">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                </DashboardCard>
                <DashboardCard title="Lucro Líquido" value={`R$${(financialSummary.revenue - financialSummary.expenses).toLocaleString('pt-BR')}`} change="+15.2%" changeType="increase">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </DashboardCard>
                <DashboardCard title="Membros da Equipe" value={data.team.length.toString()}>
                     <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013-1.197M15 21a9 9 0 00-9-5.197"></path></svg>
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4 text-dark">Visão Geral Financeira</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `R$${value/1000}k`} />
                            <Tooltip formatter={(value: number) => `R$${value.toLocaleString('pt-BR')}`} />
                            <Legend />
                            <Bar dataKey="receita" fill="#3B82F6" name="Receita" />
                            <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4 text-dark">Atividade Recente</h3>
                    <ul className="space-y-4">
                        {data.financials.slice(-5).reverse().map(t => (
                            <li key={t.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{t.description}</p>
                                    <p className="text-sm text-medium">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <p className={`font-bold ${t.type === 'revenue' ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.type === 'revenue' ? '+' : '-'}R$ {t.amount.toLocaleString('pt-BR')}
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
