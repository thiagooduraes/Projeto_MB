import React, { useState, useEffect } from 'react';
import { OfertaService } from '../services/ofertaService';
import { Link, useNavigate } from 'react-router-dom';

function OfertasPage() {
    const [ofertas, setOfertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadOfertas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await OfertaService.getAll();
            setOfertas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOfertas();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta oferta?')) {
            try {
                await OfertaService.remove(id);
                setOfertas(ofertas.filter(p => p.codigo !== id));
                alert('Oferta excluída com sucesso!');
            } catch (err) {
                alert(`Erro ao excluir oferta: ${err.message}`);
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Carregando ofertas...</p>;
    if (error) return <p>Erro: {error}</p>;
    
    return (
        <div>
            <h2>Lista de Ofertas</h2>
            <Link to="/ofertas/novo">
                <button>Adicionar Nova Oferta</button>
            </Link>

            {ofertas.length === 0 ? (
                <p>Nenhuma oferta cadastrada.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Produto</th>
                            <th>Leve</th>
                            <th>Pague</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ofertas.map(oferta => (
                            <tr key={oferta.codigo}>
                                <td>{oferta.codigo}</td>
                                <td>{oferta.produto}</td>
                                <td>{oferta.leve}</td>
                                <td>{oferta.pague}</td>
                                <td>
                                    <Link to={`/ofertas/editar/${oferta.codigo}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(oferta.codigo)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default OfertasPage;