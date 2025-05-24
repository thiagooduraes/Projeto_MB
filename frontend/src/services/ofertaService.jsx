const API_BASE_URL = import.meta.env.VITE_API_URL;

export const OfertaService = {
    //Get todos
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/ofertas`);
        if (!response.ok) {
            throw new Error('Erro ao buscar ofertas');
        }
        return response.json();
    },

    //Get por ID
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/ofertas/${id}`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('Oferta não encontrada');
            throw new Error('Erro ao buscar oferta por ID');
        }
        return response.json();
    },

    //Criar novo
    create: async (ofertaData) => {
        const response = await fetch(`${API_BASE_URL}/ofertas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ofertaData),
        });
        if (!response.ok) {
            throw new Error("Erro ao criar oferta");
        }
        return response.json();
    },

    //Atualizar
    update: async (id, ofertaData) => {
        const response = await fetch(`${API_BASE_URL}/ofertas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ofertaData),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar oferta');
        }
        return response.json();
    },

    //Deletar
    remove: async (id) => {
        const response = await fetch(`${API_BASE_URL}/ofertas/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) throw new Error('Oferta não encontrada para exclusão');
            throw new Error('Erro ao excluir oferta');
        }
        return true;
    }
};