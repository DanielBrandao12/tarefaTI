import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginaPadrao from "../../components/paginaPadrao";
import styles from "./style.module.css";
import { HelpCircle, Wrench, Clock, CheckCircle } from "lucide-react";

import useTickets from "../../hooks/useTickets";
import formatarData from "../../hooks/formatDate";

const Home = () => {
  const navigate = useNavigate();

  const { allTickets, fetchChamados } = useTickets(); //retorna a lista de tickets.

  const [agClassifique, setAgClassifique] = useState(0);
  const [emAtendimento, setEmAtendimento] = useState(0);
  const [novosTickets, setNovosTickets] = useState(0);
  const [fechados, setFechados] = useState(0);

  // Função para atualizar os valores dos tickets
  const atualizarTickets = () => {
    if (allTickets) {
      setAgClassifique(
        allTickets.filter(
          (ticket) => ticket.status === "Aguardando Classificação"
        ).length
      );
      setNovosTickets(
        allTickets.filter(
          (ticket) => ticket.data_criacao === formatarData(Date.now())
        ).length
      );
      setEmAtendimento(
        allTickets.filter((ticket) => ticket.status === "Em atendimento").length
      );
      setFechados(
        allTickets.filter((ticket) => ticket.status === "Fechado").length
      );
    }
  };

  useEffect(() => {
    fetchChamados();

  }, []); // Apenas faz a primeira chamada para pegar os tickets

  useEffect(() => {
    // Atualiza os dados assim que a lista de tickets é carregada
    atualizarTickets();

    // Configura o intervalo de atualização a cada 30 segundos
    const interval = setInterval(() => {
      //console.log(allTickets);
      // fetchChamados();
      atualizarTickets();
    }, 1000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, [allTickets]); // Esse effect é chamado sempre que a lista de tickets mudar

  const handleTickets = (statusFiltro) => {
    navigate("/tickets", { state: { filtroStatus: statusFiltro } });
  };

  return (
    <PaginaPadrao>
      <div className={styles.dashboard}>
        <h1 className={styles.titulo}>Painel de Chamados</h1>

        {/* Cards de Resumo */}
        <div className={styles.resumo}>
          <div
            className={styles.card}
            onClick={() => handleTickets("Aguardando Classificação")}
          >
            <div>
              <h2>{agClassifique}</h2>
            </div>
            <div>
              <HelpCircle size={32} className={styles.icone} />
              <p>Aguardando Classificação</p>
            </div>
          </div>

          <div className={styles.card} onClick={() => handleTickets("hoje")}>
            <div>
              <h2>{novosTickets}</h2>
            </div>
            <div>
              <Clock size={32} className={styles.icone} />
              <p>Novos Hoje</p>
            </div>
          </div>

          <div
            className={styles.card}
            onClick={() => handleTickets("Em atendimento")}
          >
            <div>
              <h2>{emAtendimento}</h2>
            </div>
            <div>
              <Wrench size={32} className={styles.icone} />
              <p>Em Atendimento</p>
            </div>
          </div>

          <div className={styles.card} onClick={() => console.log("fechados")}>
            <div>
              <h2>{fechados}</h2>
            </div>
            <div>
              <CheckCircle size={32} className={styles.icone} />
              <p>Fechados</p>
            </div>
          </div>
        </div>
      </div>
    </PaginaPadrao>
  );
};

export default Home;
