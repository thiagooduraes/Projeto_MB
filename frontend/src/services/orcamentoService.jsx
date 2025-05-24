const API_BASE_URL = import.meta.env.VITE_API_URL;

export const OrcamentoService = {
    //Get todos
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/orcamentos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar orcamentos');
        }
        return response.json();
    },

    //Get por ID
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/orcamentos/${id}`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('Orcamento não encontrado');
            throw new Error('Erro ao buscar orçamento por ID');
        }
        return response.json();
    },

    //Criar novo
    create: async (orcamentoData) => {
        const response = await fetch(`${API_BASE_URL}/orcamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orcamentoData),
        });
        if (!response.ok) {
            throw new Error("Erro ao criar orçamento");
        }
        return response.json();
    },

    //Atualizar
    update: async (id, orcamentoData) => {
        const response = await fetch(`${API_BASE_URL}/orcamentos/${id}`, {
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
        const response = await fetch(`${API_BASE_URL}/orcamentos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) throw new Error('Orcamento não encontrado para exclusão');
            throw new Error('Erro ao excluir orcamento');
        }
        return true;
    }
};