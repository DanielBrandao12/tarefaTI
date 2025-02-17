import React, { useState } from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";

import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import stylesGlobal from "../../styles/styleGlobal.module.css";
import style from "./style.module.css";

import useCategory from '../../hooks/useCategory'

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
    cancelEdit
  } = useCategory();

 
  
  

  const handleStatusChange = (event) => {
    setStatusCategoria(event.target.value);
    setError((prev) => ({ ...prev, statusCategoria: false }));
  };

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

      <div className={style.positionCard}>
        <div className={style.titleFormCatgory}>
          <h3>{titleForm}</h3>
        </div>

        <div className={style.containerInputAdd}>
          <label>Categoria</label>
          <div className={style.containerMessageInput}>
            <input
              value={nomeCategoria}
              className={[
                style.inputConfig,
                error.nomeCategoria && style.errorInput,
              ].join(" ")}
              onChange={(e) => {
                setNomeCategoria(e.target.value);
                setError((prev) => ({ ...prev, nomeCategoria: false }));
              }}
            />
            {error.nomeCategoria && (
              <span className={style.errorMessage}>Campo obrigatório</span>
            )}
          </div>

          <label>Situação</label>
          <div className={style.containerMessageInput}>
            <select
              value={statusCategoria}
              name="Categoria"
              className={[
                stylesGlobal.selectChamado,
                error.statusCategoria && style.errorInput,
              ].join(" ")}
              onChange={handleStatusChange}
            >
              <option value="">Escolha um opção</option>
              <option value="Ativo">Ativar</option>
              <option value="Desativado">Desativar</option>
            </select>
            {error.statusCategoria && (
              <span className={style.errorMessage}>Escolha uma opção</span>
            )}
          </div>

          {!showEdit ? (
            <input
              type="button"
              value={titleForm}
              className={stylesGlobal.buttonPadrao}
              onClick={createCategory}
            />
          ) : (
            <div>
              <input
                type="button"
                value="Salvar"
                onClick={() => editCategory()}
                className={stylesGlobal.buttonPadrao}
              />
              <input
                type="button"
                value="Cancelar"
                className={stylesGlobal.buttonPadrao}
                onClick={cancelEdit}
              />
            </div>
          )}
        </div>
      </div>

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
