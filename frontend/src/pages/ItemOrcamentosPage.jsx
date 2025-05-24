import React, { useState, useEffect } from 'react';
import { ItemOrcamentoService } from '../services/itemOrcamentoService';
import { Link, useNavigate } from 'react-router-dom';

function ItemOrcamentosPage() {
    const [itemOrcamentos, setItemOrcamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadItemOrcamentos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ItemOrcamentoService.getAll();
            setItemOrcamentos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItemOrcamentos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este item de orcamento?')) {
            try {
                await ItemOrcamentoService.remove(id);
                setItemOrcamentos(itemOrcamentos.filter(p => p.codigo !== id));
                alert('Item de Orcamento excluído com sucesso!');
            } catch (err) {
                alert(`Erro ao excluir item de orcamento: ${err.message}`);
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Carregando orçamentos...</p>;
    if (error) return <p>Erro: {error}</p>;
    
    return (
        <div>
            <h2>Lista de Orçamentos</h2>
            <Link to="/itemOrcamentos/novo">
                <button>Adicionar Novo Orçamento</button>
            </Link>

            {itemOrcamentos.length === 0 ? (
                <p>Nenhuma orçamento cadastrado.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Orcamento</th>
                            <th>Ordem</th>
                            <th>Produto</th>
                            <th>Preco</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemOrcamentos.map(itemOrcamento => (
                            <tr key={itemOrcamento.codigo}>
                                <td>{itemOrcamento.codigo}</td>
                                <td>{itemOrcamento.orcamento}</td>
                                <td>{itemOrcamento.ordem}</td>
                                <td>{itemOrcamento.produto}</td>
                                <td>{itemOrcamento.preco}</td>
                                <td>
                                    <Link to={`/itemOrcamentos/editar/${itemOrcamento.codigo}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(itemOrcamento.codigo)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ItemOrcamentosPage;