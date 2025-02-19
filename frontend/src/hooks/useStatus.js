import { useState, useEffect } from "react";
import api from "../services/api";

const useStatus = () => {
  const [error, setError] = useState({
    nome: false,
    status: false,
  });

  const [titleForm, setTitleForm] = useState("Adicionar Status");
  const [showEdit, setShowEdit] = useState(false);
  const [isEditIconDisabled, setIsEditIconDisabled] = useState(false);
  const [status, setStatus] = useState([]);
  const [idStatus, setIdStatus] = useState();
  const [statusNome, setStatusNome] = useState("");
  const [situacaoStatus, setSituacaoStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const getAllStatus = async () => {
    try {
      const response = await api.get("/status/");
      setStatus(response.data);
      setError(false);
    } catch (error) {
      console.error("Erro ao buscar status:", error);
      setError(true);
    }
  };

  useEffect(() => {
    getAllStatus();
  }, []);

  const toggleEdit = (id, status, situacao) => {
    setIdStatus(id);
    setStatusNome(status);
    setSituacaoStatus(!situacao);
    setShowEdit(!showEdit);
    setIsEditIconDisabled(!isEditIconDisabled);
    setTitleForm("Editar Status");
    setError("");
  };

  // Função para cancelar o modo de edição
  const cancelEdit = () => {
    setShowEdit(false); // Oculta o formulário de edição
    setIsEditIconDisabled(false); // Habilita o ícone de edição novamente
    setTitleForm("Adicionar Status"); // Altera o título do formulário para "Adicionar"
    setStatusNome(""); // Limpa o campo de nome da categoria
    setSituacaoStatus(""); // Limpa o campo de status da categoria
    setError("");
  };

  const createStatus = async () => {
    const hasError = !statusNome || situacaoStatus === "";
    setError({
      nome: !statusNome,
      status: situacaoStatus === "",
    });
    if (hasError) return;

    try {
      await api.post("/status/createStatus", {
        nome: statusNome,
        ativo: situacaoStatus === "Ativo",
      });

      setModalMessage("Status adicionado com sucesso!");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);

      setStatusNome("");
      setSituacaoStatus("");
      await getAllStatus();
    } catch (error) {
      console.error("Erro ao criar Status", error);
    }
  };

  const editStatus = async () => {
    const hasError = !statusNome || situacaoStatus === "";
    setError({
      nome: !statusNome,
      status: situacaoStatus === "",
    });
    if (hasError) return;

    try {
      await api.put("/status/updateStatus", {
        id_status: idStatus,
        nome: statusNome,
        ativo: situacaoStatus === "Ativo",
      });

      setModalMessage("Status editado com sucesso!");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      cancelEdit();
      setStatusNome("");
      setSituacaoStatus("");
      await getAllStatus();
    } catch (error) {
      console.error("Erro ao editar Status", error);
    }
  };

  return {
    error,
    titleForm,
    isEditIconDisabled,
    status,
    idStatus,
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
  };
};

export default useStatus;
