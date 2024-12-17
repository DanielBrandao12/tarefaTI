import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CreateTarefa from './scenes/createTarefa';
import Tarefas from './scenes/tarefas';
import Login from './scenes/login';
import Chamado from './scenes/chamado'
import Chamados from './scenes/chamados';
import CriarChamado from './scenes/criarChamado';
import PrivateRoute from './components/privateRoute'; // Importe o componente PrivateRoute
import Category from './scenes/category';
import Relatorio from './scenes/relatorio';
import CriarChamadoUser from './scenes/newticket';
import RelatorioInventario from './scenes/relatorioInventario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<CreateTarefa />} />} />
        <Route path="/tarefas" element={<PrivateRoute element={<Tarefas />} />} />
        <Route path="/chamado/:id_ticket" element={<PrivateRoute element={<Chamado />} />} />
        <Route path="/chamados" element={<PrivateRoute element={<Chamados />} />} />
        <Route path="/criarChamado/:id" element={<PrivateRoute element={<CriarChamado />} />} />
        <Route path="/criarChamado" element={<PrivateRoute element={<CriarChamado />} />} />
        <Route path="/category" element={<PrivateRoute element={<Category />} />} />
        <Route path="/relatorio" element={<PrivateRoute element={<Relatorio />} />} />
        <Route path="/newticket" element={<PrivateRoute element={<CriarChamadoUser />} />} />
        <Route path="/relatorioInventario" element={<PrivateRoute element={<RelatorioInventario />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;