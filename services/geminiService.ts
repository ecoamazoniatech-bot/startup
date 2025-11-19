import { GoogleGenAI } from "@google/genai";
import type { StartupData } from '../types';

const getApiKey = (): string => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }
    return apiKey;
};

export const generateInsights = async (data: StartupData): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        
        const financialSummary = data.financials.reduce((acc, t) => {
            if(t.type === 'revenue') acc.revenue += t.amount;
            else acc.expenses += t.amount;
            return acc;
        }, { revenue: 0, expenses: 0 });

        const prompt = `
            Analise os seguintes dados de uma startup e forneça 3 insights de negócio acionáveis.
            Formate a resposta como uma lista markdown em português.

            **Financeiro:**
            - Receita Total: R$${financialSummary.revenue.toFixed(2)}
            - Despesas Totais: R$${financialSummary.expenses.toFixed(2)}
            - Lucro Líquido: R$${(financialSummary.revenue - financialSummary.expenses).toFixed(2)}

            **Equipe:**
            - Tamanho da Equipe: ${data.team.length} membros

            **Roadmap do Produto:**
            - A Fazer: ${data.roadmap.todo.length} tarefas
            - Em Progresso: ${data.roadmap.inProgress.length} tarefas
            - Concluído: ${data.roadmap.done.length} tarefas
            
            **OKRs:**
            - Número de objetivos: ${data.okrs.length}

            Com base nesses dados, quais são suas 3 principais recomendações para esta startup focar a seguir?
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Erro ao gerar insights da API Gemini:", error);
        return "Desculpe, não consegui gerar os insights no momento. Por favor, verifique o console para mais detalhes.";
    }
};
