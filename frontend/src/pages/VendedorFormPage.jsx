import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VendedorService } from '../services/vendedorService';

function VendedorFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendedor, setVendedor] = useState({ nome: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            const fetchVendedor = async () => {
                try {
                    const data = await VendedorService.getById(id);
                    setVendedor(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchVendedor();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVendedor(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const vendedorParaEnviar = {
                ...vendedor,
            };

            if (id) {
                await VendedorService.update(id, vendedorParaEnviar);
                alert('Vendedor atualizado com sucesso!');
            } else {
                await VendedorService.create(vendedorParaEnviar);
                alert('Vendedor cadastrado com sucesso!');
            }
            navigate('/vendedores');
        } catch (err) {
            alert(`Erro: ${err.message}`);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <p>Carregando dados do vendedor...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div>
            <h2>{id ? 'Editar Vendedor' : 'Adicionar Novo Vendedor'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={vendedor.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => navigate('/vendedores')}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default VendedorFormPage;