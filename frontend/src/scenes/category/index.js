import React, { useState, useEffect } from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";
import FormPadrao from "../../components/formPadrao";

import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSort } from "@fortawesome/free-solid-svg-icons";

import stylesGlobal from "../../styles/styleGlobal.module.css";
import style from "./style.module.css";

import useCategory from "../../hooks/useCategory";

function Category() {
  const {
    categorys,
    showModal,
    modalMessage,
    nomeCategoria,
    statusCategoria,
    titleForm,
    showEdit,
    isEditIconDisabled,
    error,
    setError,
    setNomeCategoria,
    setStatusCategoria,
    editCategory,
    createCategory,
    toggleEdit,
    cancelEdit,
  } = useCategory();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortedData, setSortedData] = useState([...categorys]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    setSortedData([...categorys]);
  }, [categorys]);

  function formatarDataHora(dataISO) {
    return dayjs(dataISO).format("DD/MM/YYYY HH:mm");
  }

  // Função para ordenar os dados
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
      {/* Modal de mensagem */}
      {showModal && (
        <div className={style.modal}>
          <p>{modalMessage}</p>
        </div>
      )}

     
        <FormPadrao
          titleForm={titleForm}
          nome={nomeCategoria}
          setNome={setNomeCategoria}
          status={statusCategoria}
          setStatus={setStatusCategoria}
          error={error}
          setError={setError}
          onSave={showEdit ? editCategory : createCategory}
          onCancel={cancelEdit}
          showEdit={showEdit}
        />
      

      <div className={style.containerSepara}>
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
                  <th onClick={() => handleSort("id_categoria")}>
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
                  <th onClick={() => handleSort("criado_por")}>
                    Criado por{" "}
                    <FontAwesomeIcon
                      icon={faSort}
                      className={style.sortIcon}
                    />
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Situação{" "}
                    <FontAwesomeIcon
                      icon={faSort}
                      className={style.sortIcon}
                    />
                  </th>
                  <th onClick={() => handleSort("data_criacao")}>
                    Data - Hora{" "}
                    <FontAwesomeIcon
                      icon={faSort}
                      className={style.sortIcon}
                    />
                  </th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody className={stylesGlobal.tbody}>
                {currentData.map((category) => (
                  <tr key={category.id_categoria} style={{ cursor: "auto" }}>
                    <td>{category.id_categoria}</td>
                    <td>{category.nome}</td>
                    <td>{category.criado_por}</td>
                    <td>{category.status}</td>
                    <td>{formatarDataHora(category.data_criacao)}</td>
                    <td className={style.tdIcones}>
                      <FontAwesomeIcon
                        icon={faEdit}
                        className={style.icon}
                        onClick={
                          !isEditIconDisabled
                            ? () =>
                                toggleEdit(
                                  category.id_categoria,
                                  category.nome,
                                  category.status
                                )
                            : null
                        }
                        style={{
                          cursor: isEditIconDisabled
                            ? "not-allowed"
                            : "pointer",
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
      </div>
    </PaginaPadrao>
  );
}

export default Category;
