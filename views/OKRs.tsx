import React from 'react';
import type { UseStartupDataReturn } from '../types';

interface OKRsProps {
  data: UseStartupDataReturn;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

const OKRs: React.FC<OKRsProps> = ({ data }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Objetivos e Resultados-Chave (OKRs)</h1>
      <div className="space-y-6">
        {data.okrs.map(okr => (
          <div key={okr.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-dark mb-4">{okr.title}</h2>
            <div className="space-y-4">
              {okr.keyResults.map(kr => (
                <div key={kr.id}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-medium">{kr.description}</p>
                    <p className="font-semibold text-primary">{kr.progress}%</p>
                  </div>
                  <ProgressBar progress={kr.progress} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OKRs;
