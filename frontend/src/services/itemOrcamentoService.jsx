import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ItemOrcamentoService = {
    //Get todos
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/itemOrcamentos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar itemOrcamento');
        }
        return response.json();
    },

    //Get por ID
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/itemOrcamentos/${id}`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('ItemOrcamento não encontrado');
            throw new Error('Erro ao buscar orçamento por ID');
        }
        return response.json();
    },

    //Criar novo
    create: async (orcamentoData) => {
        const response = await fetch(`${API_BASE_URL}/itemOrcamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orcamentoData),
        });
        if (!response.ok) {
            throw new Error("Erro ao criar item de orçamento");
        }
        return response.json();
    },

    //Atualizar
    update: async (id, orcamentoData) => {
        const response = await fetch(`${API_BASE_URL}/itemOrcamentos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orcamentoData),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar orcamento');
        }
        return response.json();
    },

    //Deletar
    remove: async (id) => {
        const response = await fetch(`${API_BASE_URL}/itemOrcamentos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) throw new Error('Item de Orçamento não encontrado para exclusão');
            throw new Error('Erro ao excluir orcamento');
        }
        return true;
    },

    getFilteredItems: async (filters) => {
        try {
            const params = new URLSearchParams();
            if (filters.produtoCodigo) {
                params.append('produtoCodigo', filters.produtoCodigo);
            }
            if (filters.dataInicial) {
                params.append('dataInicial', filters.dataInicial);
            }
            if (filters.dataFinal) {
                params.append('dataFinal', filters.dataFinal);
            }
            
            const response = await axios.get(`${API_BASE_URL}/itemOrcamentos/relatorio?${params.toString()}`);
            return response.data; 
        } catch (error) {
            console.error('Erro ao buscar itens para relatório:', error);
            throw error;
        }
    }
};