import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import stylesGlobal from "../../styles/styleGlobal.module.css";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";
import api from "../../services/api";

import useUser from "../../hooks/useUser";
import useStatus from "../../hooks/useStatus";
import useTickets from "../../hooks/useTickets";
import Table from "../../components/table";

function Tickets() {
  const navigate = useNavigate();

  const { idUser } = useUser();

  const { status } = useStatus();

  const {
    chamados,
    contadorTodos,
    contadorAtMim,
    contadorAtAOutros,
    contadorNaoAt,
    filteredChamados,
    setChamados,
    setFilteredChamados,
    fetchChamados,
    atualizarContadores,
  } = useTickets();

  const [busca, setBusca] = useState("");
  const [filtroAtribuido, setFiltroAtribuido] = useState(""); // Estado para armazenar o tipo de atribuição

  const [mensagensNaoLidas, setMensagensNaoLidas] = useState({});

  const [filtro, setFiltro] = useState({
    prioridade: "",
    status: "",
  });

  const [statusAtivo, setStatusAtivo] = useState([]);

  const columns = [
    { key: "codigo_ticket", label: "Código do Ticket" },
    { key: "nome_usuarioAtribuido", label: "Técnico" },
    { key: "nome_requisitante", label: "Solicitante" },
    { key: "data_criacao", label: "Data Criação" },
    { key: "assunto", label: "Assunto" },
    { key: "status", label: "Status" },
    { key: "nivel_prioridade", label: "Prioridade" },
  ];

  useEffect(() => {
    setStatusAtivo(
      status.filter((item) => {
        return item.ativo && item.nome !== 'Fechado';
      })
    );
  }, [status]);

  //Ajustar isso, para poder ficar negrito ou algo assim quando tiver novas mensagens
  const getRespostas = async () => {
    try {
      const response = await api.get("resposta/getNaoLidas");
      const respostas = response.data;

      // Criar um mapa de tickets com respostas não lidas
      const naoLidasMap = respostas.reduce((acc, resposta) => {
        if (!acc[resposta.id_ticket]) {
          acc[resposta.id_ticket] = [];
        }
        acc[resposta.id_ticket].push(resposta.id_resposta);
        return acc;
      }, {});

      setMensagensNaoLidas(naoLidasMap);
    } catch (error) {
      console.error("Erro ao buscar respostas não lidas:", error);
    }
  };

  useEffect(() => {
    if (idUser && chamados.length > 0) {
      atualizarContadores(chamados);
      getRespostas();
    }
  }, [idUser, chamados]);

  // Aplicar filtros e busca combinados
  const aplicarFiltros = () => {
    let filtrados = [...chamados]; // Sempre trabalhar com os dados originais

    // Busca
    if (busca.trim() !== "") {
      filtrados = filtrados.filter(
        (chamado) =>
          chamado.codigo_ticket?.toLowerCase().includes(busca.toLowerCase()) ||
          chamado.nome_requisitante
            ?.toLowerCase()
            .includes(busca.toLowerCase()) ||
          chamado.assunto?.toLowerCase().includes(busca.toLowerCase()) ||
          chamado.nome_usuarioAtribuido
            ?.toLowerCase()
            .includes(busca.toLowerCase())
      );
    }

    // Filtro por prioridade
    if (filtro.prioridade) {
      filtrados = filtrados.filter(
        (chamado) => chamado.nivel_prioridade === filtro.prioridade
      );
    }

    // Filtro por status
    if (filtro.status) {
      filtrados = filtrados.filter(
        (chamado) => chamado.status === filtro.status
      );
    }

    // Filtro por atribuição
    if (filtroAtribuido === "meus") {
      filtrados = filtrados.filter(
        (chamado) => parseInt(chamado.atribuido_a) === idUser.id
      );
    } else if (filtroAtribuido === "outros") {
      filtrados = filtrados.filter(
        (chamado) =>
          parseInt(chamado.atribuido_a) &&
          parseInt(chamado.atribuido_a) !== idUser.id
      );
    } else if (filtroAtribuido === "nao_atribuido") {
      filtrados = filtrados.filter((chamado) => !chamado.atribuido_a);
    }

    setFilteredChamados(filtrados);
  };
  // Atualiza os filtros toda vez que há mudanças nos valores
  useEffect(() => {
    aplicarFiltros();
  }, [busca, filtro, filtroAtribuido, chamados]);

  const handleChamadoClick = async (chamado) => {
    if (mensagensNaoLidas[chamado.id_ticket]) {
      try {
        await api.put("resposta/updateResposta", {
          ids: mensagensNaoLidas[chamado.id_ticket], // Enviando os IDs das respostas não lidas
        });

        // Atualiza o estado para remover os tickets lidos
        setMensagensNaoLidas((prev) => {
          const updated = { ...prev };
          delete updated[chamado.id_ticket];
          return updated;
        });
      } catch (error) {
        console.error("Erro ao marcar respostas como lidas:", error);
      }
    }

    navigate(`/t/${chamado.id_ticket}`);
  };

  return (
    <PaginaPadrao>
      <div className={styles.containerCards}>
        <div className={styles.containerCardsColuna}>
          <Card>
            <div className={styles.containerButtonsChamados}>
              <input
                type="button"
                value={`Todos (${contadorTodos})`}
                className={styles.buttonChamados}
                onClick={() => setFiltroAtribuido("")}
              />
              <input
                type="button"
                value={`Atribuído a mim (${contadorAtMim})`}
                className={styles.buttonChamados}
                onClick={() => setFiltroAtribuido("meus")}
              />
              <input
                type="button"
                value={`Atribuído a outros (${contadorAtAOutros})`}
                className={styles.buttonChamados}
                onClick={() => setFiltroAtribuido("outros")}
              />
              <input
                type="button"
                value={`Não atribuído (${contadorNaoAt})`}
                className={styles.buttonChamados}
                onClick={() => setFiltroAtribuido("nao_atribuido")}
              />
            </div>
          </Card>
          <Card>
            <Table
              data={filteredChamados}
              columns={columns}
              mensagensNaoLidas={mensagensNaoLidas}
              fetchData={fetchChamados}
              click={handleChamadoClick}
            />
          </Card>
        </div>
        <div className={styles.containerCardsLinha}>
          <Card>
            <div
              className={styles.containerFilter}
              title="Busque por código do ticket, solicitante, assunto ou técnico"
            >
              <label className={styles.labelFilter}>Pesquisar por:</label>
              <input
                type="text"
                className={styles.inputFilter}
                placeholder="Digite sua pesquisa"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </Card>
          <Card>
            <div className={styles.containerFilter}>
              <h3 className={styles.titleFilter}>Filtrar por:</h3>
              <label className={styles.labelFilter}>Nível de Prioridade:</label>
              <select
                className={styles.selectFilter}
                value={filtro.prioridade}
                onChange={(e) =>
                  setFiltro({ ...filtro, prioridade: e.target.value })
                }
              >
                <option value="">Escolha a prioridade</option>
                <option value="Prioridade Baixa">Baixa</option>
                <option value="Prioridade Média">Média</option>
                <option value="Prioridade Alta">Alta</option>
              </select>
              <label className={styles.labelFilter}>Status:</label>
              <select
                className={styles.selectFilter}
                value={filtro.status}
                onChange={(e) =>
                  setFiltro({ ...filtro, status: e.target.value })
                }
              >
                <option value="">Escolha o status</option>
                {statusAtivo ? (
                  statusAtivo.map((item) => (
                    <option key={item.id_status} value={item.nome}>
                      {item.nome}
                    </option>
                  ))
                ) : (
                  <option>Sem status</option>
                )}
              </select>
              <span
                className={styles.spanLink}
                role="button"
                tabIndex="0"
                onClick={() => setFiltro({ prioridade: "", status: "" })}
              >
                Limpar filtro
              </span>
            </div>
          </Card>
        </div>
      </div>
    </PaginaPadrao>
  );
}

export default Tickets;
