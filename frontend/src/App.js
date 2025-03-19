import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import Login from './scenes/login';
import Chamado from './scenes/chamado'
import CriarChamado from './scenes/criarChamado';
import PrivateRoute from './components/privateRoute'; // Importe o componente PrivateRoute
import Category from './scenes/category';
import Relatorio from './scenes/relatorio';
import CriarChamadoUser from './scenes/newticket';
import Status from './scenes/status';
import Home from './scenes/home'
import Tickets from './scenes/tickets';
import TicketsClose from './scenes/ticketsClose';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/t/:id_ticket" element={<PrivateRoute element={<Chamado />} />} />
        <Route path="/editarChamado/:id" element={<PrivateRoute element={<CriarChamado />} />} />
        <Route path="/criarChamado" element={<PrivateRoute element={<CriarChamado />} />} />
        <Route path="/category" element={<PrivateRoute element={<Category />} />} />
        <Route path="/relatorio" element={<PrivateRoute element={<Relatorio />} />} />
        <Route path="/newticket" element={<PrivateRoute element={<CriarChamadoUser />} />} />
       
        <Route path="/tickets" element={<PrivateRoute element={<Tickets />} />} />
        <Route path="/ticketsClose" element={<PrivateRoute element={<TicketsClose />} />} />
       
        <Route path="/status" element={<PrivateRoute element={<Status />} />} />

          {/* Redirecionamentos para compatibilidade com rotas antigas */}
          <Route path="/chamado/:id_ticket" element={<Navigate to="/t/:id_ticket" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;