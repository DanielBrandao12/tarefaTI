import React, { useState } from 'react';
import PaginaPadrao from '../../components/paginaPadrao';
import Card from '../../components/card';
import api from '../../services/api';

function RelatorioInventario() {
  const [programasJSON, setProgramasJSON] = useState([]);
  const [items, setItems] = useState([]);
  const [maqs, setMaqs] = useState([]);
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null); // Estado para armazenar a máquina selecionada

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
    console.log(novoJSON);
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

  // Função para consultar a API com os programas e o ID da máquina
  const consultarAPI = async () => {
    if (!maquinaSelecionada) {
      alert('Por favor, selecione uma máquina antes de consultar.');
      return;
    }

    try {
      // Faz a requisição POST enviando programasJSON no corpo da requisição
      const response = await api.post('/relatorioInventario/consultaSoft', {
        id: maquinaSelecionada, // Envia o id da máquina selecionada
        programas: programasJSON // Envia o array de softwares no corpo
      });

      console.log('Resposta da API:', response.data);
      setItems(response.data);
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
      console.error('Erro ao adicionar itens à API:', error);
    }
  };

  // Função para buscar a lista de máquinas
  const getMaquinas = async () => {
    try {
      const maquinas = await api.get('/maquinas/');
      console.log('Respota da API: ', maquinas.data);
      setMaqs(maquinas.data);
    } catch (error) {
      console.error('Erro ao tentar consultar máquinas!', error);
    }
  };

  return (
    <PaginaPadrao>
      <Card>
        <div>
          <h1>Programas Instalados</h1>
          <input type="file" onChange={handleFileChange} />

          <div>
            <label htmlFor="maquina-select">Selecione uma máquina:</label>
            <select
              id="maquina-select"
              onChange={(e) => setMaquinaSelecionada(e.target.value)}
              value={maquinaSelecionada}
            >
              <option value="">Selecione uma máquina</option>
              {maqs.map((maquina, index) => (
                <option key={index} value={maquina.id}>
                  {maquina.nome_maquina}
                </option>
              ))}
            </select>
          </div>

          <button onClick={consultarAPI}>Consultar API</button>
          <button onClick={addItem}>Adicionar</button>
          <button onClick={getMaquinas}>Carregar Máquinas</button>

        
        </div>
      </Card>
    </PaginaPadrao>
  );
}

export default RelatorioInventario;
