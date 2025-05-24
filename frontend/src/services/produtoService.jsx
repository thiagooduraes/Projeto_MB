const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ProdutoService = {
    //Get todos
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/produtos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        return response.json();
    },

    //Get por ID
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('Produto não encontrado');
            throw new Error('Erro ao buscar produto por ID');
        }
        return response.json();
    },

    //Criar novo
    create: async (produtoData) => {
        const response = await fetch(`${API_BASE_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produtoData),
        });
        if (!response.ok) {
            throw new Error('Erro ao criar produto');
        }
        return response.json();
    },

    //Atualizar
    update: async (id, produtoData) => {
        const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produtoData),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar produto');
        }
        return response.json();
    },

    //Deletar
    remove: async (id) => {
        const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) throw new Error('Produto não encontrado para exclusão');
            throw new Error('Erro ao excluir produto');
        }
        return true;
    }
};