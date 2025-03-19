import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faUserPen,
  faUserPlus,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";
import styleGlobal from "../../styles/styleGlobal.module.css";

import useUser from "../../hooks/useUser";
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Popup from "../popup";
import api from "../../services/api";

function Header() {
  const navigate = useNavigate();

  // Desestruturando as variáveis do hook useUser
  const {
    idUser,
    formData,
    userList,
    isLoading,
    message,
    errors,
    isCreatingUser,
    isEditingUser,
    isUserListOpen,
    isOpen,
    setErrors,
    setIsCreatingUser,
    setIsEditingUser,
    setIsOpen,
    setIsUserListOpen,
    setFormData,
    postUser,
    updateUser,
    getUser,
    getUserAll,
    handleClosePopup,
  } = useUser();

  // Controle de visibilidade do formulário de edição de usuário
  const [displayEdit, setDisplayEdit] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Navega para a página de criação de chamado
  const handleChamado = () => {
    navigate("/criarChamado");
  };

  // Alterna o estado de edição de usuário
  const toggleEditUser = () => {
    setIsEditing(!isEditing);
    setDisplayEdit(isEditing ? "none" : "flex");
  };

  // Alterna o estado do formulário de criação de usuário
  const toggleCreateUser = () => {
    if (!isOpen) {
     
      setIsOpen(true);
      toggleEditUser(); // Abre o formulário de criação ao mesmo tempo
    } else {
      handleClosePopup(); // Fecha o popup se já estiver aberto
    }
  };

  // Manipula a alteração dos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Função para realizar o logout
  const handleRemoveToken = async () => {
    try {
      await api.get("/login/logout");
      Cookies.remove("connect.sid", { path: "/" });
      Cookies.remove("authToken", { path: "/" });
      Cookies.remove("token", { path: "/" });
      navigate("/login"); // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Função de confirmação para fazer logout
  const confirmaCloncuir = () => {
    toggleEditUser();
    confirmAlert({
      title: "Confirmação",
      message: "Deseja fazer logout?",
      buttons: [{ label: "Sim", onClick: handleRemoveToken }, { label: "Não" }],
      overlayClassName:".react-confirm-alert-body"
    });
  };

  // Campos do formulário de criação ou edição de usuário
  const formFields = [
    { label: "Nome Completo", name: "nomeC" },
    { label: "E-mail", name: "email" },
    { label: "Nome de Usuário", name: "nomeUser" },
    { label: "Senha", name: "senha", type: "password" },
    { label: "Confirmar senha", name: "confirmSenha", type: "password" },
  ];

  return (
    <div className={styles.containerPainel}>
      {/* Botão para criar novo chamado */}
      <div className={styles.containerButtonchamado}>
        <input
          type="button"
          className="button-padrao"
          value="Novo Chamado"
          onClick={handleChamado}
        />
      </div>

      {/* Informações do usuário e opção de edição */}
      <div className={styles.containerDadosUser}>
        <div className={styles.containerCircle}>
          {idUser ? idUser.nome_usuario.charAt(0).toUpperCase() : null}
        </div>
        <div className={styles.user} onClick={toggleEditUser}>
          <span>{idUser ? idUser.nome_usuario.toUpperCase() : null}</span>
          <FontAwesomeIcon
            icon={isEditing ? faChevronUp : faChevronDown}
            className="icon"
          />
        </div>
      </div>

      {/* Opções de edição de usuário */}
      <div
        className={styles.containerEditUser}
        style={{ display: displayEdit }}
      >
        <div
          className={styles.titleOption}
          onClick={() => {
            toggleCreateUser();
            setIsEditingUser(true);
            getUser();
          }}
        >
          <div>
            <FontAwesomeIcon icon={faUserPen} />
          </div>
          <p>Editar Perfil</p>
        </div>
        <div
          className={styles.titleOption}
          onClick={() => {
            toggleCreateUser();
            setIsCreatingUser(true);
          }}
        >
          <div>
            <FontAwesomeIcon icon={faUserPlus} />
          </div>
          <p>Criar Novo usuário</p>
        </div>
        <div
          className={styles.titleOption}
          onClick={() => {
            toggleCreateUser();
            setIsUserListOpen(true);
            getUserAll();
          }}
        >
          <div>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <p>Usuários</p>
        </div>
        <div
          className={styles.titleOptionLogout}
          onClick={(e) => {
            e.preventDefault()
            confirmaCloncuir();
          }}
        >
          <div>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </div>
          <p>Sair</p>
        </div>
      </div>

      {/* Popup de confirmação e formulário */}
      <Popup
        openPopup={isOpen}
        onClose={handleClosePopup}
        autoCloseTime={message && 2000} // Fecha automaticamente após a mensagem
      >
        {isLoading && (
          <div className={styleGlobal.loadingOverlay}>
            <div className={styleGlobal.spinner}></div>
          </div>
        )}

        {message && (
          <div className={styles.containerMessage}>
            <span>Mensagem!</span>
            <h1>{message}</h1>
          </div>
        )}

        {(isCreatingUser || isEditingUser) && (
          <div className={styles.containerFormUser}>
            <h1>{isCreatingUser ? "Cadastrar usuário" : "Editar usuário"}</h1>
            {formFields.map(({ label, name, type = "text" }) => (
              <div className={styles.blocoLabelInput} key={name}>
                <label>{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className={styleGlobal.inputTextChamado}
                  required
                  disabled={
                    // Desabilita alguns campos durante a edição
                    isEditingUser && (name === "email" || name === "nomeUser")
                  }
                />
                {errors[name] && (
                  <span className={styleGlobal.errorMessage}>
                    {errors[name]}
                  </span>
                )}
              </div>
            ))}
            <div className={styles.blocoLabelInput}>
              <label>Perfil</label>
              <select
                name="perfil"
                value={formData.perfil}
                onChange={handleInputChange}
                className={styleGlobal.selectChamado}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option>Admin</option>
              </select>
              {errors.perfil && (
                <span className={styleGlobal.errorMessage}>
                  {errors.perfil}
                </span>
              )}
            </div>
            <input
              type="button"
              value={isCreatingUser ? "Salvar" : "Atualizar"}
              className={styles.buttonPadrao}
              onClick={isCreatingUser ? postUser : updateUser}
            />
            <input
              type="button"
              value="Fechar"
              className={styles.buttonPadrao}
              onClick={handleClosePopup}
            />
          </div>
        )}

        {isUserListOpen && (
          <div>
            <table className={styleGlobal.table}>
              <thead className={styleGlobal.thead}>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody className={styleGlobal.tbody}>
                {userList.map((item) => (
                  <tr key={item.id_usuario}>
                    <td>{item.nome_completo}</td>
                    <td>{item.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <input
              type="button"
              value="Fechar"
              className={styles.buttonPadrao}
              onClick={() => {
                toggleCreateUser();
                setIsUserListOpen(false);
              }}
            />
          </div>
        )}
      </Popup>
    </div>
  );
}

export default Header;
