import React, { useState, useEffect } from 'react';

import { confirmAlert } from 'react-confirm-alert'; // Importa a função confirmAlert
import './styleAlert.css';
import api from '../../services/api';
import './style.css';
import Menu from '../../components/menu';
import Painel from '../../components/painel';
import ModalConfirm from '../../components/modalConfirm';

function CreateTarefa() {


    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);

        // Formatação da data no formato DD/MM/YYYY
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        const year = date.getFullYear();

        // Formatação da hora no formato HH:MM
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return ` ${day}/${month}/${year} --- ${hours}:${minutes}`;
    };

    const [prioridadeNew, setPrioridadeNew] = useState()
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [changeCreate, setChangeCreate] = useState('none'); // Ajuste inicial
    const [nome, setNome] = useState('');
    const [tarefa, setTarefa] = useState('');
    const [nivel_prioridade, setNivelPrioridade] = useState('');
    const [observacao, setObservacao] = useState('');
    const [getTarefa, setGetTarefa] = useState([]);
    const [alertConfirm, setAlertConfirm] = useState('')
    const [msg, setMsg] = useState()

    const [erroInput, setErroInput] = useState()

    const toggleForm = (value) => {

        setChangeCreate(value);
        setId('')
        setNome('');
        setTarefa('');

        setObservacao('');

    };

    const getTarefaShow = async () => {
        try {
            const response = await api.get('/tarefas');
            setGetTarefa(response.data.filter((item) => item.status_tarefa === 'em aberto'));



        } catch (error) {
            console.error('Erro ao buscar tarefas', error);
        }
    };

    useEffect(() => {
        getTarefaShow();
    }, []);

    useEffect(() => {
        filterDados(prioridadeNew);
    }, [getTarefa, prioridadeNew]);



    const createTarefa = async (event) => {
        event.preventDefault()
        try {
            await api.post('/tarefas/create', {
                nome,
                tarefa,
                nivel_prioridade,
                observacao
            });

            // Após criar a tarefa, recarregar a lista de tarefas
            await getTarefaShow();


            // Limpar campos
            setNome('');
            setTarefa('');
            setNivelPrioridade('');
            setObservacao('');
            toggleForm('none');
            
            console.log('oidd')
            alertCon ('Tarefa criada com sucesso!')

              
        } catch (error) {
            console.error('Erro ao criar tarefa', error);
        }
    };

    const [id, setId] = useState()
    const editTarefa = async (id, nome, tarefa, prioridade, observacao) => {
        toggleForm('flex')
        setId(id)
        setNome(nome)
        setTarefa(tarefa)
        setNivelPrioridade(prioridade)
        setObservacao(observacao)

    }


    const saveEdit = async () => {

        try {

            await api.put(`/tarefas/edit/${id}`, {
                nome,
                tarefa,
                nivel_prioridade,
                observacao
            });

            // Após criar a tarefa, recarregar a lista de tarefas
            await getTarefaShow();

            // Limpar campos
            setId('')
            setNome('');
            setTarefa('');
            setNivelPrioridade('');
            setObservacao('');
            toggleForm('none');
        
            alertCon('Edição feita com sucesso!')

        } catch (error) {
            console.error('Erro ao editar tarefa', error);
            alertCon('Erro ao editar, faça alguma alteração!')
        }
    }
    const confirmaEdit = (event) => {
        event.preventDefault()
        confirmAlert({
            title: 'Confirmação',
            message: 'Deseja editar a tarefa?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: saveEdit
                },
                {
                    label: 'Não',
                    onPress: () => toggleForm('none')
                }
            ]
        });
    }

    const confirmaCloncuir = (id) => {

        confirmAlert({
            title: 'Confirmação',
            message: 'Deseja marcar tarefa como concluída?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => (concluirTarefa(id))
                },
                {
                    label: 'Não',
                    onPress: () => toggleForm('none')
                }
            ]
        });
    }

    const concluirTarefa = async (id) => {

        try {



            await api.put(`/tarefas/editC/${id}`);


            // Após criar a tarefa, recarregar a lista de tarefas
            await getTarefaShow();


            alertCon('Tarefa Concluída!')

        } catch (error) {
            console.error('Erro ao concluir tarefa', error);

        }
    }


    const filterDados = (nivelPrioridade) => {
        if (!nivelPrioridade) {
            setDadosFiltrados(getTarefa); // Mostra todos os itens
        } else {
            const filteredTasks = getTarefa.filter((item) => item.nivel_prioridade == nivelPrioridade);
            setDadosFiltrados(filteredTasks); // Atualiza o estado com os itens filtrados
        }
    };

    const alertCon = (msgF) => {
      

            setMsg(msgF);
            setAlertConfirm('flex');
             setTimeout(() => {
                setMsg('')
                setAlertConfirm('none');
            }, 2000); // 10 seconds
   
    };


    return (
        <>
            <main className="container-main">
                <Menu />
                <Painel >
                    <header className='headerButton'>
                        <button className='button-padrao' onClick={() => toggleForm('flex')}>Criar Tarefa</button>
                    </header>
                    <section className='sectionPainel'>
                        <div className='container-filter'>
                            <div className='title-filter'>
                                <h1>Lista de Tarefas</h1>

                            </div>
                            <div className='filter'>
                                <strong>Exibir: </strong>
                                <select className='inputs' onChange={(event) => setPrioridadeNew(event.target.value)}>
                                    <option value="">Todos</option>
                                    <option value="Prioridade Alta">Prioridade Alta</option>
                                    <option value="Prioridade Média">Prioridade Média</option>
                                    <option value="Prioridade Baixa">Prioridade Baixa</option>
                                </select>
                            </div>
                        </div>
                        <div className='container-scroll'>
                            {dadosFiltrados.length > 0 ?
                                dadosFiltrados.map((item) => (
                                    <div key={item.id} className='container-tarefa'>

                                        <div className='container-tarefa-check'>
                                            <div className='divTitle'>
                                                {
                                                    item.nivel_prioridade === 'Prioridade Alta' &&
                                                     <h2 className='textPrioridade' style={{color: 'red'}} >{item.nivel_prioridade}</h2> 
                                                }
                                                {
                                                    item.nivel_prioridade === 'Prioridade Média' &&
                                                     <h2 className='textPrioridade' style={{color: '#31759A'}} >{item.nivel_prioridade}</h2> 
                                                }
                                                {
                                                    item.nivel_prioridade === 'Prioridade Baixa' &&
                                                     <h2 className='textPrioridade' style={{color: 'green'}} >{item.nivel_prioridade}</h2> 
                                                }

                                            </div>
                                            <text onClick={() => editTarefa(item.id, item.nome, item.tarefa, item.nivel_prioridade, item.observacao)}>Editar</text>
                                            <text onClick={() => confirmaCloncuir(item.id)}>Concluir</text>
                                        </div>
                                        <div className='container-info-tarefa'>
                                            <div className='numeroTarefa'>
                                                <div>
                                                    <strong>Nº: </strong>
                                                    <text>{item.id}</text>

                                                </div>
                                                <div>
                                                    <strong>Data e Hora criação: </strong>
                                                    <text>{formatDateTime(item.data_criacao)}</text>
                                                </div>
                                            </div>
                                            <div className='info-first'>

                                                <div>
                                                    <strong>Nome: </strong>
                                                    <text>{item.nome}</text>
                                                </div>


                                            </div>
                                            <div>
                                                <strong>Descrição: </strong>
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
                </Painel>
            </main>

            <div className='container-form' style={{ display: changeCreate }}>

                <div className='container-form-create-tarefa'>
                    <header>
                        <button className='button-close' onClick={() => toggleForm('none')}>X</button>
                    </header>

                    <form onSubmit={id ? confirmaEdit : createTarefa}>
                        <input
                            placeholder='Digite seu nome'
                            className='inputs'
                            value={nome}
                            onChange={(event) => (setNome(event.target.value))}

                            required
                        />
                        <textarea
                            placeholder='Descrição'
                            rows="5"
                            cols="30"
                            className='inputs'
                            value={tarefa}
                            onChange={(event) => (setTarefa(event.target.value))}

                            required

                        />
                        <select

                            name='Nível de prioridade'
                            className='inputs'
                            value={nivel_prioridade}
                            onChange={(event) => (setNivelPrioridade(event.target.value))}

                            required
                        >
                            <option value='' disabled>Nível de prioridade</option>
                            <option value='Prioridade Baixa'>Baixa</option>
                            <option value='Prioridade Média'>Média</option>
                            <option value='Prioridade Alta'>Alta</option>
                        </select>
                        <input
                            placeholder='Observação'
                            className='inputs'
                            value={observacao}
                            onChange={(event) => setObservacao(event.target.value)}
                        />
                        <div className='container-button-form'>
                            <button className='button-padrao' type='submit'>Salvar</button>
                        </div>
                    </form>

                </div>

            </div>

            <ModalConfirm  value={msg} container={alertConfirm}/>
        </>
    );
}

export default CreateTarefa;
