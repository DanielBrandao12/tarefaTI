import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert"; // Importa a função confirmAlert

import Popup from "../popup";

import api from "../../services/api";

function Header() {
  const navigate = useNavigate(); // Hook para navegação programática

  const [displayEdit, setDisplayEdit] = useState(""); //define o display do ContainerEditUser
  const [isEditing, setIsEditing] = useState(false); //Estado do icone arrow

  //Expandir e esconder caixa para opções do usuário (ContainerEditUser)
  const toggleEditUser = () => {
    setIsEditing(!isEditing);
    setDisplayEdit(isEditing ? "none" : "flex");
  };

  const handleChamado = () => {
    navigate("/criarChamado");
  };

  const handleRemoveToken = async () => {
    try {
      // Solicitar logout ao backend
      await api.get("/login/logout");

      // Remover cookies
      Cookies.remove("connect.sid", { path: "/" });
      Cookies.remove("token", { path: "/" });

      // Redirecionar para a página de login após logout
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Lidar com erros, talvez mostrar uma mensagem ao usuário
    }
  };

  const confirmaCloncuir = () => {
    toggleEditUser();
    confirmAlert({
      title: "Confirmação",
      message: "Deseja fazer logout?",
      buttons: [
        {
          label: "Sim",
          onClick: handleRemoveToken,
        },
        {
          label: "Não",
        },
      ],
    });
  };

  return (
    <div className={styles.containerPainel}>
      <div className={styles.containerButtonchamado}>
        <input
          type="button"
          className="button-padrao"
          value="Novo Chamado"
          onClick={handleChamado}
        />
      </div>

      <div className={styles.containerDadosUser}>
        <div className={styles.containerCircle}>D</div>
        <div className={styles.user} onClick={toggleEditUser}>
          <span>User 2.0</span>
          <FontAwesomeIcon
            icon={isEditing ? faChevronUp : faChevronDown}
            className="icon"
          />
        </div>
      </div>
      <div
        className={styles.containerEditUser}
        style={{ display: displayEdit }}
      >
        <div className={styles.titleOption}>
          <div>
            <FontAwesomeIcon icon={faUserPen} />
          </div>
          <p>Editar Perfil</p>
        </div>
        <div className={styles.titleOption}>
          <div>
            <FontAwesomeIcon icon={faUserPlus} />
          </div>
          <p>Criar Novo usuário</p>
        </div>
        <div className={styles.titleOption}>
          <div>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <p>Usuários</p>
        </div>
        <div
          className={styles.titleOptionLogout}
          onClick={(e) => {
            e.preventDefault();
            confirmaCloncuir();
          }}
        >
          <div>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </div>

          <p>Sair</p>
        </div>
      </div>
      {/* Popup de mensagem, ele só é exibido quando chamado*/}
      <Popup
        openPopup={true}
        autoCloseTime={2000} // Fecha automaticamente após 5 segundos (opcional)
      >
        <div className={styles.containerFormUser}>

          <div className={styles.containerTitleUser}>
            <h1>Cadastrar usuário</h1>
          </div>

          <div className={styles.blocoLabelInput}>
            <label>Nome Completo</label>
            <input className={styleGlobal.inputTextChamado} />
          </div>

          <div className={styles.blocoLabelInput}>
            <label>E-mail</label>
            <input className={styleGlobal.inputTextChamado} />
          </div>

          <div className={styles.blocoLabelInput}>
            <label>Nome de Usuário</label>
            <input className={styleGlobal.inputTextChamado} />
          </div>

          <div className={styles.blocoLabelInput}>
            <label>Senha</label>
            <input className={styleGlobal.inputTextChamado} />
          </div>

          <div className={styles.blocoLabelInput}>
            <label>Confirmar senha</label>
            <input className={styleGlobal.inputTextChamado} />
          </div>

          <div className={styles.blocoLabelInput}>
            <label>Perfil</label>
            <select className={styleGlobal.selectChamado}>
              <option value={""} disabled>
                Selecione um opção
              </option>
              <option>Admin</option>
            </select>
          </div>

          <div className={styles.blocoLabelInput}>    
            <input type="button" value={'Salvar'} className={styles.buttonPadrao} />
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default Header;
