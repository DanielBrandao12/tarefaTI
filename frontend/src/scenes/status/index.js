import React, {useState} from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";

import useStatus from "../../hooks/useStatus";

import FormPadrao from "../../components/formPadrao";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import stylesGlobal from "../../styles/styleGlobal.module.css";
import style from "./style.module.css";

function Status() {
  const {
    error,
    titleForm,
    isEditIconDisabled,
    status,
    statusNome,
    situacaoStatus,
    showModal,
    showEdit,
    modalMessage,
    setStatusNome,
    setError,
    setSituacaoStatus,
    createStatus,
    toggleEdit,
    editStatus,
    cancelEdit,
  } = useStatus();


  return (
    <PaginaPadrao>
      {showModal && (
        <div className={style.modal}>
          <p>{modalMessage}</p>
        </div>
      )}

      <FormPadrao
        titleForm={titleForm}
        nome={statusNome}
        setNome={setStatusNome}
        status={situacaoStatus}
        setStatus={setSituacaoStatus}
        error={error}
        setError={setError}
        onSave={showEdit ? editStatus : createStatus}
        onCancel={cancelEdit}
        showEdit={showEdit}
      />

      <Card>
        <div >

   <div className={stylesGlobal.controls}>
        <label>Exibir</label>
        <select
        
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <label>itens por página</label>
      </div>
        <table className={stylesGlobal.table}>
          <thead className={stylesGlobal.thead}>
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
                    onClick={() =>
                      !isEditIconDisabled &&
                      toggleEdit(item.id_status, item.nome, item.ativo)
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
<div className={stylesGlobal.pagination}>

        <button
         
        >
          Anterior
        </button>
        <span>
          Página {1} de {2}
        </span>
        <button
      
        >
          Próxima
        </button>
      </div>

        </div>
      </Card>
    </PaginaPadrao>
  );
}

export default Status;
