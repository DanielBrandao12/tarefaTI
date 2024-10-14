import React, { useState, useEffect } from 'react';

import { confirmAlert } from 'react-confirm-alert'; // Importa a função confirmAlert
import './styleAlert.css';
import api from '../../services/api';
import './style.css';
import Menu from '../../components/menu';
import Header from '../../components/header';
import ModalConfirm from '../../components/modalConfirm';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import PaginaPadrao from '../../components/paginaPadrao';

function CreateTarefa() {

    const [prioridadeNew, setPrioridadeNew] = useState('')
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [changeCreate, setChangeCreate] = useState('none'); // Ajuste inicial
    const [nome, setNome] = useState('');
    const [tarefa, setTarefa] = useState('');
    const [nivel_prioridade, setNivelPrioridade] = useState('');
    const [observacao, setObservacao] = useState('');
    const [getTarefa, setGetTarefa] = useState([]);
    const [alertConfirm, setAlertConfirm] = useState('')
    const [msg, setMsg] = useState('')
    const [idUser, setIdUser] =useState('')
    const [userLogado, setUserLogado] = useState('')




    useEffect(() => {
        getTarefaShow();
        handleToken()
      
    }, []);

    useEffect(() => {
        filterDados()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getTarefa, prioridadeNew]);
    const handleToken = () =>{


        // Recuperar o token do cookie
    const token = Cookies.get('token'); // 'token' é o nome do cookie onde o token está armazenado
    
 
    if (token) {
        try {
          const decodedToken = jwtDecode(token);
        
          setIdUser(decodedToken.id_usuario)
          setUserLogado(decodedToken.nome_completo)
       
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
        }
      }
    }


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





    const createTarefa = async (event) => {
     
        event.preventDefault()
       
        try {
            await api.post('/tarefas/create', {
                nome:userLogado,
                tarefa,
                nivel_prioridade,
                observacao,
                idUser
            });

            // Após criar a tarefa, recarregar a lista de tarefas
            await getTarefaShow();


            // Limpar campos
            setNome('');
            setTarefa('');
            setNivelPrioridade('');
            setObservacao('');
            toggleForm('none');
            
       
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
                    onClick: () => toggleForm('none')
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


    const filterDados = () => {
        if (!prioridadeNew) {
            setDadosFiltrados(getTarefa); // Mostra todos os itens
        } else {
            const filteredTasks = getTarefa.filter((item) => item.nivel_prioridade === prioridadeNew);
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

          // Função para formatar a tarefa com quebras de linha
          const formatTarefa = (tarefa) => {
            if (!tarefa) return '';
        
            // Substitui ':', '.' e ';' por uma quebra de linha e adiciona uma quebra de linha extra para a legibilidade
            return tarefa.split(/(:|\.|;)/).map((part, index) => (
              // Ignora partes vazias e não exibe quebras de linha consecutivas
              part.trim() === '' ? null : (
                <React.Fragment key={index}>
                  {part}
                  {(part === ':' || part === '.' || part === ';') && <br />}
                </React.Fragment>
              )
            ));
          };
    

    return (
        <PaginaPadrao>
      

            <div className='container-form' style={{ display: changeCreate }}>

                <div className='container-form-create-tarefa'>
                    <header>
                        <button className='button-close' onClick={() => toggleForm('none')}>X</button>
                    </header>

                    <form onSubmit={id ? confirmaEdit : createTarefa}>
                        <input
                            placeholder='Digite seu nome'
                            className='inputs'
                            value={id ? nome : userLogado}
                            onChange={(event)=>setNome(event.target.value)}
                          
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
                            onChange={(event) => (setObservacao(event.target.value))}
                        />
                        <div className='container-button-form'>
                        <button className="button-padrao" type="submit">Salvar</button>
                        </div>
                    </form>

                </div>

            </div>

            <ModalConfirm  value={msg} container={alertConfirm}/>
        </PaginaPadrao>
    );
}

export default CreateTarefa;
