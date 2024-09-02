import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CreateTarefa from './scenes/createTarefa';
import Tarefas from './scenes/tarefas';
import Login from './scenes/login';
import PrivateRoute from './components/privateRoute'; // Importe o componente PrivateRoute

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<CreateTarefa />} />} />
        <Route path="/tarefas" element={<PrivateRoute element={<Tarefas />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;