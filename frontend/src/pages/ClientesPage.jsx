import React, { useState, useEffect } from 'react';
import { ClienteService } from '../services/clienteService';
import { Link, useNavigate } from 'react-router-dom';

function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadClientes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ClienteService.getAll();
            setClientes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClientes();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await ClienteService.remove(id);
                setClientes(clientes.filter(p => p.codigo !== id));
                alert('Cliente excluído com sucesso!');
            } catch (err) {
                alert(`Erro ao excluir cliente: ${err.message}`);
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Carregando clientes...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div>
            <h2>Lista de Clientes</h2>
            <Link to="/clientes/novo">
                <button>Adicionar Novo Cliente</button>
            </Link>

            {clientes.length === 0 ? (
                <p>Nenhum cliente cadastrado.</p>
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
                        {clientes.map(cliente => (
                            <tr key={cliente.codigo}>
                                <td>{cliente.codigo}</td>
                                <td>{cliente.nome}</td>
                                <td>
                                    <Link to={`/clientes/editar/${cliente.codigo}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(cliente.codigo)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ClientesPage;