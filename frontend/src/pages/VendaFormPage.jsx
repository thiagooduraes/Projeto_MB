import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrcamentoService } from '../services/OrcamentoService';
import { ItemOrcamentoService } from '../services/itemOrcamentoService';
import { ProdutoService } from '../services/ProdutoService';
import { OfertaService } from '../services/OfertaService';

const aplicarOferta = (currentItems, ofertas) => {
    const carrinho = currentItems.map(item => ({ 
        ...item, 
        precoFinal: item.preco
    }));

    const grupos = carrinho.reduce((grupo, item) => {
        if (!grupo[item.produto]) {
            grupo[item.produto] = [];
        }
        grupo[item.produto].push(item);
        return grupo;
    }, {});

    for (const produto in grupos) {
        const itens = grupos[produto];
        const oferta = ofertas.find(o => o.produto === parseInt(produto));

        if (oferta) {
            const { leve, pague } = oferta;

            for (let i = 0; i < itens.length; i++) {
                const posicaoNoBloco = (i % leve) + 1;

                if (posicaoNoBloco > pague) {
                    itens[i].precoFinal = 0;
                }
            }
        }
    }
    return carrinho;
};

function VendaFormPage() {
    const navigate = useNavigate();

    const [orcamentoData, setOrcamentoData] = useState({
        vendedor: '',
        cliente: '',
        preco_total: 0,
    });

    const [itensOrcamento, setItensOrcamento] = useState([]);

    const [currentItem, setCurrentItem] = useState({
        ordem: '',
        produto: '',
        preco: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [ofertas, setOfertas] = useState([]);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const data = await ProdutoService.getAll();
                setProdutos(data);
            } catch (err) {
                console.error("Erro ao buscar produtos:", err);
                setError("Não foi possível carregar a lista de produtos.");
            }
        };

        const fetchOfertas = async () => {
            try {
                const data = await OfertaService.getAll();
                setOfertas(data);
            } catch (err) {
                console.error("Erro ao buscar ofertas:", err);
                setError("Não foi possível carregar as ofertas.");
            }
        };

        fetchProdutos();
        fetchOfertas();
    }, []);

    const handleOrcamentoChange = (e) => {
        const { name, value } = e.target;
        setOrcamentoData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem(prev => {
            let updatedItem = { ...prev, [name]: value };
            if (name === 'produto') {
                const produtoId = parseInt(value);
                const foundProduct = produtos.find(p => p.codigo === produtoId);
                updatedItem.preco = foundProduct ? foundProduct.preco : ''; 
            }
            return updatedItem;
        });
    };

    const handleAddItem = (e) => {
        e.preventDefault();

        if (!currentItem.produto) {
            setError("Preencha o Código do Produto.");
            return;
        }

        if (isNaN(parseFloat(currentItem.preco)) || parseFloat(currentItem.preco) <= 0) {
            setError("Produto não encontrado ou preço inválido. Verifique o código do produto.");
            return;
        }

        setItensOrcamento(prevItems => {
            const nextOrder = prevItems.length + 1;
            return[
            ...prevItems,
            {
                id: Date.now(),
                produto: parseInt(currentItem.produto),
                preco: parseFloat(currentItem.preco),
                ordem: nextOrder,
            }
            ]
        });

        setCurrentItem({ ordem: '', produto: '', preco: '' });
        setError(null);
    };

    const handleRemoveItem = (idToRemove) => {
        setItensOrcamento(prevItems => {
            const updatedItems = prevItems.filter(item => item.id !== idToRemove);
            return updatedItems.map((item, index) => ({
                ...item,
                ordem: index + 1 
            }));

        });
    };

    const aplicaOfertas = useMemo(() => {
        if (itensOrcamento.length === 0) return [];
        
        let carrinhoComOferta = [];

        if (ofertas.length === 0) {
            carrinhoComOferta =  itensOrcamento.map(item => ({
                ...item,
                precoFinal: item.preco 
            }));
        } else {
            carrinhoComOferta = aplicarOferta(itensOrcamento, ofertas);
        }
        return carrinhoComOferta.sort((a, b) => a.ordem - b.ordem);
    }, [itensOrcamento, ofertas]);

    const totalOrcamento = useMemo(() => {
        const total = aplicaOfertas.reduce((soma, item) => soma + item.precoFinal, 0);
        return total;
    }, [aplicaOfertas]);

    useEffect(() => {
        setOrcamentoData(prevData => ({
            ...prevData,
            preco_total: totalOrcamento 
        }));
    }, [totalOrcamento]);

    const handleSaveVenda = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!orcamentoData.vendedor || !orcamentoData.cliente) {
            setError("Preencha o Vendedor e o Cliente.");
            setLoading(false);
            return;
        }

        if (itensOrcamento.length === 0) {
            setError("Adicione pelo menos um item ao orçamento.");
            setLoading(false);
            return;
        }

        try {
            const createdOrcamento = await OrcamentoService.create({ 
                ...orcamentoData,
                preco_total: totalOrcamento
            });
            const orcamentoId = createdOrcamento.codigo;

            for (const item of aplicaOfertas) {
                await ItemOrcamentoService.create({
                    orcamento: orcamentoId,
                    produto: item.produto,
                    preco: item.precoFinal,
                    ordem: item.ordem,
                });
            }

            setSuccessMessage("Venda (Orçamento e Itens) salva com sucesso!");
            setTimeout(() => {
                navigate('/orcamentos');
            }, 2000);
            
        } catch (err) {
            setError(`Erro ao salvar venda: ${err.message}`);
            console.error("Erro ao salvar venda:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="venda-form-container p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Registrar Nova Venda</h2>

            {loading && <p className="text-blue-500">Salvando venda...</p>}
            {error && <p className="error-message text-red-500">{error}</p>}
            {successMessage && <p className="success-message text-green-500">{successMessage}</p>}

            <form onSubmit={handleSaveVenda} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Dados do Orçamento</h3>
                <div className="flex flex-col">
                    <label htmlFor="vendedor" className="mb-1 text-gray-600">Vendedor:</label>
                    <input
                        type="number"
                        id="vendedor"
                        name="vendedor"
                        value={orcamentoData.vendedor}
                        onChange={handleOrcamentoChange}
                        required
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="cliente" className="mb-1 text-gray-600">Cliente:</label>
                    <input
                        type="number"
                        id="cliente"
                        name="cliente"
                        value={orcamentoData.cliente}
                        onChange={handleOrcamentoChange}
                        required
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <h3 className="text-xl font-semibold text-gray-700 mt-6">Itens do Orçamento</h3>
                <div className="item-form p-4 border border-gray-200 rounded-md space-y-3">
                    <h4 className="text-lg font-medium text-gray-700">Adicionar Novo Item</h4>
                    <div className="flex flex-col">
                        <label htmlFor="produto" className="mb-1 text-gray-600">Produto:</label>
                        <input
                            type="number"
                            id="produto"
                            name="produto"
                            value={currentItem.produto}
                            onChange={handleItemChange}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="preco">Preço:</label>
                    <input
                        type="number"
                        id="preco"
                        name="preco"
                        value={currentItem.preco}
                        onChange={handleItemChange}
                        readOnly
                        step="0.01"
                    />
                    </div>
                    <button 
                        type="button"
                        onClick={handleAddItem}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        Adicionar Item
                    </button>
                </div>

                <h4 className="text-lg font-semibold text-gray-700 mt-6">Itens Adicionados</h4>
                {aplicaOfertas.length === 0 ? (
                    <p className="text-gray-600">Nenhum item adicionado ainda.</p>
                ) : (
                    <ul className="list-disc pl-5 space-y-2">
                        {aplicaOfertas.map(item => {
                            const produtoEncontrado = produtos.find(p => p.codigo === item.produto);
                            const nomeProduto = produtoEncontrado ? produtoEncontrado.descricao : `Produto ID: ${item.produto}`;
                            return (
                            <li key={item.ordem} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                                <span className="text-gray-700">
                                    <span className="font-medium">{item.ordem}</span> | Produto: <span className="font-medium">{nomeProduto}</span> | Preço: <span className="font-medium">R$ {item.precoFinal.toFixed(2)}</span>
                                </span>
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors duration-200"
                                >
                                    Remover
                                </button>
                            </li>
                            );
                        })}
                    </ul>
                )}

                <div className="total-display">
                        <label>Valor Total:</label>
                        <span className="font-bold text-lg text-green-700">R$ {totalOrcamento.toFixed(2)}</span>
                    </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button 
                        type="submit" 
                        disabled={loading || itensOrcamento.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar Venda'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/orcamentos')}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default VendaFormPage;