import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./style.module.css";

import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";
import Table from "../../components/table";

import useTickets from "../../hooks/useTickets";

function TicketsClose() {
  const navigate = useNavigate();
  const { allTickets, fetchChamados } = useTickets();
  const [busca, setBusca] = useState("");
  const [filteredChamados, setFilteredChamados] = useState([]);

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
    fetchChamados();
  }, []);

  useEffect(() => {
    let filtrados = allTickets.filter(
      (chamado) => chamado.status === "Fechado"
    );
    console.log(allTickets);
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

    setFilteredChamados(filtrados);
  }, [busca, allTickets]);

  const handleChamadoClick = (chamado) => {
    navigate(`/t/${chamado.id_ticket}`);
  };

  return (
    <PaginaPadrao>
      <div className={styles.containerCards}>
        <div className={styles.containerCardsColuna}>
          <div className={styles.containerFilter}>
            <div className={styles.title}>
              <h1>Chamados Fechados</h1>
            </div>
            <div
              className={styles.search}
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
          </div>

          <Card>
            <Table
              data={filteredChamados}
              columns={columns}
              mensagensNaoLidas={{}}
              fetchData={fetchChamados}
              click={handleChamadoClick}
            />
          </Card>
        </div>
      </div>
    </PaginaPadrao>
  );
}

export default TicketsClose;
