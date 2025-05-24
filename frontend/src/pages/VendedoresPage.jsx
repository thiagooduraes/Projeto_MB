import React, { useState, useEffect } from 'react';
import { VendedorService } from '../services/vendedorService';
import { Link, useNavigate } from 'react-router-dom';

function VendedoresPage() {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadVendedores = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await VendedorService.getAll();
            setVendedores(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVendedores();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este vendedor?')) {
            try {
                await VendedorService.remove(id);
                setVendedores(vendedores.filter(p => p.codigo !== id));
                alert('Vendedor excluído com sucesso!');
            } catch (err) {
                alert(`Erro ao excluir vendedor: ${err.message}`);
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Carregando vendedores...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div>
            <h2>Lista de Vendedores</h2>
            <Link to="/vendedores/novo">
                <button>Adicionar Novo Vendedor</button>
            </Link>

            {vendedores.length === 0 ? (
                <p>Nenhum vendedor cadastrado.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendedores.map(vendedor => (
                            <tr key={vendedor.codigo}>
                                <td>{vendedor.codigo}</td>
                                <td>{vendedor.nome}</td>
                                <td>
                                    <Link to={`/vendedores/editar/${vendedor.codigo}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(vendedor.codigo)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default VendedoresPage;