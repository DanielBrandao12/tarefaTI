import React, { useState, useEffect } from 'react';
import './style.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Menu from '../../components/menu';
import Header from '../../components/header';

import api from '../../services/api';

function Tarefas() {
  const [dates, setDates] = useState([null, null]);
  const [getTarefa, setGetTarefa] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Função para formatar datas sem a parte de hora
  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
  };

  // Função para buscar tarefas do API
  const getTarefaShow = async () => {
    try {
      const response = await api.get('/tarefas');
      const tarefasConcluidas = response.data.filter(item => item.status_tarefa === 'concluída');
      setGetTarefa(tarefasConcluidas);
      setFilteredTasks(tarefasConcluidas); // Inicialmente mostra todas as tarefas concluídas
    } catch (error) {
      console.error('Erro ao buscar tarefas', error);
    }
  };

  // Função para filtrar tarefas com base nas datas selecionadas
  const filterDate = () => {
    if (dates[0] && dates[1]) {
      const [startDate, endDate] = dates;
      const filtered = getTarefa.filter(task => {
        const taskDate = new Date(task.data_concluida).toISOString().split('T')[0];
        return taskDate >= formatDate(startDate) && taskDate <= formatDate(endDate);
      });
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(getTarefa); // Se não houver intervalo de datas definido, mostra todas as tarefas
    }
  };

  // Atualiza a lista de tarefas filtradas sempre que o intervalo de datas ou a lista de tarefas mudam
  useEffect(() => {
    getTarefaShow();
  }, []);

  useEffect(() => {
    filterDate();
   // eslint-disable-next-line
  }, [dates, getTarefa]);

  // Função para lidar com mudanças no DatePicker
  const handleChange = (update) => {
    setDates(update);
  };

  // Função para formatar a data e hora
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };



  return (
    <main className="container-main">
      <Menu />
      <Header>
        <header className='headerTitle'>
          <h1>Lista de Tarefas Concluídas</h1>
        </header>
        <section>
          <div className='container-date'>
            <strong>Selecione um intervalo de data: </strong>
            <DatePicker
            className='datePickerInput'
              selected={dates[0]}
              onChange={handleChange}
              startDate={dates[0]}
              endDate={dates[1]}
              selectsRange
              dateFormat="yyyy-MM-dd"
              placeholderText="Selecione as datas"
            />
        
          </div>
          <div className='container-scroll'>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((item) => (
                <div key={item.id} className='container-tarefa'>
                  <div className='container-info-tarefa'>
                    <div className='containerDatas'>
                      <div>
                        <strong>Nº: </strong>
                        <span>{item.id}</span>
                      </div>
                      <div>
                        <strong>Data e Hora criação: </strong>
                        <span>{formatDateTime(item.data_criacao)}</span>
                      </div>
                      <div>
                        <strong>Data e hora da Conclusão:</strong>
                        <span>{formatDateTime(item.data_concluida)}</span>
                      </div>
                    </div>
                    <div className='info-first'>
                      <div>
                        <strong>Nome: </strong>
                        <span>{item.nome}</span>
                      </div>
                    </div>
                    <div>
                      <strong>Descrição: </strong>
                      <span>{item.tarefa}</span>
                    </div>
                    <div>
                      <strong>Observação: </strong>
                      <span>{item.observacao}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>Nenhuma tarefa encontrada.</div>
            )}
          </div>
        </section>
      </Header>
    </main>
  );
}

export default Tarefas;
