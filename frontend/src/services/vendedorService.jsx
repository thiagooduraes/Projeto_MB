const API_BASE_URL = import.meta.env.VITE_API_URL;

export const VendedorService = {
    //Get todos
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/vendedores`);
        if (!response.ok) {
            throw new Error('Erro ao buscar vendedores');
        }
        return response.json();
    },

    //Get por ID
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/vendedores/${id}`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('Vendedor não encontrado');
            throw new Error('Erro ao buscar vendedor por ID');
        }
        return response.json();
    },

    //Criar novo
    create: async (vendedorData) => {
        const response = await fetch(`${API_BASE_URL}/vendedores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vendedorData),
        });
        if (!response.ok) {
            throw new Error('Erro ao criar vendedor');
        }
        return response.json();
    },

    //Atualizar
    update: async (id, vendedorData) => {
        const response = await fetch(`${API_BASE_URL}/vendedores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vendedorData),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar vendedor');
        }
        return response.json();
    },

    //Deletar
    remove: async (id) => {
        const response = await fetch(`${API_BASE_URL}/vendedores/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) throw new Error('Vendedor não encontrado para exclusão');
            throw new Error('Erro ao excluir vendedor');
        }
        return true;
    }
};