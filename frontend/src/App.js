import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
import Status from './scenes/status';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<CreateTarefa />} />} />
        <Route path="/tarefas" element={<PrivateRoute element={<Tarefas />} />} />
        <Route path="/t/:id_ticket" element={<PrivateRoute element={<Chamado />} />} />
        <Route path="/chamados" element={<PrivateRoute element={<Chamados />} />} />
        <Route path="/editarChamado/:id" element={<PrivateRoute element={<CriarChamado />} />} />
        <Route path="/criarChamado" element={<PrivateRoute element={<CriarChamado />} />} />
        <Route path="/category" element={<PrivateRoute element={<Category />} />} />
        <Route path="/relatorio" element={<PrivateRoute element={<Relatorio />} />} />
        <Route path="/newticket" element={<PrivateRoute element={<CriarChamadoUser />} />} />
        <Route path="/relatorioInventario" element={<PrivateRoute element={<RelatorioInventario />} />} />
        <Route path="/status" element={<PrivateRoute element={<Status />} />} />

          {/* Redirecionamentos para compatibilidade com rotas antigas */}
          <Route path="/chamado/:id_ticket" element={<Navigate to="/t/:id_ticket" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;