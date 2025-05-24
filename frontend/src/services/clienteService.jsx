const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ClienteService = {
    //Get todos
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        if (!response.ok) {
            throw new Error('Erro ao buscar clientes');
        }
        return response.json();
    },

    //Get por ID
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('Cliente não encontrado');
            throw new Error('Erro ao buscar cliente por ID');
        }
        return response.json();
    },

    //Criar novo
    create: async (clienteData) => {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteData),
        });
        if (!response.ok) {
            throw new Error('Erro ao criar cliente');
        }
        return response.json();
    },

    //Atualizar
    update: async (id, clienteData) => {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteData),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar cliente');
        }
        return response.json();
    },

    //Deletar
    remove: async (id) => {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) throw new Error('Cliente não encontrado para exclusão');
            throw new Error('Erro ao excluir cliente');
        }
        return true;
    }
};