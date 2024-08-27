import React, { useState, useEffect } from 'react';
import './style.css'


import Menu from '../../components/menu'


import api from '../../services/api';

function Tarefas() {


    const [getTarefa, setGetTarefa] = useState([]);




    const getTarefaShow = async () => {
        try {
            const response = await api.get('/tarefas');
            setGetTarefa(response.data.filter((item) => item.status_tarefa == 'concluída'));



        } catch (error) {
            console.error('Erro ao buscar tarefas', error);
        }
    };

    useEffect(() => {
        getTarefaShow();
    }, []);




    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);

        // Formatação da data no formato DD/MM/YYYY
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        const year = date.getFullYear();

        // Formatação da hora no formato HH:MM
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return ` ${day}/${month}/${year} - ${hours}:${minutes}`;
    };

    return (
        <main className="container-main">
            <Menu />
            <section className='container-painel'>
                <header>
                    <h1>Lista de Tarefas Concluídas</h1>
                </header>
                <section>
                    <div className='container-scroll'>
                        {getTarefa.length > 0 ?
                            getTarefa.map((item) => (
                                <div key={item.id} className='container-tarefa'>

                                    <div className='container-info-tarefa'>
                                        <div>

                                            <div className='containerDatas'>
                                            <div>
                                                <strong>Nº: </strong>
                                                <text>{item.id}</text>
                                            </div>
                                                <div>
                                                    <strong>Data e Hora criação: </strong>
                                                    <text>{formatDateTime(item.data_criacao)}</text>
                                                </div>
                                                <div>
                                                    <strong>Data e hora da Conclusão:</strong>
                                                    <text>{formatDateTime(item.data_concluida)}</text>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='info-first'>

                                            <div>
                                                <strong>Nome: </strong>
                                                <text>{item.nome}</text>
                                            </div>
                                        </div>
                                        <div>
                                            <strong>Tarefa: </strong>
                                            <text>{item.tarefa}</text>
                                        </div>
                                        <div>
                                            <strong>Observação: </strong>
                                            <text>{item.observacao}</text>
                                        </div>
                                    </div>
                                </div>
                            )) : <div>Nenhuma tarefa encontrada.</div>}
                    </div>
                </section>
            </section>

        </main>
    );
}

export default Tarefas;
