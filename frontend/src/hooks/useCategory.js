import { useState, useEffect } from "react";
import api from "../services/api";

import useUser from "./useUser";

const useCategory = () => {

  const {idUser} = useUser();

  // Estado para armazenar os erros de validação dos campos
  const [error, setError] = useState({
    nome: false,
    status: false,
  });

  // Estado para armazenar as categorias
  const [categorys, setCategorys] = useState([]);

  const [categoria, setCategoria] = useState([])
  // Controle de exibição do modal e mensagem do modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Estados para os campos do formulário
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [statusCategoria, setStatusCategoria] = useState("");

  // Estado para armazenar o ID da categoria ao editar
  const [idCategory, setIdCategory] = useState();

  // Estado para o título do formulário (Adicionar ou Editar)
  const [titleForm, setTitleForm] = useState("Adicionar Categoria");

  // Controle de exibição do formulário de edição
  const [showEdit, setShowEdit] = useState(false);

  // Controle de desabilitação do ícone de edição
  const [isEditIconDisabled, setIsEditIconDisabled] = useState(false);

  // Função para buscar todas as categorias da API
  const getAllCategorys = async () => {
    try {
      const response = await api.get("/categoria/"); // Chama o endpoint para buscar categorias
      setCategorys(response.data); // Armazena os dados na variável de estado
      setError(false); // Reseta o erro caso a requisição tenha sucesso
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setError(true); // Sinaliza que houve um erro
    }
  };

  // useEffect para chamar a função getAllCategorys ao montar o componente
  useEffect(() => {
    getAllCategorys(); // Chama a função ao montar o componente
  }, []); // O array vazio garante que a função será chamada apenas uma vez

  // Função para criar uma nova categoria
  const createCategory = async () => {
    // Verifica se há erros nos campos obrigatórios
    const hasError = !nomeCategoria || !statusCategoria;
    setError({
      nome: !nomeCategoria,
      status: !statusCategoria,
    });

    if (hasError) return; // Interrompe a execução se houver erros
    const nomeUser = idUser.nome_usuario
    try {
      // Envia a requisição para criar uma nova categoria
       await api.post("/categoria/createCategory", {
        nomeCategoria,
        statusCategoria,
        nomeUser
      
      });

      // Exibe mensagem de sucesso no modal
      setModalMessage("Categoria adicionada com sucesso!");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);

      // Limpa os campos do formulário
      setNomeCategoria("");
      setStatusCategoria("");

      // Atualiza a lista de categorias
      await getAllCategorys();
    } catch (error) {
      console.error("Erro ao criar categoria", error);
    }
  };

  // Função para editar uma categoria existente
  const editCategory = async () => {
    // Verifica se há erros nos campos obrigatórios
    const hasError = !nomeCategoria || !statusCategoria;
    setError({
      nomeCategoria: !nomeCategoria,
      statusCategoria: !statusCategoria,
    });

    if (hasError) return; // Interrompe a execução se houver erros

    try {
      // Envia a requisição para editar a categoria
      const response = await api.put("/categoria/editCategory", {
        idCategory,
        nomeCategoria,
        statusCategoria,
      });
      const categoriaEditada = response.data;
      console.log(categoriaEditada);

      // Cancela o modo de edição e exibe mensagem de sucesso no modal
      cancelEdit();
      setModalMessage("Categoria editada com sucesso!");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);

      // Limpa os campos do formulário
      setNomeCategoria("");
      setStatusCategoria("");

      // Atualiza a lista de categorias
      await getAllCategorys();
    } catch (error) {
      console.error("Erro ao editar categoria", error);
    }
  };

  // Função para alternar para o modo de edição
  const toggleEdit = (id, categoria, status) => {
    setIdCategory(id); // Define o ID da categoria para edição
    setNomeCategoria(categoria); // Preenche o nome da categoria no formulário
    setStatusCategoria(status); // Preenche o status da categoria no formulário
    setShowEdit(!showEdit); // Alterna a exibição do formulário de edição
    setIsEditIconDisabled(!isEditIconDisabled); // Desabilita o ícone de edição
    setTitleForm("Editar Categoria"); // Altera o título do formulário para "Editar"
    setError("")
  };

  // Função para cancelar o modo de edição
  const cancelEdit = () => {
    setShowEdit(false); // Oculta o formulário de edição
    setIsEditIconDisabled(false); // Habilita o ícone de edição novamente
    setTitleForm("Adicionar Categoria"); // Altera o título do formulário para "Adicionar"
    setNomeCategoria(""); // Limpa o campo de nome da categoria
    setStatusCategoria(""); // Limpa o campo de status da categoria
    setError("")
  };


    // Busca a categoria do chamado
   
      const fetchCategoria = async (chamado) => {
        try {
          if (chamado.id_categoria) {
            const response = await api.get(`/categoria/${chamado.id_categoria}`);
            setCategoria(response.data.nome);
          }
        } catch (error) {
          console.error("Erro ao buscar categoria:", error);
        }
      };
      fetchCategoria();
   
  /*
  // Função para excluir uma categoria
  const deleteCategory = async (id, status) => {
    try {
      console.log(id, status);

      // Envia os parâmetros como query string
      const response = await api.delete(`/categoria/deleteCategory`, {
        params: { id, status },
      });

      // Verifica se a categoria está ativa
      if (status === "Ativo") {
        setModalMessage("Categoria em uso, desative para excluir a categoria");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 1000);
      } else {
        // Mensagem de sucesso no modal
        setModalMessage("Categoria excluída com sucesso!");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);

        setNomeCategoria("");
        setStatusCategoria("");

        // Atualiza a lista de categorias
        await getAllCategory();
      }
    } catch (error) {
      console.error("Erro ao excluir categoria", error);
    }
  };
*/

  // Retorna os estados e funções para uso no componente
  return {
    categorys,
    categoria,
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
    fetchCategoria
  };
};

export default useCategory;
