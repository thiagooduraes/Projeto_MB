import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import ProdutosPage from './pages/ProdutosPage';
import ProdutoFormPage from './pages/ProdutoFormPage';
import ClientesPage from './pages/ClientesPage';
import ClienteFormPage from './pages/ClienteFormPage';
import VendedoresPage from './pages/VendedoresPage';
import VendedorFormPage from './pages/VendedorFormPage';
import OfertasPage from './pages/OfertasPage';
import OfertaFormPage from './pages/OfertaFormPage';
import OrcamentosPage from './pages/OrcamentosPage';
import OrcamentoFormPage from './pages/OrcamentoFormPage';
import ItemOrcamentosPage from './pages/ItemOrcamentosPage';
import ItemOrcamentoFormPage from './pages/ItemOrcamentoFormPage';
import VendaFormPage from './pages/VendaFormPage';
import RelatorioProdutosPage from './pages/RelatorioProdutosPage';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/produtos">Produtos</Link></li>
          <li><Link to="/clientes">Clientes</Link></li>
          <li><Link to="/vendedores">Vendedores</Link></li>
          <li><Link to="/ofertas">Ofertas</Link></li>
          <li><Link to="/orcamentos">Orçamentos</Link></li>
          <li><Link to="/itemOrcamentos">Item Orçamentos</Link></li>
          <li><Link to="/vendas/novo">Nova Venda</Link></li>
          <li><Link to="/relatorio-produtos">Relatório de Produtos</Link></li>
        </ul>
      </nav>
      <hr />
      <div className="container"> {}
        <Routes>
          <Route path="/" element={<h2>PROVA DESENVOLVIMENTO DROGARIA</h2>} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/produtos/novo" element={<ProdutoFormPage />} />
          <Route path="/produtos/editar/:id" element={<ProdutoFormPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/clientes/novo" element={<ClienteFormPage />} />
          <Route path="/clientes/editar/:id" element={<ClienteFormPage />} />
          <Route path="/vendedores" element={<VendedoresPage />} />
          <Route path="/vendedores/novo" element={<VendedorFormPage />} />
          <Route path="/vendedores/editar/:id" element={<VendedorFormPage />} />
          <Route path="/ofertas" element={<OfertasPage />} />
          <Route path="/ofertas/novo" element={<OfertaFormPage />} />
          <Route path="/ofertas/editar/:id" element={<OfertaFormPage />} />
          <Route path="/orcamentos" element={<OrcamentosPage />} />
          <Route path="/orcamentos/novo" element={<OrcamentoFormPage />} />
          <Route path="/orcamentos/editar/:id" element={<OrcamentoFormPage />} />
          <Route path="/itemOrcamentos" element={<ItemOrcamentosPage />} />
          <Route path="/itemOrcamentos/novo" element={<ItemOrcamentoFormPage />} />
          <Route path="/itemOrcamentos/editar/:id" element={<ItemOrcamentoFormPage />} />
          <Route path="/vendas/novo" element={<VendaFormPage />} />
          <Route path="/relatorio-produtos" element={<RelatorioProdutosPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App