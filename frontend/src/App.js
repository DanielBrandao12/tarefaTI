import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";


import CreateTarefa from "./scenes/createTarefa";
import Tarefas from "./scenes/tarefas";


function App() {
  return (
    <BrowserRouter >
    
        <Routes>
            <Route path='/' element={<CreateTarefa/>}/>
            <Route path='/tarefas' element={<Tarefas/>}/>
        </Routes>

    </BrowserRouter>
  );
}

export default App;
