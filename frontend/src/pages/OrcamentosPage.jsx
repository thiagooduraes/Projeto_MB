import React, { useState, useEffect } from 'react';
import { OrcamentoService } from '../services/orcamentoService';
import { Link, useNavigate } from 'react-router-dom';

function OrcamentosPage() {
    const [orcamentos, setOrcamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadOrcamentos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await OrcamentoService.getAll();
            setOrcamentos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrcamentos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este orcamento?')) {
            try {
                await OrcamentoService.remove(id);
                setOrcamentos(orcamentos.filter(p => p.codigo !== id));
                alert('Orcamento excluído com sucesso!');
            } catch (err) {
                alert(`Erro ao excluir orcamento: ${err.message}`);
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Carregando orçamentos...</p>;
    if (error) return <p>Erro: {error}</p>;
    
    return (
        <div>
            <h2>Lista de Orçamentos</h2>
            <Link to="/orcamentos/novo">
                <button>Adicionar Novo Orçamento</button>
            </Link>

            {orcamentos.length === 0 ? (
                <p>Nenhuma orçamento cadastrado.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Vendedor</th>
                            <th>Cliente</th>
                            <th>Data</th>
                            <th>Preco_total</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orcamentos.map(orcamento => (
                            <tr key={orcamento.codigo}>
                                <td>{orcamento.codigo}</td>
                                <td>{orcamento.vendedor}</td>
                                <td>{orcamento.cliente}</td>
                                <td>{orcamento.data}</td>
                                <td>{orcamento.preco_total}</td>
                                <td>{typeof orcamento.preco_total === 'number' && !isNaN(orcamento.preco_total) ? (
                                        `R$ ${orcamento.preco_total.toFixed(2)}`
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td>
                                    <Link to={`/orcamentos/editar/${orcamento.codigo}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(orcamento.codigo)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default OrcamentosPage;