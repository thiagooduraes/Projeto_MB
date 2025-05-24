import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrcamentoService } from '../services/orcamentoService';

function OrcamentoFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orcamento, setOrcamento] = useState({ vendedor: '', cliente: '', data: '', preco_total: ''});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            const fetchOrcamento = async () => {
                try {
                    const data = await OrcamentoService.getById(id);
                    setOrcamento(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrcamento();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrcamento(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orcamentoParaEnviar = {
                ...orcamento,
            };

            if (id) {
                await OrcamentoService.update(id, orcamentoParaEnviar);
                alert('Orcamento atualizado com sucesso!');
            } else {
                await OrcamentoService.create(orcamentoParaEnviar);
                alert('Orcamento cadastrado com sucesso!');
            }
            navigate('/orcamentos');
        } catch (err) {
            alert(`Erro: ${err.message}`);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <p>Carregando dados do orcamento...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div>
            <h2>{id ? 'Editar Orçamento' : 'Adicionar Novo Orçamento'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="vendedor">Vendedor:</label>
                    <input
                        type="number"
                        id="vendedor"
                        name="vendedor"
                        value={orcamento.vendedor}
                        onChange={handleChange}
                        step="1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="cliente">Cliente:</label>
                    <input
                        type="number"
                        id="cliente"
                        name="cliente"
                        value={orcamento.cliente}
                        onChange={handleChange}
                        step="1"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => navigate('/orcamentos')}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default OrcamentoFormPage;