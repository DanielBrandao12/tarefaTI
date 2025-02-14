import { useState, useEffect } from "react";
import api from "../services/api"; // Verifique o caminho do seu arquivo 'api.js'
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const useUser = () => {
  const [userList, setUserList] = useState([]);
  const [formData, setFormData] = useState({
    nomeC: "",
    email: "",
    nomeUser: "",
    senha: "",
    confirmSenha: "",
    perfil: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [idUser, setIdUser] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const handleClosePopup = () => {
    setIsOpen(false);
    setIsCreatingUser(false);
    setIsEditingUser(false);
    setIsUserListOpen(false);
    setErrors({});
    setFormData({
      nomeC: "",
      email: "",
      nomeUser: "",
      senha: "",
      confirmSenha: "",
      perfil: "",
    });
    setMessage("");
  };

  // Decodificar o token e carregar dados do usuário
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIdUser(decoded);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  // Função para obter os dados do usuário logado
  const getUser = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIdUser(decoded);

        const response = await api.get(`/usuarios/${decoded.id}`);
        const userData = response.data.nomeUser;
        setFormData({
          nomeC: userData.nome_completo,
          email: userData.email,
          nomeUser: userData.nome_usuario,
          senha: "",
          confirmSenha: "",
          perfil: userData.perfil,
        });
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }
  };

  // Função para obter todos os usuários
  const getUserAll = async () => {
    try {
      const response = await api.get("/usuarios/");
      setUserList(response.data);
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error);
    }
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "Campo Obrigatório!";
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Formato de e-mail inválido!";
    }

    if (formData.senha !== formData.confirmSenha) {
      newErrors.confirmSenha = "As senhas não coincidem!";
    }

    return newErrors;
  };

  // Função para criar um novo usuário
  const postUser = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/usuarios/createUser/", {
        nome_completo: formData.nomeC,
        nome_usuario: formData.nomeUser,
        email: formData.email,
        senha: formData.senha,
        perfil: formData.perfil,
      });
      setMessage(response.data.message);
      setIsCreatingUser(false);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar o usuário
  const updateUser = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/usuarios/updateUser/${idUser.id}`, {
        nome_completo: formData.nomeC,
        senha: formData.senha,
        perfil: formData.perfil,
      });
      setMessage("Usuário atualizado com sucesso!");
      setIsEditingUser(false);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para tratar erros específicos
  const handleError = (error) => {
    const { message, errors } = error.response?.data || {};
    const newErrors = {};

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
      const mensagemErro = message.toLowerCase();
      if (mensagemErro.includes("e-mail")) {
        newErrors.email = message;
      }
      if (mensagemErro.includes("nome de usuário")) {
        newErrors.nomeUser = "Este nome de usuário já está em uso!";
      }
    }

    setErrors(newErrors);
  };

  return {
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
  };
};

export default useUser;
