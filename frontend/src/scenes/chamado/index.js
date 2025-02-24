// Importação das dependências necessárias
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./style.module.css";
import stylesGlobal from "../../styles/styleGlobal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPrint } from "@fortawesome/free-solid-svg-icons";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";
import Popup from "../../components/popup";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ExpandirLista from "../../components/expandirLista";
import api from "../../services/api";

import useStatus from "../../hooks/useStatus";
import useCategory from "../../hooks/useCategory";
import useUser from "../../hooks/useUser";

// Componente principal da página
function Chamado() {

  //  const navigate = useNavigate(); // Navegação entre páginas
  const { id_ticket } = useParams(); // Captura o parâmetro da URL

  const {idUser, userList, getUserAll} = useUser();

  const {
    listStatusAtivo,
    statusChamado,
    fetchStatus
  } = useStatus();

  const {categoria,fetchCategoria} = useCategory();



  // Estados para armazenar dados e controlar o comportamento do componente
  const [chamado, setChamado] = useState({});
  // const [listaTarefaTicket, setListaTarefaTicket] = useState([]);
  const [status, setStatus] = useState("");
 
  const [respostas, setRespostas] = useState([]);
  const [historicoStatus, setHistoricoStatus] = useState([]);
  const [resposta, setResposta] = useState("");
  
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const hasFetched = useRef(false);
  const [edit, setEdit] = useState(false);
  const [listCategorias, setListCategorias] = useState([]);
 
  const [statusNome, setStatusNome] = useState();
  const [categoriaNome, setCategoriaNome] = useState();
  const [usuarioAtribuido, setUsuarioAtribuido] = useState();
  const [nivelPrioridade, setNivelPrioridade] = useState()
  const [editOk, setEditOk] = useState(false)
  const [userAtt, setUserAtt] = useState()
  const [anexos, setAnexos] = useState([])
  const [anexosRespostas, setAnexosRespostas]= useState([])
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
          const respostasComAnexos = await Promise.all(
            response.data.respostas.map(async (resposta) => {
              try {
                // Busca os anexos para cada resposta
                const anexoR = await api.get(`/anexo/${resposta.id_resposta}`);
                return { ...resposta, anexos: anexoR.data.length > 0 ? anexoR.data : [] };
              } catch (error) {
                console.error(`Erro ao buscar anexos para a resposta ${resposta.id_resposta}:`, error);
                return { ...resposta, anexos: [] }; // Garante que a resposta será mostrada sem anexos
              }
            })
          );
          
          setRespostas(respostasComAnexos);
        } else {
          setRespostas([]); // Garante que o estado não fique indefinido
        }
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
      }
    };
    fetchChamado();
  }, [id_ticket, resposta, editOk]);
  




//
useEffect(() => {
  const fetchAnexos = async () => {
    try {
      const response = await api.get(`/anexo/${id_ticket}`);
      console.log(response);
      // Atualiza o estado com os dados dos anexos
      setAnexos(response.data); // Ajuste conforme a resposta esperada
    } catch (error) {
      console.error("Erro ao buscar anexos:", error);
    }
  };

  fetchAnexos();
}, [id_ticket]); // A dependência de id_ticket garante que a função seja chamada quando id_ticket mudar

const downloadFile = async (id) => {
  try {
    // Faz a requisição para pegar o arquivo com responseType 'blob'
    const response = await api.get(`/anexo/getAnexo/${id}`, { responseType: 'blob' });

    // Obtém o Content-Type do cabeçalho
    const contentType = response.headers['content-type'] || 'application/octet-stream';

    // Define um nome de arquivo padrão
    let fileName = `arquivo`;

    // Tenta obter o nome do arquivo do cabeçalho Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1];
      }
    } else {
      // Se não houver Content-Disposition, tenta definir a extensão pelo Content-Type
      const mimeTypes = {
        'application/pdf': 'pdf',
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'application/zip': 'zip',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      };

      if (mimeTypes[contentType]) {
        fileName += `.${mimeTypes[contentType]}`;
      }
    }

    // Cria um Blob a partir dos dados binários
    const fileBlob = new Blob([response.data], { type: contentType });

    // Cria uma URL para o arquivo
    const fileUrl = window.URL.createObjectURL(fileBlob);

    // Cria um elemento de link para o download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);

    // Simula um clique para iniciar o download
    document.body.appendChild(link);
    link.click();

    // Remove o link após o download
    document.body.removeChild(link);
    window.URL.revokeObjectURL(fileUrl); // Libera a URL do objeto para evitar vazamento de memória

  } catch (error) {
    console.error('Erro ao baixar o anexo', error);
  }
};


/* ------------- */
  //Refatorado 24/02/2025

  
// Busca o status atual do chamado 
  useEffect(() => {
      fetchStatus(chamado)
  }, [chamado]);


  // Busca a categoria do chamado 
  useEffect(() => {
    fetchCategoria(chamado);
  }, [chamado]);


  // Buscar todos os usuários
  useEffect(() => {
    getUserAll()
   }, []);

