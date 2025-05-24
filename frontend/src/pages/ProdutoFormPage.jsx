import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProdutoService } from '../services/produtoService';

function ProdutoFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [produto, setProduto] = useState({ descricao: '', preco: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            const fetchProduto = async () => {
                try {
                    const data = await ProdutoService.getById(id);
                    setProduto(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduto();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduto(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const produtoParaEnviar = {
                ...produto,
                preco: parseFloat(produto.preco)
            };

            if (id) {
                await ProdutoService.update(id, produtoParaEnviar);
                alert('Produto atualizado com sucesso!');
            } else {
                await ProdutoService.create(produtoParaEnviar);
                alert('Produto cadastrado com sucesso!');
            }
            navigate('/produtos');
        } catch (err) {
            alert(`Erro: ${err.message}`);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <p>Carregando dados do produto...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div>
            <h2>{id ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="descricao">Descrição:</label>
                    <input
                        id="descricao"
                        name="descricao"
                        value={produto.descricao}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="preco">Preço:</label>
                    <input
                        type="number"
                        id="preco"
                        name="preco"
                        value={produto.preco}
                        onChange={handleChange}
                        step="0.01"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => navigate('/produtos')}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default ProdutoFormPage;