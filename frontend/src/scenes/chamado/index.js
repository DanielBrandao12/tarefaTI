// Importação das dependências necessárias
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./style.module.css";
import stylesGlobal from "../../styles/styleGlobal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";
import Popup from "../../components/popup";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ExpandirLista from "../../components/expandirLista";


import useStatus from "../../hooks/useStatus";
import useCategory from "../../hooks/useCategory";
import useUser from "../../hooks/useUser";
import useAnexo from "../../hooks/useAnexo";
import useTickets from "../../hooks/useTickets";
import useHistoricos from "../../hooks/useHistoricos";
import BodyTicket from "../../components/bodyTicket";
// Componente principal da página
function Chamado() {
  //  const navigate = useNavigate(); // Navegação entre páginas
  const { id_ticket } = useParams(); // Captura o parâmetro da URL

  const { idUser, userList, getUserAll } = useUser();

  const { listStatusAtivo, statusChamado, fetchStatus } = useStatus();

  const { anexos, fetchAnexos, downloadFile } = useAnexo();

  const { categoria, listCategorias, fetchCategoria, getAllCategorys } =
    useCategory();

  const { historicoStatus, fetchHistoricoStatus } = useHistoricos();

  const {
    chamado,
    respostas,
    edit,
    statusNome,
    categoriaNome,
    usuarioAtribuido,
    isPopupOpen,
    message,
    resposta,
    setResposta,
    sendResposta,
    setIsPopupOpen,
    setEdit,
    setStatusNome,
    setCategoriaNome,
    setNivelPrioridade,
    setUsuarioAtribuido,
    fetchChamado,
    fetchUserAtribuido,
    salvarEdicao,
    deletarTicket
  } = useTickets();

  const hasFetched = useRef(false);

  const handleClosePopup = () => setIsPopupOpen(false);

  /* ------------- */
  //Refatorado 02/2025

  // Busca os detalhes do chamado pelo ID
  useEffect(() => {
    fetchChamado(id_ticket);
  }, [id_ticket, resposta, fetchChamado]);

//busca anexos
useEffect(() => {
  fetchAnexos(chamado.codigo_ticket);
}, [chamado.codigo_ticket, fetchAnexos]); // A dependência de id_ticket garante que a função seja chamada quando id_ticket mudar

  // Busca o status atual do chamado
  useEffect(() => {
    fetchStatus(chamado);
  }, [chamado, fetchStatus]);

  // Busca a categoria do chamado
  useEffect(() => {
    fetchCategoria(chamado);
  }, [chamado, fetchCategoria]);

  useEffect(() => {
    getAllCategorys(); // Chama a função ao montar o componente
  }, [getAllCategorys]);

  // Buscar todos os usuários
  useEffect(() => {
    getUserAll();
  }, [getUserAll]);

  //Atribui o nome do user ao chamado
  useEffect(() => {
    // Verifica se o chamado foi carregado antes de buscar o usuário
    if (chamado.id_ticket && !hasFetched.current) {
      fetchUserAtribuido(chamado);
      // Marca como verdadeiro para impedir novas requisições
      hasFetched.current = true;
    }
  }, [chamado, fetchUserAtribuido]); // Esse useEffect será executado sempre que 'chamado' for alterado

  // Busca o histórico de status do chamado
  useEffect(() => {
    fetchHistoricoStatus(id_ticket);
  }, [id_ticket, statusChamado, fetchHistoricoStatus]);
  /* ------------- */


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
          <p><span>Status:</span> ${statusChamado}</p>
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

  //Habilitar para edição
  const handleEditChamado = () => {
    //navigate(`/editarChamado/${chamado.id_ticket}`);
    setEdit(!edit);
  };


  return (
    <PaginaPadrao>
      {/* Layout principal */}
      <div className={styles.containerDivCards}>
        <div className={styles.containerFirstCard}>
          {/* Card de informações do chamado */}
          <Card>
            <BodyTicket
              chamado={chamado}
              anexos={anexos}
              downloadFile={downloadFile}
            />
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
                        <div className={stylesGlobal.anexosContainer}>
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
                    sendResposta(chamado.codigo_ticket, chamado.email, id_ticket, idUser)
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
              <div>
                <FontAwesomeIcon icon={faTrash} />
                <span onClick={() => deletarTicket(id_ticket)}>Excluir</span>
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
                <span className={styles.titleSpanDetalhes}>
                  Código do Ticket:
                </span>
                <span className={styles.spanDetalhes}>
                  {chamado.codigo_ticket}
                </span>
              </div>
              <div>
                <span className={styles.titleSpanDetalhes}>
                  Data e Hora Criação:
                </span>
                <span className={styles.spanDetalhes}>
                  {formatarData(chamado.data_criacao)}
                </span>
              </div>
              {chamado.data_conclusao && (
                <div>
                  <span className={styles.titleSpanDetalhes}>
                    Data e Hora Conclusão:
                  </span>
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
                    <span className={styles.titleSpanDetalhes}>
                      Prioridade:
                    </span>
                    <span className={styles.spanDetalhes}>
                      {chamado.nivel_prioridade}
                    </span>
                  </div>
                  <div>
                    <span className={styles.titleSpanDetalhes}>
                      Técnico Responsável:
                    </span>
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
                          style={
                            item.nome === statusChamado
                              ? { color: "green" }
                              : {}
                          }
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
                      {listCategorias &&
                        listCategorias.map((item) => (
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
                    <span className={styles.titleSpanDetalhes}>
                      Prioridade:
                    </span>
                    <select
                      className={styles.selectDetalhes}
                      defaultValue=""
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
                    <span className={styles.titleSpanDetalhes}>
                      Técnico Responsável:
                    </span>
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
                      onClick={() => salvarEdicao(id_ticket)}
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
