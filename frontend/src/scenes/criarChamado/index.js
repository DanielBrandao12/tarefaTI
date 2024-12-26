import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import styles from './style.module.css';
import stylesGlobal from '../../styles/styleGlobal.module.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import Card from '../../components/card';
import PaginaPadrao from '../../components/paginaPadrao';
import Popup from '../../components/popup';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import api from '../../services/api';

function CriarChamado() {
  const id_ticket = useParams(); // Captura o parâmetro da URL
  const [ticket, setTicket] = useState('')
  const [tarefa, setTarefa] = useState('');
  const [listaTarefa, setListaTarefa] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [status, setStatus] = useState([]);
  const [users, setUsers] = useState([]);
  const [idCategoria, setIdCategoria] = useState('');
  const [nomeReq, setNomeReq] = useState('');
  const [emailReq, setEmailReq] = useState('');
  const [assunto, setAssunto] = useState('');
  const [descri, setDescri] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [idStatus, setIdStatus] = useState('');
  const [atribuir, setAtribuir] = useState('');
  const [idUser, setIdUser] = useState('');
  const [message, setMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [error, setError] = useState({
    idCategoria: false,
    nomeReq: false,
    emailReq: false,
    assunto: false,
    descri: false,
    prioridade: false,
    idStatus: false,
    atribuir: false,

  });
  // Decodificar o token e carregar dados do usuário
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIdUser(decoded);
        console.log('Usuário decodificado:', decoded);
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }, []);

  // Buscar todas as categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/categoria');
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

  // Buscar todos os status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/status');
        setStatus(response.data);
      } catch (error) {
        console.error('Erro ao buscar Status:', error);
      }
    };

    fetchStatus();
  }, []);

  // Buscar todos os usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  const createTicket = async () => {
    if (!idCategoria || !nomeReq || !assunto || !emailReq || !descri || !prioridade || !idStatus || !atribuir) {
      setError({
        idCategoria: !idCategoria,
        nomeReq: !nomeReq,
        emailReq: !emailReq,
        assunto: !assunto,
        descri: !descri,
        prioridade: !prioridade,
        idStatus: !idStatus,
        atribuir: !atribuir,
      })
      //setMessage('Por favor, preencha todos os campos obrigatórios!');
      //setPopupVisible(true);
      return;
    }

    try {
      const token = Cookies.get('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await api.post(
        '/tickets/createTicket',
        {
          idCategoria,
          nomeReq,
          emailReq,
          assunto,
          descri,
          prioridade,
          listaTarefa,
          idStatus,
          atribuir,
          id_usuario: idUser.id
        },
        { headers }
      );

      if (response.status === 201) {
        setMessage('Chamado criado com sucesso!');
        setPopupVisible(true);
        clearStates()
      } else {
        console.error('Erro ao criar o chamado:', response.data);
        setMessage('Ocorreu um problema ao criar o chamado.');
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      setMessage('Erro ao criar o chamado. Tente novamente mais tarde.');
      setPopupVisible(true);
    }
  };
  const updateTicket = async () => {
 
  };
  useEffect(() => {
    const getTicketId =  async () =>{
      
      try {
      const response = await api.get(`/tickets/${id_ticket.id}`)

      setTicket(response.data.ticket)
        console.log(ticket)
        setIdCategoria(ticket.id_categoria)
        setNomeReq(ticket.nome_requisitante)
        setEmailReq(ticket.email)
        setAssunto(ticket.assunto)
        setDescri(ticket.descricao)
        //adicionar o esquema da lista de tarefa!!
        setPrioridade(ticket.nivel_prioridade)
        setIdStatus(ticket.id_status)
        setAtribuir(ticket.atribuido_a)
      } catch (error) {
        console.error('Erro ao buscar ticket:', error);
      }
    };

    getTicketId();
  
  }, [ticket]);


  const addItemLista = () => {
    if (!tarefa.trim()) {
      setMessage('A tarefa não pode estar vazia!');
      setPopupVisible(true);
      return;
    }

    setListaTarefa((prevLista) => [...prevLista, tarefa]);
    setTarefa(''); // Limpa o campo de entrada após adicionar a tarefa
  };

  const removeItemLista = (indexToRemove) => {
    setListaTarefa((prevLista) => prevLista.filter((_, index) => index !== indexToRemove));
  };

  const closePopup = () => setPopupVisible(false);

  const clearStates = () => {

    setIdCategoria('')
    setNomeReq('')
    setEmailReq('')
    setAssunto('')
    setDescri('')
    setPrioridade('')
    setListaTarefa([])
    setIdStatus('')
    setAtribuir('')
  }
  return (
    <PaginaPadrao>
      <Card>
        <h1 className={styles.titleFormChamado}>{id_ticket.id ? 'Editar Chamado' : 'Abrir Chamado'}</h1>
        <form className={styles.formChamado}>
          <div className={styles.fieldGroup}>
            <label>Categoria:</label>
            <div className={stylesGlobal.containerMessageInput}>
              <select
                name="Categoria"
                className={[stylesGlobal.selectChamado, error.idCategoria && stylesGlobal.errorInput,].join(' ')}
                value={idCategoria}
                onChange={(e) => {
                  setIdCategoria(e.target.value)
                  setError((prev) => ({ ...prev, idCategoria: false }))
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione Categoria
                </option>
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
              {error.idCategoria && (
                <span className={stylesGlobal.errorMessage}>Campo obrigatório</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Nome Requisitante:</label>
            <div className={stylesGlobal.containerMessageInput}>
              <input
                type="text"
                placeholder="Digite o nome"

                className={[stylesGlobal.inputTextChamado, error.nomeReq && stylesGlobal.errorInput,].join(' ')}
                value={nomeReq}
                onChange={(e) => {
                  const value = e.target.value
                  setNomeReq(value === "" ? "" : value)
                  setError((prev) => ({ ...prev, nomeReq: value === "" }))
                }}
              />

              {error.nomeReq && (
                <span className={stylesGlobal.errorMessage}>Campo obrigatório</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Email Requisitante:</label>
            <div className={stylesGlobal.containerMessageInput}>


              <input
                type="email"
                placeholder="Digite o email"
                className={[
                  stylesGlobal.inputTextChamado,
                  error.emailReq && stylesGlobal.errorInput,
                ].join(" ")}
                value={emailReq}
                onChange={(e) => {
                  const value = e.target.value;
                  const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expressão regular para validação de e-mail
                  const isValid = emailRegex.test(value);
                  setEmailReq(value);
                  setError((prev) => ({
                    ...prev,
                    emailReq: value === "" || !isValid,
                  }));
                }}
              />
              {error.emailReq && (
                <span className={stylesGlobal.errorMessage}>Campo obrigatório. Por favor, insira um endereço de e-mail válido.</span>

              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Assunto:</label>
            <div className={stylesGlobal.containerMessageInput}>

              <input
                type="text"
                placeholder="Assunto"
                className={[stylesGlobal.inputTextChamado, error.assunto && stylesGlobal.errorInput,].join(' ')}
                value={assunto}
                onChange={(e) => {
                  const value = e.target.value
                  setAssunto(value === "" ? "" : value)
                  setError((prev) => ({ ...prev, assunto: value === "" }))
                }}
              />

              {error.assunto && (
                <span className={stylesGlobal.errorMessage}>Campo obrigatório</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Descrição:</label>
            <div className={stylesGlobal.containerMessageInput}>

              <ReactQuill
                className={styles.reactQuill}
                value={descri}
                onChange={(value) => {
                  setDescri(value === "" ? "" : value)
                  setError((prev) => ({ ...prev, descri: value === "" }))

                }}
              />
              {error.descri && (
                <span className={stylesGlobal.errorMessage}>Campo obrigatório</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Criar Lista de Tarefas:</label>
            <div className={stylesGlobal.containerInputAdd}>
              <input
                type="text"
                placeholder="Digite a tarefa"
                className={stylesGlobal.inputTextChamado}
                value={tarefa}
                onChange={(e) => setTarefa(e.target.value)}
              />
              <div className={stylesGlobal.containerIconPlus}>
                <FontAwesomeIcon
                  icon={faPlus}
                  className={stylesGlobal.positionIconPlus}
                  onClick={addItemLista}
                />
              </div>
            </div>
            <div>
              {listaTarefa.length > 0 ? (
                <div className={stylesGlobal.itemLista}>
                  {listaTarefa.map((item, index) => (
                    <div key={index} className={stylesGlobal.itemListaItem}>
                      <span>{item}</span>
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={stylesGlobal.removeIcon}
                        onClick={() => removeItemLista(index)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <span>Nenhuma tarefa adicionada.</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Prioridade:</label>
            <div className={stylesGlobal.containerMessageInput}>



              <select
                name="Nível de prioridade"
                className={[stylesGlobal.selectChamado, error.prioridade && stylesGlobal.errorInput,].join(' ')}
                value={prioridade}
                onChange={(e) => {
                  setPrioridade(e.target.value)
                  setError((prev) => ({ ...prev, prioridade: false }))
                }}
              >
                <option value="" disabled>
                  Nível de prioridade
                </option>
                <option value="Prioridade Baixa">Baixa</option>
                <option value="Prioridade Média">Média</option>
                <option value="Prioridade Alta">Alta</option>
              </select>

              {error.prioridade && (
                <span className={stylesGlobal.errorMessage}>Campo obrigatório</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Status:</label>
            <div className={stylesGlobal.containerMessageInput}>
              <select
                name="Status"

                className={[stylesGlobal.selectChamado, error.idStatus && stylesGlobal.errorInput,].join(' ')}
                value={idStatus}
                onChange={(e) => {
                  setIdStatus(e.target.value)
                  setError((prev) => ({ ...prev, idStatus: false }))
                }}
                defaultValue=''
              >
                <option value="" disabled>
                  Selecione Status
                </option>
                {status.map((item) => (
                  <option key={item.id_status} value={item.id_status}>
                    {item.nome}
                  </option>
                ))}
              </select>
              {error.idStatus && (
                <span className={stylesGlobal.errorMessage}>Campo obrigatório</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Atribuir para:</label>
            <div className={stylesGlobal.containerMessageInput}>
              <select
                name="Atribuir para"

                className={[stylesGlobal.selectChamado, error.atribuir && stylesGlobal.errorInput,].join(' ')}
                value={atribuir}
                onChange={(e) => {
                  setAtribuir(e.target.value)
                  setError((prev) => ({ ...prev, atribuir: false }))
                }}
                defaultValue=''
              >
                <option value="" disabled>
                  Atribuir para
                </option>
                {users.map((item) => (
                  <option key={item.id_usuario} value={item.id_usuario}>
                    {item.nome_usuario}
                  </option>
                ))}
              </select>
              {error.atribuir && (
                <span className={stylesGlobal.errorMessage}>Campo obrigatório</span>
              )}
            </div>
          </div>

          {!id_ticket.id ? (
            <button type="button" className={styles.buttonEnviar} onClick={createTicket}>
              Enviar
            </button>
          ) : (
            <button type="button" className={styles.buttonEnviar}>
              Salvar
            </button>
          )}
        </form>
      </Card>

      <Popup onClose={closePopup} openPopup={popupVisible} autoCloseTime={3000}>
        <div className={stylesGlobal.divPopup}>
          <span>Mensagem!</span>
          {message}
        </div>
      </Popup>

    </PaginaPadrao>
  );
}

export default CriarChamado;
