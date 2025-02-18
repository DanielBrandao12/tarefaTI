import React from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";
import FormPadrao from "../../components/formPadrao";

import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

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

  function formatarDataHora(dataISO) {
    return dayjs(dataISO).format("DD/MM/YYYY HH:mm");
  }

  //Alterar o modal para o popup!!
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
            <table className={stylesGlobal.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Categoria</th>
                  <th>Criado por</th>
                  <th>Situação</th>
                  <th>Data - Hora</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody className={stylesGlobal.tbody}>
                {categorys.map((category) => (
                  <tr key={category.id} style={{ cursor: "auto" }}>
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
                      {/*<FontAwesomeIcon icon={faTrashCan} className={style.icon} onClick={()=>deleteCategory(categorys.id_categoria, categorys.status)} />*/}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PaginaPadrao>
  );
}

export default Category;
