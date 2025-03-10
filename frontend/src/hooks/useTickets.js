import { useCallback,useEffect, useState } from "react";

import api from "../services/api";

import useUser from "./useUser";
import formatarData from "./formatDate";

const useTickets = () => {
  const { idUser } = useUser();
  

  // Estados para armazenar dados e controlar o comportamento do componente
  const [chamado, setChamado] = useState({});
  const [chamados, setChamados] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filteredChamados, setFilteredChamados] = useState([]);
  const [statusNome, setStatusNome] = useState();
  const [categoriaNome, setCategoriaNome] = useState();
  const [usuarioAtribuido, setUsuarioAtribuido] = useState();
  const [nivelPrioridade, setNivelPrioridade] = useState();
  const [resposta, setResposta] = useState("");
  const [edit, setEdit] = useState(false);
  const [contadorTodos, setContadorTodos] = useState(0);
  const [contadorAtMim, setContadorAtMim] = useState(0);
  const [contadorAtAOutros, setContadorAtAOutros] = useState(0);
  const [contadorNaoAt, setContadorNaoAt] = useState(0);
  const [allTickets, setAllTickets] = useState([]);
  const [newTicket, setNewTicket] = useState([]);
  // Funções para controlar o Popup
  const handleOpenPopup = (mensagem) => {
    setMessage(mensagem);
    setIsPopupOpen(true);
  };

  // Buscar chamados do backend e atualizar contadores
  const fetchChamados = async () => {
    try {
      const response = await api.get("/tickets/");

      setAllTickets(response.data)
      console.log(response.data)
      const chamados = response.data.filter((item) => {
        return item.status !== 'Fechado'
      });

      // Cria um array de promessas para buscar os usuários atribuídos
      const promessas = chamados.map(async (chamado) => {
        if (chamado.atribuido_a) {
          const responseUsuario = await api.get(
            `/usuarios/${chamado.atribuido_a}`
          );
          chamado.nome_usuarioAtribuido =
            responseUsuario.data.nomeUser.nome_usuario;
        
        }
        chamado.data_criacao = formatarData(chamado.data_criacao)
        return chamado;
      });
      
      // Aguarda todas as requisições terminarem
      const chamadosComUsuarios = await Promise.all(promessas);

      // Atualiza o estado com os chamados e os nomes dos usuários atribuídos
      setChamados(chamadosComUsuarios);
      setFilteredChamados(chamadosComUsuarios); // Inicializa com todos os chamados
      atualizarContadores(chamadosComUsuarios);
    } catch (error) {
      console.error("Erro ao buscar tickets ou usuários:", error);
    }
  };


  
  //Atualizar contadores
  const atualizarContadores =(dados) => {
    setContadorTodos(dados.length);

    setContadorAtMim(
      dados.filter((chamado) => parseInt(chamado.atribuido_a) === idUser.id)
        .length
    );
    setContadorAtAOutros(
      dados.filter(
        (chamado) =>
          parseInt(chamado.atribuido_a) &&
          parseInt(chamado.atribuido_a) !== idUser.id
      ).length
    );
    setContadorNaoAt(dados.filter((chamado) => !chamado.atribuido_a).length);
    setNewTicket(chamados.filter(ticket =>ticket.data_criacao === formatarData(Date.now())).length);
  };

  // Busca os detalhes do chamado pelo ID
  const fetchChamado = useCallback(
    async (id_ticket) => {
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
    },
    [setChamado, setRespostas]
  );

  //Atribui o nome do user ao chamado
  const fetchUserAtribuido = useCallback(async (chamado) => {
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
  }, []);

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

  // Envia uma nova resposta para o chamado
  const sendResposta = async (codigoTicket, remetente, id_ticket, idUser) => {
    try {
      if (!resposta || !resposta.trim()) {
        handleOpenPopup("A resposta não pode estar vazia.");
        return;
      }

      const response = await api.post("/resposta/createResposta", {
        resposta,
        id_ticket,
        id_usuario: idUser.id,
        codigoTicket,
        remetente,
      });
      //aqui vai ter uma função para enviar para o email do requisitante.

      // Atualiza a lista de respostas e limpa o campo
      handleOpenPopup("Mensagem Enviada com sucesso!");
      setRespostas((prevRespostas) => [
        ...prevRespostas,
        response.data.respostaCriada,
      ]);
      console.log(response.data);
      setResposta("");
    } catch (error) {
      console.error("Erro ao enviar a resposta:", error);
      handleOpenPopup("Erro ao enviar a resposta. Tente novamente.");
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
    resposta,
    chamados,
    contadorTodos,
    contadorAtMim,
    contadorAtAOutros,
    contadorNaoAt,
    filteredChamados,
    allTickets,
    newTicket,
    setFilteredChamados,
    setResposta,
    sendResposta,
    setIsPopupOpen,
    setEdit,
    setStatusNome,
    setCategoriaNome,
    setNivelPrioridade,
    setUsuarioAtribuido,
    setChamados,
    setRespostas,
    handleOpenPopup,
    fetchChamado,
    fetchUserAtribuido,
    salvarEdicao,
    atualizarContadores,
    fetchChamados,
  };
};

export default useTickets;
