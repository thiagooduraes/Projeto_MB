import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OfertaService } from '../services/ofertaService';

function OfertaFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [oferta, setOferta] = useState({ produto: '', leve: '', pague: ''});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            const fetchOferta = async () => {
                try {
                    const data = await OfertaService.getById(id);
                    setOferta(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchOferta();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOferta(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const ofertaParaEnviar = {
                ...oferta,
            };

            if (id) {
                await OfertaService.update(id, ofertaParaEnviar);
                alert('Oferta atualizada com sucesso!');
            } else {
                await OfertaService.create(ofertaParaEnviar);
                alert('Oferta cadastrada com sucesso!');
            }
            navigate('/ofertas');
        } catch (err) {
            alert(`Erro: ${err.message}`);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <p>Carregando dados da oferta...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div>
            <h2>{id ? 'Editar Oferta' : 'Adicionar Nova Oferta'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="produto">Produto:</label>
                    <input
                        type="number"
                        id="produto"
                        name="produto"
                        value={oferta.produto}
                        onChange={handleChange}
                        step="1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="leve">Leve:</label>
                    <input
                        type="number"
                        id="leve"
                        name="leve"
                        value={oferta.leve}
                        onChange={handleChange}
                        step="1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="pague">Pague:</label>
                    <input
                        type="number"
                        id="pague"
                        name="pague"
                        value={oferta.pague}
                        onChange={handleChange}
                        step="1"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => navigate('/ofertas')}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default OfertaFormPage;