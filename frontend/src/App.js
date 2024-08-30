import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";


import CreateTarefa from "./scenes/createTarefa";
import Tarefas from "./scenes/tarefas";
import Login from './scenes/login';


function App() {
  return (
    <BrowserRouter >
    
        <Routes>
            <Route path='/' element={<CreateTarefa/>}/>
            <Route path='/tarefas' element={<Tarefas/>}/>
            <Route path='/login' element={<Login/>}/>
        </Routes>

    </BrowserRouter>
  );
}

export default App;
