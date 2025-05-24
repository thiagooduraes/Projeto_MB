import React, { useState, useEffect, useMemo } from 'react';
import { ItemOrcamentoService } from '../services/ItemOrcamentoService';
import { ProdutoService } from '../services/ProdutoService';
import { format } from 'date-fns';

function RelatorioProdutosPage() {
    const [produtos, setProdutos] = useState([]);
    const [relatorioAgrupado, setRelatorioAgrupado] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [filterProdutoCodigo, setFilterProdutoCodigo] = useState('');
    const [filterDataInicial, setFilterDataInicial] = useState('');
    const [filterDataFinal, setFilterDataFinal] = useState('');

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const data = await ProdutoService.getAll();
                setProdutos(data);
            } catch (err) {
                console.error("Erro ao buscar produtos para filtro:", err);
                setError("Não foi possível carregar a lista de produtos.");
            }
        };
        fetchProdutos();
    }, []);

    const fetchRelatorio = async () => {
        setLoading(true);
        setError(null);
        try {
            const filters = {
                produtoCodigo: filterProdutoCodigo ? parseInt(filterProdutoCodigo) : undefined,
                dataInicial: filterDataInicial,
                dataFinal: filterDataFinal,
            };
            const data = await ItemOrcamentoService.getFilteredItems(filters);
            setRelatorioAgrupado(data);
        } catch (err) {
            console.error("Erro ao gerar relatório:", err);
            setError("Não foi possível gerar o relatório. Verifique os filtros ou a conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = (e) => {
        e.preventDefault();
        fetchRelatorio();
    };

    const totalGeralOrcado = useMemo(() => {
        return relatorioAgrupado.reduce((sum, orcamento) => sum + orcamento.total_orcamento, 0);
    }, [relatorioAgrupado]);

    return (
        <div className="relatorio-container p-6 bg-white shadow-md rounded-lg mx-auto max-w-4xl mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Relatório de Produtos Orçados</h2>

            <form onSubmit={handleGenerateReport} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="filterProduto" className="block text-gray-700 text-sm font-bold mb-2">
                        Produto:
                    </label>
                    <select
                        id="filterProduto"
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={filterProdutoCodigo}
                        onChange={(e) => setFilterProdutoCodigo(e.target.value)}
                    >
                        <option value="">-- Selecione um produto (todos) --</option>
                        {produtos.map(produto => (
                            <option key={produto.codigo} value={produto.codigo}>
                                {produto.nome} (Cód: {produto.codigo})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="filterDataInicial" className="block text-gray-700 text-sm font-bold mb-2">
                        Data Inicial:
                    </label>
                    <input
                        type="date"
                        id="filterDataInicial"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={filterDataInicial}
                        onChange={(e) => setFilterDataInicial(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="filterDataFinal" className="block text-gray-700 text-sm font-bold mb-2">
                        Data Final:
                    </label>
                    <input
                        type="date"
                        id="filterDataFinal"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={filterDataFinal}
                        onChange={(e) => setFilterDataFinal(e.target.value)}
                    />
                </div>
                <div className="md:col-span-3 flex justify-end mt-2">
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Gerando...' : 'Gerar Relatório'}
                    </button>
                </div>
            </form>

            {loading && <p className="text-blue-600 text-center text-lg mt-4">Carregando relatório...</p>}
            {error && <p className="text-red-600 text-center text-lg mt-4">{error}</p>}

            {!loading && !error && relatorioAgrupado.length > 0 && (
                <div className="space-y-8">
                    {relatorioAgrupado.map(orcamento => (
                        <div key={orcamento.codigo} className="border border-blue-200 rounded-lg shadow-md p-4 bg-blue-50">
                            <h3 className="text-xl font-bold text-blue-800 mb-3">
                                Orçamento #{orcamento.codigo} 
                                <span className="ml-4 text-base font-normal text-blue-700">
                                     - {format(new Date(orcamento.data), 'dd/MM/yyyy')}
                                </span>
                            </h3>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100 text-left text-gray-600 text-sm font-semibold uppercase tracking-wider">
                                            <th className="py-2 px-3 border-b">Ordem</th>
                                            <th className="py-2 px-3 border-b">Produto (Cód)</th>
                                            <th className="py-2 px-3 border-b text-right">Preço</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orcamento.itens.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
                                                <td className="py-2 px-3">{item.ordem}</td>
                                                <td className="py-2 px-3">{item.produto_nome} ({item.produto_codigo})</td>
                                                <td className="py-2 px-3 text-right">R$ {item.preco.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="mt-3 p-3 bg-blue-100 flex justify-between items-center text-blue-800 font-bold text-lg rounded-md">
                                <span>Total deste Orçamento:</span>
                                <span>R$ {orcamento.total_orcamento.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 p-5 bg-green-600 text-white font-extrabold text-2xl rounded-lg shadow-xl flex justify-between items-center">
                        <span>TOTAL GERAL ORÇADO:</span>
                        <span>R$ {totalGeralOrcado.toFixed(2)}</span>
                    </div>
                </div>
            )}

            {!loading && !error && relatorioAgrupado.length === 0 && (
                <p className="text-gray-600 text-center mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">Nenhum resultado encontrado para os filtros selecionados.</p>
            )}
        </div>
    );
}

export default RelatorioProdutosPage;