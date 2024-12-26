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
import {jwtDecode} from 'jwt-decode';

import api from '../../services/api';

function CriarChamado() {
  const id_ticket = useParams(); // Captura o parâmetro da URL
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
      setMessage('Por favor, preencha todos os campos obrigatórios!');
      setPopupVisible(true);
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
            <select
              name="Categoria"
              className={stylesGlobal.selectChamado}
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
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
          </div>

          <div className={styles.fieldGroup}>
            <label>Nome Requisitante:</label>
            <input
              type="text"
              placeholder="Digite o nome"
              className={stylesGlobal.inputTextChamado}
              value={nomeReq}
              onChange={(e) => setNomeReq(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Email Requisitante:</label>
            <input
              type="email"
              placeholder="Digite o email"
              className={stylesGlobal.inputTextChamado}
              value={emailReq}
              onChange={(e) => setEmailReq(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Assunto:</label>
            <input
              type="text"
              placeholder="Assunto"
              className={stylesGlobal.inputTextChamado}
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Descrição:</label>
            <ReactQuill
              className={styles.reactQuill}
              value={descri}
              onChange={(value) => setDescri(value)}
            />
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
            <select
              name="Nível de prioridade"
              className={stylesGlobal.selectChamado}
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
            >
              <option value="" disabled>
                Nível de prioridade
              </option>
              <option value="Prioridade Baixa">Baixa</option>
              <option value="Prioridade Média">Média</option>
              <option value="Prioridade Alta">Alta</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label>Status:</label>
            <select
              name="Status"
              className={stylesGlobal.selectChamado}
              value={idStatus}
              onChange={(e) => setIdStatus(e.target.value)}
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
          </div>

          <div className={styles.fieldGroup}>
            <label>Atribuir para:</label>
            <select
              name="Atribuir para"
              className={stylesGlobal.selectChamado}
              value={atribuir}
              onChange={(e) => setAtribuir(e.target.value)}
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
