import React from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import styles from "./style.module.css";
import {HelpCircle, Wrench , Briefcase, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const Home = () => {
  // Dados fictícios dos chamados
  const chamados = [
    {
      id: 1,
      titulo: "Erro no login",
      status: "Aguardando",
      data: "07/02/2025",
    },
    {
      id: 2,
      titulo: "Sistema fora do ar",
      status: "Em andamento",
      data: "07/02/2025",
    },
    {
      id: 3,
      titulo: "Solicitação de acesso",
      status: "Novo",
      data: "07/02/2025",
    },
    {
      id: 4,
      titulo: "Erro na impressão",
      status: "Concluído",
      data: "06/02/2025",
    },
  ];

  return (
    <PaginaPadrao>
      <div className={styles.dashboard}>
        <h1 className={styles.titulo}>Painel de Chamados</h1>

        {/* Cards de Resumo */}
        <div className={styles.resumo}>
          <div className={styles.card}>
            <div>
              <h2>8</h2>
            </div>
            <div>
              <HelpCircle size={32} className={styles.icone} />
              <p>Aguardando Classificação</p>
            </div>
          </div>

          <div className={styles.card}>
            <div>
              <h2>5</h2>
            </div>
            <div>
              <Clock size={32} className={styles.icone} />
              <p>Novos Hoje</p>
            </div>
          </div>

          <div className={styles.card}>
            <div>
              <h2>12</h2>
            </div>
            <div>
              <Wrench  size={32} className={styles.icone} />
              <p>Em Atendimento</p>
            </div>
          </div>

          <div className={styles.card}>
            <div>
              <h2>20</h2>
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