/* ------------- */
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
  }, [id_ticket, editOk]);



  // Envia uma nova resposta para o chamado
  const sendResposta = async (codigoTicket, remetente) => {
    try {
      if (!resposta || !resposta.trim()) {
        handleOpenPopup("A resposta não pode estar vazia.");
        return;
      }

      const response = await api.post("/resposta/createResposta", {
        resposta,
        id_ticket,
        id_usuario: idUser.id,
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


  // Formata a data em um formato legível
  const formatarData = (data) => {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano}, ${horas}:${minutos}`;
  };



  //Atribui o nome do user ao chamado
  useEffect(() => {
    const fetchUserAtribuido = async () => {
      try {
        // Verifica se o chamado tem um 'id_usuario' atribuído
        if (chamado.atribuido_a) {
          const response = await api.get(`/usuarios/${chamado.atribuido_a}`);
          setChamado((prevChamado) => ({
            ...prevChamado,
            nome_usuarioAtribuido: response.data.nomeUser.nome_usuario,
          }));
          setUserAtt(response.data.nomeUser)
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
  }, [ chamado]); // Esse useEffect será executado sempre que 'chamado' for alterado

  // Buscar todas as categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("/categoria");
        setListCategorias(
          response.data.filter((item) => item.status !== "Desativado")
        );
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategorias();
  }, []);





  //Habilitar para edição
  const handleEditChamado = () => {
    //navigate(`/editarChamado/${chamado.id_ticket}`);
    setEdit(!edit);
  };

//Salvar edição

const salvarEdicao = async () => {
  try {
    if (!id_ticket) {
      handleOpenPopup("ID do ticket não fornecido.");
      return;
    }

    // Criar um objeto com os dados atualizados
    const dadosAtualizados = {
      id_ticket,
      id_categoria: categoriaNome || chamado.id_categoria,
      nivel_prioridade: nivelPrioridade || chamado.nivel_prioridade,
      id_status: statusNome || null,
      atribuido_a: usuarioAtribuido || chamado.atribuido_a,
      id_usuario: idUser.id,
    };

    // Enviar requisição de atualização
    const response = await api.put(`/tickets/updateTicket`, dadosAtualizados);

    if (response.status === 200) {
      handleOpenPopup("Ticket alterado com sucesso!");

      // Atualizar estado do chamado com os novos valores
      setChamado((prevChamado) => ({
        ...prevChamado,
        id_categoria: dadosAtualizados.id_categoria,
        nivel_prioridade: dadosAtualizados.nivel_prioridade,
        id_status: dadosAtualizados.id_status,
        atribuido_a: dadosAtualizados.atribuido_a,
      }));

      // Se um técnico foi atribuído, buscar o nome atualizado
      if (dadosAtualizados.atribuido_a) {
        try {
          const userResponse = await api.get(`/usuarios/${dadosAtualizados.atribuido_a}`);
          console.log(userResponse)
          setChamado((prevChamado) => ({
            ...prevChamado,
            nome_usuarioAtribuido: userResponse.data.nomeUser.nome_usuario
          }));
        } catch (error) {
          console.error("Erro ao buscar usuário atribuído:", error);
        }
      }

      // Resetar estados da edição
      setEdit(false);
      setNivelPrioridade("");
      setCategoriaNome("");
      setStatusNome("");
      setUsuarioAtribuido("");
    } else {
      handleOpenPopup(`Falha ao atualizar o ticket. Código: ${response.status}`);
    }
  } catch (error) {
    console.error("Erro ao atualizar o ticket:", error);
    handleOpenPopup("Ocorreu um erro ao salvar as alterações. Tente novamente.");
  }
};

  
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
                <div className={styles.anexosContainer}>
      <h3>Anexos:</h3>
      {anexos && anexos.length > 0 ? (
        <ul>
          {anexos.map((anexo) => (
            <li key={anexo.id}>
              <span>{anexo.nome}</span>
              <button onClick={() => downloadFile(anexo.id)}>
                Baixar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum anexo encontrado.</p>
      )}
    </div>
              </div>
            </div>
          </Card>
         
          {/* Expandir lista de respostas */}
          <ExpandirLista title="Respostas do chamado">
  {!respostas.length ? (
    <span>Não existem respostas</span>
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

            {/* Se houver anexos, exibe a lista de anexos */}
            {item.anexos && item.anexos.length > 0 && (
              <div className={styles.anexosContainer}>
                <h4>Anexos:</h4>
                <ul>
                  {item.anexos.map((anexo) => (
                    <li key={anexo.id}>
                      <span>{anexo.nome}</span>
                      <button onClick={() => downloadFile(anexo.id)}>
                        Baixar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className={edit ? styles.disabled : ""}
                />
                <span
                  onClick={edit ? null : handleEditChamado} // Não faz nada se 'edit' for true
                  className={edit ? styles.disabled : ""} // Aplique a classe para aparência de desabilitado
                >
                  Editar
                </span>
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
                <span className={styles.titleSpanDetalhes}>Código do Ticket:</span>
                <span className={styles.spanDetalhes}>
                  {chamado.codigo_ticket}
                </span>
              </div>
              <div>
                <span className={styles.titleSpanDetalhes}>Data e Hora Criação:</span>
                <span className={styles.spanDetalhes}>
                  {formatarData(chamado.data_criacao)}
                </span>
              </div>
              {chamado.data_conclusao && (
                <div>
                  <span className={styles.titleSpanDetalhes}>Data e Hora Conclusão:</span>
                  <span className={styles.spanDetalhes}>
                    {formatarData(chamado.data_conclusao)}
                  </span>
                </div>
              )}
              {!edit ? (
                <div className={styles.containerDivTwo}>
                  <div>
                    <span className={styles.titleSpanDetalhes}>Status:</span>
                    <span className={styles.spanDetalhes}>{statusChamado}</span>
                  </div>
                  <div>
                    <span className={styles.titleSpanDetalhes}>Categoria:</span>
                    <span className={styles.spanDetalhes}>{categoria}</span>
                  </div>
                  <div>
                    <span className={styles.titleSpanDetalhes}>Prioridade:</span>
                    <span className={styles.spanDetalhes}>
                      {chamado.nivel_prioridade}
                    </span>
                  </div>
                  <div>
                    <span className={styles.titleSpanDetalhes}>Técnico Responsável:</span>
                    <span className={styles.spanDetalhes}>
                      {chamado.nome_usuarioAtribuido}
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.containerDivTwo}>
                  <div>
                    <span className={styles.titleSpanDetalhes}>Status:</span>
                    <select
                      className={styles.selectDetalhes}
                      value={statusNome}
                     
                      onChange={(e) => setStatusNome(e.target.value)}
                      defaultValue=""
                    >
                      <option value={""} disabled>
                        Selecione um opção
                      </option>
                      {listStatusAtivo.map((item) => (
                        <option
                          key={item.id_status}
                          value={item.id_status}
                          style={item.nome === statusChamado ? { color: "green" } : {}}
                        >
                          {item.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className={styles.titleSpanDetalhes}>Categoria:</span>
                    <select
                      className={styles.selectDetalhes}
                      value={categoriaNome}
                      onChange={(e) => setCategoriaNome(e.target.value)}
                      defaultValue=""
                    >
                      <option value={""} disabled>
                        Selecione um opção
                      </option>
                      {listCategorias.map((item) => (
                        <option
                          key={item.id_categoria}
                          value={item.id_categoria}
                          style={
                            item.nome === categoria ? { color: "green" } : {}
                          }
                        >
                          {item.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className={styles.titleSpanDetalhes}>Prioridade:</span>
                    <select className={styles.selectDetalhes} defaultValue="" 
                      onChange={(e) => setNivelPrioridade(e.target.value)}
                    >
                      <option value={""} disabled>
                        Selecione um opção
                      </option>
                      {[
                        "Prioridade Baixa",
                        "Prioridade Média",
                        "Prioridade Alta",
                      ].map((item) => (
                        <option
                          value={item}
                          style={
                            item === chamado.nivel_prioridade
                              ? { color: "green" }
                              : {}
                          }
                        >
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className={styles.titleSpanDetalhes}>Técnico Responsável:</span>
                    <select
                      className={styles.selectDetalhes}
                      value={usuarioAtribuido}
                      onChange={(e) => setUsuarioAtribuido(e.target.value)}
                      defaultValue=""
                    >
                      <option value={""} disabled>
                        Selecione um opção
                      </option>
                      {userList.map((item) => (
                        <option
                          key={item.id_usuario}
                          value={item.id_usuario}
                          style={
                            item.nome_usuario === chamado.nome_usuarioAtribuido
                              ? { color: "green" }
                              : {}
                          }
                          
                        >
                          {item.nome_usuario}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.buttonsDetalhes}>
                    <input
                      type="button"
                      className={styles.buttonPadrao}
                      value={"Salvar"}
                      onClick={salvarEdicao}
                    />
                    <input
                      type="button"
                      onClick={handleEditChamado}
                      className={styles.buttonPadrao}
                      value={"Cancelar"}
                    />
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
                  <span className={styles.titleSpanDetalhes}>Data:</span>
                  <span className={styles.spanDetalhes}>
                    {formatarData(item.data_hora)}
                  </span>
                </div>
                <div>
                  <span className={styles.titleSpanDetalhes}>Status:</span>
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
        autoCloseTime={2000} // Fecha automaticamente após 5 segundos (opcional)
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
