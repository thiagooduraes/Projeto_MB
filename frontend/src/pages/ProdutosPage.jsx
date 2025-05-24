import React, { useState, useEffect } from 'react';
import { ProdutoService } from '../services/produtoService';
import { Link, useNavigate } from 'react-router-dom';

function ProdutosPage() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadProdutos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ProdutoService.getAll();
            setProdutos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProdutos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await ProdutoService.remove(id);
                setProdutos(produtos.filter(p => p.codigo !== id));
                alert('Produto excluído com sucesso!');
            } catch (err) {
                alert(`Erro ao excluir produto: ${err.message}`);
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Carregando produtos...</p>;
    if (error) return <p>Erro: {error}</p>;
    return (
        <div>
            <h2>Lista de Produtos</h2>
            <Link to="/produtos/novo">
                <button>Adicionar Novo Produto</button>
            </Link>

            {produtos.length === 0 ? (
                <p>Nenhum produto cadastrado.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descricao</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map(produto => (
                            <tr key={produto.codigo}>
                                <td>{produto.codigo}</td>
                                <td>{produto.descricao}</td>
                                
                                <td>{typeof produto.preco === 'number' && !isNaN(produto.preco) ? (
                                        `R$ ${produto.preco.toFixed(2)}`
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td>
                                    <Link to={`/produtos/editar/${produto.codigo}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(produto.codigo)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProdutosPage;