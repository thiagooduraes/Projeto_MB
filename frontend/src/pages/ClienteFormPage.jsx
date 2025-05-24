import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClienteService } from '../services/clienteService';

function ClienteFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({ nome: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            const fetchCliente = async () => {
                try {
                    const data = await ClienteService.getById(id);
                    setCliente(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchCliente();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const clienteParaEnviar = {
                ...cliente,
            };

            if (id) {
                await ClienteService.update(id, clienteParaEnviar);
                alert('Cliente atualizado com sucesso!');
            } else {
                await ClienteService.create(clienteParaEnviar);
                alert('Cliente cadastrado com sucesso!');
            }
            navigate('/clientes');
        } catch (err) {
            alert(`Erro: ${err.message}`);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <p>Carregando dados do cliente...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div>
            <h2>{id ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={cliente.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => navigate('/clientes')}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default ClienteFormPage;