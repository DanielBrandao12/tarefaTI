import React, { useState } from 'react';
import PaginaPadrao from '../../components/paginaPadrao';
import Card from '../../components/card';
import api from '../../services/api';

function RelatorioInventario() {
  const [programasJSON, setProgramasJSON] = useState([]);
  const [items, setItems]  = useState([])
  // Função para ler o arquivo
  const lerArquivo = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        const text = event.target.result;
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Função para processar os dados do arquivo e adicionar ao estado
  const adicionarAoJSON = (data) => {
    const linhas = data.split('\n').slice(1); // Ignora cabeçalho
    const novoJSON = [];

    linhas.forEach((linha) => {
      const [name, vendor, version] = linha.trim().split(/\s{2,}/); // Divide pelo espaço entre colunas

      if (name && vendor && version) {
        // Adiciona ao array sem duplicatas
        const existe = novoJSON.some(programa => programa.name === name);
        if (!existe) {
          novoJSON.push({ name, vendor, version });
        }
      }
    });
    console.log(novoJSON)
    setProgramasJSON(novoJSON);
  };

  // Evento de mudança do input de arquivo
  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Seleciona apenas um arquivo
    if (file) {
      const data = await lerArquivo(file);
      adicionarAoJSON(data);
    }
  };


// Exemplo de como usar programasJSON em uma consulta com api.post
const consultarAPI = async () => {
  try {
    // Faz a requisição POST enviando programasJSON no corpo da requisição
    const response = await api.post('/relatorioInventario/consultaSoft', {
      id: 1, // Envia o id da máquina
      programas: programasJSON // Envia o array de softwares no corpo
    });

    console.log('Resposta da API:', response.data);
      setItems(response.data)
   
  } catch (error) {
    console.error('Erro ao consultar a API:', error);
  }
};

const addItem = async () => {
  try {
    // Faz a requisição POST enviando programasJSON no corpo da requisição
    const response = await api.post('/relatorioInventario/', {
        items
    });

    console.log('Resposta da API:', response.data);
    
   
  } catch (error) {
    console.error('Erro ao consultar a API:', error);
  }
};

//criar algo para trazer lista das maquinas e pega o id da maquina selecionada

  return (
    <PaginaPadrao>
      <Card>
        <div>
          <h1>Programas Instalados</h1>
          <input type="file" onChange={handleFileChange} />
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Fornecedor</th>
                <th>Versão</th>
              </tr>
            </thead>
            <tbody>
              {programasJSON.map((programa, index) => (
                <tr key={index}>
                  <td>{programa.name}</td>
                  <td>{programa.vendor}</td>
                  <td>{programa.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>JSON Gerado:</h2>
          <pre>{JSON.stringify(programasJSON, null, 2)}</pre>
          <button onClick={consultarAPI}>Consultar API</button>
          <button onClick={addItem}>add</button>
        </div>
      </Card>
    </PaginaPadrao>
  );
}

export default RelatorioInventario;
