import React from "react";
import style from "./style.module.css";
import stylesGlobal from "../../styles/styleGlobal.module.css";

const FormPadrao = ({
  titleForm,
  nome,
  setNome,
  status,
  setStatus,
  error,
  setError,
  onSave,
  onCancel,
  showEdit,
}) => {
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setError((prev) => ({ ...prev, status: false }));
    
  };
  

  return (
    <div className={style.containerInputAdd}>
      {/* Título do Formulário */}
      <div >
        <h3>{titleForm}</h3>
      </div>

      <div className={style.containerInputs}>
        {/* Input de Nome */}
        <label>Nome</label>
        <div className={style.containerMessageInput}>
          <input
            value={nome}
            className={[style.inputConfig, error.nome && style.errorInput].join(
              " "
            )}
            onChange={(e) => {
              setNome(e.target.value);
              setError((prev) => ({ ...prev, nome: false }));
            }}
          />
          {error.nome && (
            <span className={style.errorMessage}>Campo obrigatório</span>
          )}
        </div>

        {/* Select de Status */}
        <label>Situação</label>
        <div className={style.containerMessageInput}>
          <select
            value={status}
            name="status"
            className={[
              stylesGlobal.selectChamado,
              error.status && style.errorInput,
            ].join(" ")}
            onChange={handleStatusChange}
          >
            <option value="">Escolha um opção</option>
            <option value="Ativo">Ativar</option>
            <option value="Desativado">Desativar</option>
          </select>
          {error.status && (
            <span className={style.errorMessage}>Escolha uma opção</span>
          )}
        </div>

        {/* Botões de Ação */}
        {!showEdit ? (
          <input
            type="button"
            value={titleForm}
            className={stylesGlobal.buttonPadrao}
            onClick={onSave}
          />
        ) : (
          <div>
            <input
              type="button"
              value="Salvar"
              onClick={onSave}
              className={stylesGlobal.buttonPadrao}
            />
            <input
              type="button"
              value="Cancelar"
              className={stylesGlobal.buttonPadrao}
              onClick={onCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPadrao;
