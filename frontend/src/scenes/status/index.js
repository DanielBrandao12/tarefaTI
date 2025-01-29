import React, { useState, useEffect } from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";

import api from "../../services/api";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import stylesGlobal from "../../styles/styleGlobal.module.css";
import style from "./style.module.css";

function Status() {
  const [error, setError] = useState({
    statusNome: false,
    situacaoStatus: false,
  });
  const [titleForm, setTitleForm] = useState("Adicionar Status");
  const [showEdit, setShowEdit] = useState(false);
  const [isEditIconDisabled, setIsEditIconDisabled] = useState(false);
  const [status, setStatus] = useState([]);
  const [idStatus, setIdStatus] = useState();
  const [statusNome, setStatusNome] = useState();
  const [situacaoStatus, setSituacaoStatus] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  
  const getAllStatus = async () => {
    try {
      const response = await api.get("/status/"); // Chama o endpoint para buscar categorias
      setStatus(response.data); // Armazena os dados na variável de estado
      setError(false); // Reseta o erro caso a requisição tenha sucesso
    } catch (error) {
      console.error("Erro ao buscar status:", error);
      setError(true); // Sinaliza que houve um erro
    }
  };

  useEffect(() => {
    getAllStatus();
  }, []);

  const toggleEdit = (id, status, situacao) => {
    const isNewStatus = !id && !status && !situacao;

    setShowEdit((prevState) => !prevState);
    setIsEditIconDisabled((prevState) => !prevState);

    if (isNewStatus) {
      setTitleForm("Adicionar Status");
      setIdStatus("");
      setStatusNome("");
      setSituacaoStatus("");
    } else {
      setIdStatus(id);
      setStatusNome(status);
      setSituacaoStatus(situacao);
      setTitleForm("Editar Status");
    }
  };

  const createStatus = async () => {
    const hasError = !statusNome || !situacaoStatus;
    setError({
      statusNome: !statusNome,
      situacaoStatus: !situacaoStatus,
    });
    if (hasError) return;

    try {
      const response = await api.post("/status/createStatus", {
        nome: statusNome,
        ativo: situacaoStatus,
      });
      //const statusCriado = response.data;

      setModalMessage("Status adicionado com sucesso!");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);

      setStatusNome("");
      setSituacaoStatus("");
      await getAllStatus();
    } catch (error) {
      console.error("Erro ao criar Status", error);
    }
  };

  //Alterar o modal para o popup!!
  return (
    <PaginaPadrao>
      {/* Modal de mensagem */}
      {showModal && (
        <div className={style.modal}>
          <p>{modalMessage}</p>
        </div>
      )}
      <div className={style.containerAddStatus}>
        <div>
          <h3>{titleForm}</h3>
        </div>
        <div className={style.containerInputs}>
          <label>Status</label>

          <div className={style.containerMessageInput}>
            <input
              value={statusNome}
              className={[
                stylesGlobal.inputTextChamado,
                error.statusNome && style.errorInput,
              ].join(" ")}
              onChange={(e) => {
                setStatusNome(e.target.value);
                setError((prev) => ({ ...prev, statusNome: false }));
              }}
            />
            {error.statusNome && (
              <span className={style.errorMessage}>Campo obrigatório</span>
            )}
          </div>
          <label>Situação</label>
          <div className={style.containerMessageInput}>
            <select
              value={situacaoStatus}
              name="Status"
              className={[
                stylesGlobal.selectChamado,
                error.situacaoStatus && style.errorInput,
              ].join(" ")}
              onChange={(e) => {
                setSituacaoStatus(e.target.value);
                setError((prev) => ({ ...prev, situacaoStatus: false }));
              }}
            >
              <option value="">Escolha uma opção</option>
              <option value="Ativo">Ativar</option>
              <option value="Desativado">Desativar</option>
            </select>
            {error.situacaoStatus && (
              <span className={style.errorMessage}>Escolha uma opção</span>
            )}
          </div>
          {!showEdit ? (
            <input
              type="button"
              value={"Adicionar Status"}
              className={stylesGlobal.buttonPadrao}
              onClick={createStatus}
            />
          ) : (
            <div>
              <input
                type="button"
                value={"Salvar"}
                className={stylesGlobal.buttonPadrao}
              />
              <input
                type="button"
                value={"Cancelar"}
                className={stylesGlobal.buttonPadrao}
                onClick={() => toggleEdit()}
              />
            </div>
          )}
        </div>
      </div>

      <Card>
        <div>
          <table className={stylesGlobal.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Situação</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody className={stylesGlobal.tbody}>
              {status.map((item) => (
                <tr key={item.id_status}>
                  <td>{item.id_status}</td>
                  <td>{item.nome}</td>
                  <td>{item.ativo ? "Ativado" : "Desativado"}</td>

                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className={style.icon}
                      onClick={
                        !isEditIconDisabled
                          ? () =>
                              toggleEdit(item.id_status, item.nome, item.ativo)
                          : null
                      }
                      style={{
                        cursor: isEditIconDisabled ? "not-allowed" : "pointer",
                        pointerEvents: isEditIconDisabled ? "none" : "auto",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PaginaPadrao>
  );
}

export default Status;
