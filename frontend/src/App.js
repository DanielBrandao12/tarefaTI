import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CreateTarefa from './scenes/createTarefa';
import Tarefas from './scenes/tarefas';
import Login from './scenes/login';
import Chamado from './scenes/chamado'
import CriarChamado from './scenes/criarChamado';
import PrivateRoute from './components/privateRoute'; // Importe o componente PrivateRoute

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<CreateTarefa />} />} />
        <Route path="/tarefas" element={<PrivateRoute element={<Tarefas />} />} />
        <Route path="/chamado" element={<PrivateRoute element={<Chamado />} />} />
        <Route path="/criarChamado" element={<PrivateRoute element={<CriarChamado />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;