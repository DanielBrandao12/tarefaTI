import  { useState, useEffect } from "react";


import api from "../services/api";


import useUser from "./useUser";

const useTickets = () => {


 const { idUser } = useUser();
  // Estados para armazenar dados e controlar o comportamento do componente
  const [chamado, setChamado] = useState({});

  const [respostas, setRespostas] = useState([]);
    const [message, setMessage] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [statusNome, setStatusNome] = useState();
  const [categoriaNome, setCategoriaNome] = useState();
  const [usuarioAtribuido, setUsuarioAtribuido] = useState();
  const [nivelPrioridade, setNivelPrioridade] = useState();

  const [edit, setEdit] = useState(false);

  // Funções para controlar o Popup
  const handleOpenPopup = (mensagem) => {
    setMessage(mensagem);
    setIsPopupOpen(true);
  };
  

  // Busca os detalhes do chamado pelo ID
    const fetchChamado = async (id_ticket) => {
      try {
        const response = await api.get(`/tickets/${id_ticket}`);

        setChamado(response.data.ticket);

        if (response.data.respostas.length > 0) {
          const respostasComAnexos = await Promise.all(
            response.data.respostas.map(async (resposta) => {
              try {
                // Busca os anexos para cada resposta
                const anexoR = await api.get(`/anexo/${resposta.id_resposta}`);
                return {
                  ...resposta,
                  anexos: anexoR.data.length > 0 ? anexoR.data : [],
                };
              } catch (error) {
                console.error(
                  `Erro ao buscar anexos para a resposta ${resposta.id_resposta}:`,
                  error
                );
                return { ...resposta, anexos: [] }; // Garante que a resposta será mostrada sem anexos
              }
            })
          );

          setRespostas(respostasComAnexos);
        } else {
          setRespostas([]); // Garante que o estado não fique indefinido
        }
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
      }
    };
   

     //Atribui o nome do user ao chamado
    const fetchUserAtribuido = async (chamado) => {
      try {
        // Verifica se o chamado tem um 'id_usuario' atribuído
        if (chamado.atribuido_a) {
          const response = await api.get(`/usuarios/${chamado.atribuido_a}`);
          setChamado((prevChamado) => ({
            ...prevChamado,
            nome_usuarioAtribuido: response.data.nomeUser.nome_usuario,
          }));
         
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

  //Salvar edição

  const salvarEdicao = async (id_ticket) => {
    try {
      if (!id_ticket) {
        handleOpenPopup("ID do ticket não fornecido.");
        return;
      }

      // Criar um objeto com os dados atualizados
      const dadosAtualizados = {
        id_ticket,
        id_categoria: categoriaNome || chamado.id_categoria,
        nivel_prioridade: nivelPrioridade || chamado.nivel_prioridade,
        id_status: statusNome || null,
        atribuido_a: usuarioAtribuido || chamado.atribuido_a,
        id_usuario: idUser.id,
      };

      // Enviar requisição de atualização
      const response = await api.put(`/tickets/updateTicket`, dadosAtualizados);

      if (response.status === 200) {
        handleOpenPopup("Ticket alterado com sucesso!");

        // Atualizar estado do chamado com os novos valores
        setChamado((prevChamado) => ({
          ...prevChamado,
          id_categoria: dadosAtualizados.id_categoria,
          nivel_prioridade: dadosAtualizados.nivel_prioridade,
          id_status: dadosAtualizados.id_status,
          atribuido_a: dadosAtualizados.atribuido_a,
        }));

        // Se um técnico foi atribuído, buscar o nome atualizado
        if (dadosAtualizados.atribuido_a) {
          try {
            const userResponse = await api.get(
              `/usuarios/${dadosAtualizados.atribuido_a}`
            );
            console.log(userResponse);
            setChamado((prevChamado) => ({
              ...prevChamado,
              nome_usuarioAtribuido: userResponse.data.nomeUser.nome_usuario,
            }));
          } catch (error) {
            console.error("Erro ao buscar usuário atribuído:", error);
          }
        }

        // Resetar estados da edição
        setEdit(false);
        setNivelPrioridade("");
        setCategoriaNome("");
        setStatusNome("");
        setUsuarioAtribuido("");
      } else {
        handleOpenPopup(
          `Falha ao atualizar o ticket. Código: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar o ticket:", error);
      handleOpenPopup(
        "Ocorreu um erro ao salvar as alterações. Tente novamente."
      );
    }
  };


  return {

    chamado,
    respostas,
    edit,
    statusNome,
    categoriaNome,
    usuarioAtribuido,
    isPopupOpen,
    message,
    setIsPopupOpen,
    setEdit,
    setStatusNome,
    setCategoriaNome,
    setNivelPrioridade,
    setUsuarioAtribuido,
    setRespostas,
    handleOpenPopup,
    fetchChamado,
    fetchUserAtribuido,
    salvarEdicao
  
  };
};

export default useTickets;
