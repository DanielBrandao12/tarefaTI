import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faUserPen,
  faUserPlus,
  faRightFromBracket,
  faUser,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";
import styleGlobal from "../../styles/styleGlobal.module.css";
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import Popup from "../popup";
import api from "../../services/api";

import { jwtDecode } from 'jwt-decode';
function Header() {
  const navigate = useNavigate();


  const [displayEdit, setDisplayEdit] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nomeC: "",
    email: "",
    nomeUser: "",
    senha: "",
    confirmSenha: "",
    perfil: "",
  });
  const [userList, setUserList] = useState([])
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [idUser, setIdUser] = useState("")

    // Decodificar o token e carregar dados do usuário
    useEffect(() => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIdUser(decoded);
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
        }
      }
    }, []);

  const toggleEditUser = () => {
    setIsEditing(!isEditing);
    setDisplayEdit(isEditing ? "none" : "flex");
 
 
  };

  const handleChamado = () => {
    navigate("/criarChamado");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleRemoveToken = async () => {
    try {
      await api.get("/login/logout");
      Cookies.remove("connect.sid", { path: "/" });
       Cookies.remove('authToken',{path: "/"});
      Cookies.remove("token", { path: "/" });
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const confirmaCloncuir = () => {
    toggleEditUser();
    confirmAlert({
      title: "Confirmação",
      message: "Deseja fazer logout?",
      buttons: [{ label: "Sim", onClick: handleRemoveToken }, { label: "Não" }],
    });
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleClosePopup = () => {
    setIsOpen(false);
    setIsCreatingUser(false);
    setIsEditingUser(false);
    setIsUserListOpen(false);
    setErrors({})
    // Garantir que o reset do formulário ocorra corretamente
    setFormData({ 
      nomeC: "", 
      email: "", 
      nomeUser: "", 
      senha: "", 
      confirmSenha: "", 
      perfil: "" 
    });
  
    // Esperar a próxima renderização para exibir os valores atualizados
    setTimeout(() => console.log(formData), 0);
  };
  
  const toggleCreateUser = () => {
    if (!isOpen) {
      setIsOpen(true);
 
         toggleEditUser()
    } else {
      handleClosePopup();
    }
  };
  

  const postUser = async () => {
    let newErrors = {};

    // Validação de campos obrigatórios
    Object.keys(formData).forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "Campo Obrigatório!";
      }
    });

    // Validação do formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Formato de e-mail inválido!";
    }

    // Verifica se as senhas coincidem
    if (formData.senha !== formData.confirmSenha) {
      newErrors.confirmSenha = "As senhas não coincidem";
    }

    // Se houver erros, define os erros e interrompe a execução
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setValidated(true);
      return;
    }

    setIsLoading(true);
    try {
      const usuarioCriado = await api.post("/usuarios/createUser/", {
        nome_completo: formData.nomeC,
        nome_usuario: formData.nomeUser,
        email: formData.email,
        senha: formData.senha,
        perfil: formData.perfil,
      });

      if (usuarioCriado) {
        setIsLoading(false);
        setIsCreatingUser(false);
        setMessage(usuarioCriado.data.message);

        //console.log(usuarioCriado);

        setTimeout(() => {
          handleClosePopup();
          setMessage("");
          setFormData({
            nomeC: "",
            email: "",
            nomeUser: "",
            senha: "",
            confirmSenha: "",
            perfil: "",
          });
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao criar usuário:", error.response?.data);

      if (error.response?.data) {
        const { message, errors } = error.response.data; // Verifica se existem erros estruturados

        // Caso a API retorne um array de erros
        if (Array.isArray(errors)) {
          errors.forEach((err) => {
            if (err.toLowerCase().includes("email")) {
              newErrors.email = "Este e-mail já está cadastrado!";
            }
            if (
              err.toLowerCase().includes("usuário") ||
              err.toLowerCase().includes("nome de usuário")
            ) {
              newErrors.nomeUser = "Este nome de usuário já está em uso!";
            }
          });
        }

        // Caso a API retorne uma única mensagem
        else if (message) {
          const mensagemErro = message.toLowerCase();
          if (mensagemErro.includes("e-mail")) {
            newErrors.email = message;
            // Limpa os campos de email e nome de usuário
            setFormData((prevFormData) => ({
              ...prevFormData,
              email: "",
            }));
          }
          if (
            mensagemErro.includes("Nome") ||
            mensagemErro.includes("nome de usuário")
          ) {
            newErrors.nomeUser = "Este nome de usuário já está em uso!";
            // Limpa os campos de email e nome de usuário
            setFormData((prevFormData) => ({
              ...prevFormData,
              nomeUser: "",
            }));
          }
        }

        // Atualiza os erros na tela
        setErrors(newErrors);
      }
    }
  };

  const updateUser = async () => {
    let newErrors = {};
  
    // Validação de campos obrigatórios
    Object.keys(formData).forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "Campo Obrigatório!";
      }
    });
  
    // Validação do formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Formato de e-mail inválido!";
    }
  
    // Verifica se as senhas coincidem
    if (formData.senha !== formData.confirmSenha) {
      newErrors.confirmSenha = "As senhas não coincidem";
    }
  
    // Se houver erros, define os erros e interrompe a execução
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setValidated(true);
      return;
    }
  
    setIsLoading(true);
    try {
      const usuarioAlterado = await api.put(`/usuarios/updateUser/${idUser.id}`, {
        nome_completo: formData.nomeC,
        senha: formData.senha,
        perfil: formData.perfil,
      });
  
      if (usuarioAlterado) {
        setIsEditingUser(false);
        setMessage("Usuário atualizado com sucesso!");
  
        setTimeout(() => {
          setIsLoading(false);
          setMessage("");
          handleClosePopup();
  
          // Reseta o formulário após atualização bem-sucedida
          setFormData({
            nomeC: "",
            email: "",
            nomeUser: "",
            senha: "",
            confirmSenha: "",
            perfil: "",
          });
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao atualizar usuário:", error.response?.data);
  
      if (error.response?.data) {
        const { message, errors } = error.response.data; 
  
        if (Array.isArray(errors)) {
          errors.forEach((err) => {
            if (err.toLowerCase().includes("email")) {
              newErrors.email = "Este e-mail já está cadastrado!";
            }
            if (err.toLowerCase().includes("usuário")) {
              newErrors.nomeUser = "Este nome de usuário já está em uso!";
            }
          });
        } else if (message) {
          if (message.toLowerCase().includes("e-mail")) {
            newErrors.email = message;
          }
          if (message.toLowerCase().includes("nome de usuário")) {
            newErrors.nomeUser = "Este nome de usuário já está em uso!";
          }
        }
  
        setErrors(newErrors);
      }
    }
  };
  
  const getUser = async () =>{
    const user = await api.get(`/usuarios/${idUser.id}`)

    
    setFormData({
      nomeC: user.data.nomeUser.nome_completo,
      email: user.data.nomeUser.email,
      nomeUser: user.data.nomeUser.nome_usuario,
      senha: "",
      confirmSenha: "",
      perfil: user.data.nomeUser.perfil,
    })
  }
  const getUserAll = async () =>{
    const user = await api.get(`/usuarios/`)
console.log(user.data)
    setUserList(user.data)
  
  }

  const listarUsers = async () => {
    
      getUserAll()
      
  }

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
      <div className={styles.containerCircle}>{idUser ?idUser.nome_usuario.charAt(0).toUpperCase(): null}</div>
        <div className={styles.user} onClick={toggleEditUser}>
          <span>{idUser ? idUser.nome_usuario.toUpperCase(): null}</span>
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
        <div
          className={styles.titleOption}
          onClick={() => (toggleCreateUser(), setIsEditingUser(true), getUser())}
        >
          <div>
            <FontAwesomeIcon icon={faUserPen} />
          </div>
          <p>Editar Perfil</p>
        </div>
        <div
          className={styles.titleOption}
          onClick={() => (toggleCreateUser(), setIsCreatingUser(true))}
        >
          <div>
            <FontAwesomeIcon icon={faUserPlus} />
          </div>
          <p>Criar Novo usuário</p>
        </div>
        <div
          className={styles.titleOption}
          onClick={() => (toggleCreateUser(),setIsUserListOpen(true), listarUsers())}
        >
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
      <Popup openPopup={isOpen} onClose={handleClosePopup}>
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
      {[
        { label: "Nome Completo", name: "nomeC" },
        { label: "E-mail", name: "email" },
        { label: "Nome de Usuário", name: "nomeUser" },
        { label: "Senha", name: "senha", type: "password" },
        { label: "Confirmar senha", name: "confirmSenha", type: "password" },
      ].map(({ label, name, type = "text" }) => (
        <div className={styles.blocoLabelInput} key={name}>
          <label>{label}</label>
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className={styleGlobal.inputTextChamado}
            required
            disabled={isEditingUser && (name === "email" || name === "nomeUser")}
          />
          {validated && errors[name] && (
            <span className={styleGlobal.errorMessage}>{errors[name]}</span>
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
        {validated && errors.perfil && (
          <span className={styleGlobal.errorMessage}>{errors.perfil}</span>
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
      {
        
       
          <table className={styleGlobal.table}>
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            
                          </tr>
                        </thead>
                        <tbody className={styleGlobal.tbody}>
                          { userList.map((item)=> (
                              <tr
                                key={item.id_usuario}
                               
                              >
                         
                                <td>{item.nome_completo}</td>
                                <td>{item.email}</td>
                              </tr>
                            ))}
                            
                        </tbody>
                      </table>
          
        
      }
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
