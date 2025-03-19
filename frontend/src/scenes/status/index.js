import React, { useState, useEffect } from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";

import useStatus from "../../hooks/useStatus";

import FormPadrao from "../../components/formPadrao";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSort } from "@fortawesome/free-solid-svg-icons";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortedData, setSortedData] = useState([...status]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Atualiza a lista sempre que os dados mudam
  useEffect(() => {
    setSortedData([...status]);
  }, [status]);

  // Função para ordenar a tabela ao clicar nos títulos
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...sortedData].sort((a, b) => {
      const valueA = a[key] ?? "";
      const valueB = b[key] ?? "";

      if (typeof valueA === "string" && typeof valueB === "string") {
        return direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return direction === "asc" ? (valueA || 0) - (valueB || 0) : (valueB || 0) - (valueA || 0);
      }
    });

    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <div>
          <div className={stylesGlobal.controls}>
            <label>Exibir</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
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
                <th onClick={() => handleSort("id_status")}>
                  ID{" "}
                  <FontAwesomeIcon
                    icon={faSort}
                    className={style.sortIcon}
                  />
                </th>
                <th onClick={() => handleSort("nome")}>
                  Categoria{" "}
                  <FontAwesomeIcon
                    icon={faSort}
                    className={style.sortIcon}
                  />
                </th>
                <th onClick={() => handleSort("ativo")}>
                  Criado por{" "}
                  <FontAwesomeIcon
                    icon={faSort}
                    className={style.sortIcon}
                  />
                </th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody className={stylesGlobal.tbody}>
              {currentData.map((item) => (
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
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
