// Importação das dependências necessárias
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import stylesGlobal from "../../styles/styleGlobal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPrint } from "@fortawesome/free-solid-svg-icons";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";
import Popup from "../../components/popup";
import Cookies from "js-cookie";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ExpandirLista from "../../components/expandirLista";
import api from "../../services/api";

// Componente principal da página
function Chamado() {
  const navigate = useNavigate(); // Navegação entre páginas
  const { id_ticket } = useParams(); // Captura o parâmetro da URL

  // Estados para armazenar dados e controlar o comportamento do componente
  const [chamado, setChamado] = useState({});
  // const [listaTarefaTicket, setListaTarefaTicket] = useState([]);
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [respostas, setRespostas] = useState([]);
  const [historicoStatus, setHistoricoStatus] = useState([]);
  const [resposta, setResposta] = useState("");
  const [usuario, setUsuario] = useState({});
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const hasFetched = useRef(false);
  const [edit, setEdit] = useState(false);
  const [listStatus, setListStatus] = useState([]);
  const [listCAtegorias, setListCategorias] = useState([]);
  const [listUsers, setListUsers] = useState([]);

  // Funções para controlar o Popup
  const handleOpenPopup = (mensagem) => {
    setMessage(mensagem);
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => setIsPopupOpen(false);

  // Busca os detalhes do chamado pelo ID
  useEffect(() => {
    const fetchChamado = async () => {
      try {
        const response = await api.get(`/tickets/${id_ticket}`);
        setChamado(response.data.ticket);

        if (response.data.respostas.length > 0) {
          setRespostas(response.data.respostas);
        }
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
      }
    };
    fetchChamado();
  }, [id_ticket, resposta]);

  // Busca a lista de tarefas associadas ao chamado
  /*
  useEffect(() => {
    const fetchChamadoListaTarefa = async () => {
      try {
        const response = await api.get(`/tickets/listaTarefa/${id_ticket}`);
        setListaTarefaTicket(response.data);
      } catch (error) {
        console.error('Erro ao buscar lista de tarefas:', error);
      }
    };
    fetchChamadoListaTarefa();
  }, [id_ticket]);
*/
  // Busca o status atual do chamado
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (chamado.id_status) {
          const response = await api.get(`/status/${chamado.id_status}`);
          setStatus(response.data.nome);
        }
      } catch (error) {
        console.error("Erro ao buscar status:", error);
      }
    };
    fetchStatus();
  }, [chamado]);

  // Busca a categoria do chamado
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        if (chamado.id_categoria) {
          const response = await api.get(`/categoria/${chamado.id_categoria}`);
          setCategoria(response.data.nome);
        }
      } catch (error) {
        console.error("Erro ao buscar categoria:", error);
      }
    };
    fetchCategoria();
  }, [chamado]);

  // Busca o histórico de status do chamado
  useEffect(() => {
    const fetchHistoricoStatus = async () => {
      try {
        const response = await api.get(`/historicoStatus/${id_ticket}`);
        const historico = response.data;

        const statusPromises = historico.map((item) =>
          api.get(`/status/${item.id_status}`)
        );
        const statusResponses = await Promise.all(statusPromises);
        const statusData = statusResponses.map((res) => res.data);

        const historicoComStatus = historico.map((item, index) => ({
          ...item,
          status: statusData[index],
        }));

        setHistoricoStatus(historicoComStatus);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      }
    };
    fetchHistoricoStatus();
  }, [id_ticket]);

  // Decodifica o token de autenticação e armazena os dados do usuário logado
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decodifica o payload do JWT
        setUsuario(decoded);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  // Envia uma nova resposta para o chamado
  const sendResposta = async (codigoTicket, remetente) => {
    try {
      if (!resposta || !resposta.trim()) {
        handleOpenPopup("A resposta não pode estar vazia.");
        return;
      }
      console.log(usuario);
      const response = await api.post("/resposta/createResposta", {
        resposta,
        id_ticket,
        id_usuario: usuario.id,
        codigoTicket,
        remetente,
      });
      //aqui vai ter uma função para enviar para o email do requisitante.

      // Atualiza a lista de respostas e limpa o campo
      handleOpenPopup("Mensagem Enviada com sucesso!");
      setRespostas((prevRespostas) => [
        ...prevRespostas,
        response.data.respostaCriada,
      ]);
      console.log(response.data);
      setResposta("");
    } catch (error) {
      console.error("Erro ao enviar a resposta:", error);
      handleOpenPopup("Erro ao enviar a resposta. Tente novamente.");
    }
  };

  // Função para imprimir os detalhes do chamado
  const handlePrint = () => {
    const printContent = `
      <html>
      <head>
        <title>Imprimir Chamado</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .ticket-header { margin-bottom: 20px; }
          .ticket-section { margin-bottom: 15px; }
          .ticket-section span { font-weight: bold; }
          .divider { border-bottom: 1px solid #ddd; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="ticket-header">
          <h2>Chamado: ${chamado.assunto}</h2>
          <p>Enviado por: ${chamado.nome_requisitante}</p>
          <p>Descrição: ${chamado.descricao}</p>
        </div>
        
        <div class="divider"></div>
  
        <div class="ticket-section">
          <p><span>Código do Ticket:</span> ${chamado.codigo_ticket}</p>
          <p><span>Data de Criação:</span> ${formatarData(
            chamado.data_criacao
          )}</p>
          ${
            chamado.data_conclusao
              ? `<p><span>Data de Conclusão:</span> ${formatarData(
                  chamado.data_conclusao
                )}</p>`
              : ""
          }
          <p><span>Status:</span> ${status}</p>
          <p><span>Categoria:</span> ${categoria}</p>
          <p><span>Prioridade:</span> ${chamado.nivel_prioridade}</p>
          <p><span>Atribuído a:</span> ${chamado.nome_usuarioAtribuido}</p>
        </div>
  
        
  
        <div class="divider"></div>
  
        <div class="ticket-section">
          <h3>Histórico de Status</h3>
          ${historicoStatus
            .map(
              (item) => `
              <p><span>Data:</span> ${formatarData(item.data_hora)}</p>
              <p><span>Status:</span> ${
                item.status?.nome || "Status não encontrado"
              }</p>
              <div class="divider"></div>
            `
            )
            .join("")}
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const formatarData = (data) => {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano}, ${horas}:${minutos}`;
  };

  // Formata a data em um formato legível
  const handleEditChamado = () => {
    //navigate(`/editarChamado/${chamado.id_ticket}`);
    setEdit(!edit)
  };

  useEffect(() => {
    const fetchUserAtribuido = async () => {
      try {
        // Verifica se o chamado tem um 'id_usuario' atribuído
        if (chamado.atribuido_a) {
          const response = await api.get(`/usuarios/${chamado.atribuido_a}`);
          setChamado((prevChamado) => ({
            ...prevChamado,
            nome_usuarioAtribuido: response.data.nomeUser,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    // Verifica se o chamado foi carregado antes de buscar o usuário
    if (chamado.id_ticket && !hasFetched.current) {
      fetchUserAtribuido();
      // Marca como verdadeiro para impedir novas requisições
      hasFetched.current = true;
    }
  }, [chamado]); // Esse useEffect será executado sempre que 'chamado' for alterado

  // Buscar todas as categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("/categoria");
        setListCategorias(
          response.data.filter((item) => item.status != "Desativado")
        );
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  // Buscar todos os status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/status");
        setListStatus(response.data);
      } catch (error) {
        console.error("Erro ao buscar Status:", error);
      }
    };

    fetchStatus();
  }, []);

  // Buscar todos os usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/usuarios");
        setListUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);


  const [selectFocus, setSelect] = useState(false)

  const handleSelect = () => {
    setSelect(!selectFocus)
  }
  return (
    <PaginaPadrao>
      {/* Layout principal */}
      <div className={styles.containerDivCards}>
        <div className={styles.containerFirstCard}>
          {/* Card de informações do chamado */}
          <Card>
            <div className={styles.containerChamadoView}>
              <h3 className={styles.titleAssunto}>{chamado.assunto}</h3>
              <div className={styles.autor}>
                <span className={styles.span}>Enviado por:</span>
                <p className={stylesGlobal.paragrafoGlobal}>
                  {chamado.nome_requisitante}
                </p>
              </div>
              <div className={styles.autor}>
                <span className={styles.span}>Email:</span>
                <p className={stylesGlobal.paragrafoGlobal}>{chamado.email}</p>
              </div>

              <span className={styles.span}>Descrição:</span>
              <div className={styles.descri}>
                <p className={stylesGlobal.paragrafoGlobal}>
                  <p
                    style={{ marginLeft: "15px" }}
                    dangerouslySetInnerHTML={{ __html: chamado.descricao }}
                  />
                </p>
              </div>
            </div>
          </Card>
          {/* Card de lista de tarefas 
          <Card>
            <div className={styles.containerListaTarefas}>
              <h3 className={styles.titleLista}>Lista de Tarefas</h3>
              <div className={styles.containerCheckboxes}>
                {!listaTarefaTicket.length ? (
                  <span>Não existe tarefas</span>
                ) : (
                  listaTarefaTicket.map((item) => (
                    <label key={item.id_tarefa}>
                      <input
                        type="checkbox"
                        className={styles.checkBox}
                      />
                      {item.assunto}
                    </label>
                  ))
                )}
              </div>
            </div>
          </Card>
          */}
          {/* Expandir lista de respostas */}
          <ExpandirLista title="Respostas do chamado">
            {!respostas.length ? (
              <span>Não existe respostas</span>
            ) : (
              respostas
                .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora)) // Ordena por data mais recente
                .map((item) => (
                  <Card key={item.id_resposta}>
                    <div className={styles.responsesCard}>
                      <div className={styles.responsesCardDivFirst}>
                        <div>
                          <p>
                            Enviado por{" "}
                            <span>
                              {item.nome_usuario || item.nome_requisitante} -{" "}
                            </span>
                          </p>
                        </div>
                        <div>
                          <span>{formatarData(item.data_hora)}</span>
                        </div>
                      </div>
                      <div
                        className={styles.responsesCardDivTwo}
                        dangerouslySetInnerHTML={{ __html: item.conteudo }}
                      />
                    </div>
                  </Card>
                ))
            )}
          </ExpandirLista>
          {/* Card para envio de respostas */}
          <Card>
            <div className={styles.containerListaTarefas}>
              <h3>Envie uma resposta</h3>
              <ReactQuill
                className={styles.reactQuill}
                value={resposta}
                onChange={setResposta}
              />
              <div>
                <input
                  type="button"
                  className="button-padrao"
                  value="Enviar"
                  onClick={() =>
                    sendResposta(chamado.codigo_ticket, chamado.email)
                  }
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Cards da direita */}
        <div className={styles.containerSecondCard}>
          {/* Card com opções */}
          <Card>
            <div className={styles.editPrintContainer}>
              <div>
                <FontAwesomeIcon icon={faPenToSquare} />
                <span onClick={handleEditChamado}>Editar</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faPrint} />
                <span onClick={handlePrint}>Imprimir</span>
              </div>
            </div>
          </Card>
          {/* Card detalhes do chamado */}
          <Card>
            <div className={styles.containerDivFirst}>
              <span className={styles.titleLista}>Detalhes do Chamado</span>
            </div>
            <div className={styles.containerDivTwo}>
              <div>
                <span>Código do Ticket:</span>
                <span className={styles.spanDetalhes}>
                  {chamado.codigo_ticket}
                </span>
              </div>
              <div>
                <span>Data e Hora Criação:</span>
                <span className={styles.spanDetalhes}>
                  {formatarData(chamado.data_criacao)}
                </span>
              </div>
              {chamado.data_conclusao && (
                <div>
                  <span>Data e Hora Conclusão:</span>
                  <span className={styles.spanDetalhes}>
                    {formatarData(chamado.data_conclusao)}
                  </span>
                </div>
              )}
              {!edit ? (
                <div className={styles.containerDivTwo}>
                  <div>
                    <span>Status:</span>
                    <span className={styles.spanDetalhes}>{status}</span>
                  </div>
                  <div>
                    <span>Categoria:</span>
                    <span className={styles.spanDetalhes}>{categoria}</span>
                  </div>
                  <div>
                    <span>Prioridade:</span>
                    <span className={styles.spanDetalhes}>
                      {chamado.nivel_prioridade}
                    </span>
                  </div>
                  <div>
                    <span>Atribuído a:</span>
                    <span className={styles.spanDetalhes}>
                      {chamado.nome_usuarioAtribuido}
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.containerDivTwo}>
                  <div>
                    <span>Status:</span>
                    <select value={status} onFocus={handleSelect} > 
                    
                     
                      {
                        !selectFocus ? <option >{status}</option> : null
                      }
                      
                      {listStatus.map((item) => (
                          <option key={item.id_status} value={item.id_status} style={item.nome === status ? {color:'green'} :{}}>
                          {item.nome }
                        </option>
                      ))
                      }
                      
                      </select>
                  </div>
                  <div>
                    <span>Categoria:</span>
                    <span className={styles.spanDetalhes}>{categoria}</span>
                  </div>
                  <div>
                    <span>Prioridade:</span>
                    <span className={styles.spanDetalhes}>
                      {chamado.nivel_prioridade}
                    </span>
                  </div>
                  <div>
                    <span>Atribuído a:</span>
                    <span className={styles.spanDetalhes}>
                      {chamado.nome_usuarioAtribuido}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
          {/* Card de histórico de status */}
          <Card>
            <div className={styles.containerDivFirst}>
              <span className={styles.titleLista}>Histórico Status</span>
            </div>
            {historicoStatus.map((item, index) => (
              <div
                className={styles.containerDivTwo}
                key={index}
                style={{ marginBottom: "10px" }}
              >
                <div>
                  <span>Data:</span>
                  <span className={styles.spanDetalhes}>
                    {formatarData(item.data_hora)}
                  </span>
                </div>
                <div>
                  <span>Status:</span>
                  <span className={styles.spanDetalhes}>
                    {item.status?.nome || "Status não encontrado"}
                  </span>
                </div>
                <div className={stylesGlobal.line}></div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Popup de mensagem, ele só é exibido quando chamado*/}
      <Popup
        openPopup={isPopupOpen}
        onClose={handleClosePopup}
        autoCloseTime={3000} // Fecha automaticamente após 5 segundos (opcional)
      >
        <div className={styles.containerDivFirst}>
          <span className={styles.titleLista}>Mensagem!</span>
        </div>
        <div className={styles.containerDivTwo}>
          <span className={styles.spanDetalhes}>{message}</span>
        </div>
      </Popup>
    </PaginaPadrao>
  );
}

export default Chamado;
