import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ItemOrcamentoService } from '../services/itemOrcamentoService';

function ItemOrcamentoFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [itemOrcamento, setItemOrcamento] = useState({ orcamento: '', ordem: '', produto: '', preco: ''});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            const fetchItemOrcamento = async () => {
                try {
                    const data = await ItemOrcamentoService.getById(id);
                    setItemOrcamento(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchItemOrcamento();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItemOrcamento(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const itemOrcamentoParaEnviar = {
                ...itemOrcamento,
                preco: parseFloat(itemOrcamento.preco)
            };

            if (id) {
                await ItemOrcamentoService.update(id, itemOrcamentoParaEnviar);
                alert('Item de Orçamento atualizado com sucesso!');
            } else {
                await ItemOrcamentoService.create(itemOrcamentoParaEnviar);
                alert('Item de Orçamento cadastrado com sucesso!');
            }
            navigate('/itemOrcamentos');
        } catch (err) {
            alert(`Erro: ${err.message}`);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <p>Carregando dados do item de orçamento...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div>
            <h2>{id ? 'Editar Item de Orçamento' : 'Adicionar Novo Item de Orçamento'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="orcamento">Orcamento:</label>
                    <input
                        type="number"
                        id="orcamento"
                        name="orcamento"
                        value={itemOrcamento.orcamento}
                        onChange={handleChange}
                        step="1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="ordem">Ordem:</label>
                    <input
                        type="number"
                        id="ordem"
                        name="ordem"
                        value={itemOrcamento.ordem}
                        onChange={handleChange}
                        step="1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="produto">Produto:</label>
                    <input
                        type="number"
                        id="produto"
                        name="produto"
                        value={itemOrcamento.produto}
                        onChange={handleChange}
                        step="1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="preco">Preco:</label>
                    <input
                        type="number"
                        id="preco"
                        name="preco"
                        value={itemOrcamento.preco}
                        onChange={handleChange}
                        step="0.01"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => navigate('/itemOrcamentos')}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default ItemOrcamentoFormPage;