import React from 'react';
import type { UseStartupDataReturn } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialsProps {
  data: UseStartupDataReturn;
}

const Financials: React.FC<FinancialsProps> = ({ data }) => {
  const summary = data.financials.reduce((acc, t) => {
    if (t.type === 'revenue') {
      acc.revenue += t.amount;
    } else {
      acc.expenses += t.amount;
    }
    return acc;
  }, { revenue: 0, expenses: 0 });

  const pieData = [
    { name: 'Receita', value: summary.revenue },
    { name: 'Despesas', value: summary.expenses },
  ];
  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Financeiro</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-dark">Todas as Transações</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider text-sm">Data</th>
                  <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider text-sm">Descrição</th>
                  <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider text-sm">Tipo</th>
                  <th className="p-3 font-semibold text-gray-600 uppercase tracking-wider text-sm text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {[...data.financials].reverse().map(t => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-medium">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3 text-dark">{t.description}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === 'revenue' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {t.type === 'revenue' ? 'receita' : 'despesa'}
                      </span>
                    </td>
                    <td className={`p-3 font-bold text-right ${t.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {t.amount.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-dark">Resumo</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$${value.toLocaleString('pt-BR')}`}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between font-semibold text-dark"><span>Receita Total:</span> <span className="text-green-600">R$ {summary.revenue.toLocaleString('pt-BR')}</span></div>
            <div className="flex justify-between font-semibold text-dark"><span>Despesas Totais:</span> <span className="text-red-600">R$ {summary.expenses.toLocaleString('pt-BR')}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 text-dark"><span>Lucro Líquido:</span> <span>R$ {(summary.revenue - summary.expenses).toLocaleString('pt-BR')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;