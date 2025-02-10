import React from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import styles from "./style.module.css";
import { Briefcase, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Home = () => {
  // Dados fictícios dos chamados
  const chamados = [
    { id: 1, titulo: "Erro no login", status: "Aguardando", data: "07/02/2025" },
    { id: 2, titulo: "Sistema fora do ar", status: "Em andamento", data: "07/02/2025" },
    { id: 3, titulo: "Solicitação de acesso", status: "Novo", data: "07/02/2025" },
    { id: 4, titulo: "Erro na impressão", status: "Concluído", data: "06/02/2025" },
  ];

  // Dados do gráfico (chamados por status)
  const dadosGrafico = [
    { status: "Novo", quantidade: 5 },
    { status: "Aguardando", quantidade: 8 },
    { status: "Em andamento", quantidade: 12 },
    { status: "Concluído", quantidade: 20 },
  ];

  return (
    <PaginaPadrao>
      <div className={styles.dashboard}>
        <h1 className={styles.titulo}>Painel de Chamados</h1>

        {/* Cards de Resumo */}
        <div className={styles.resumo}>
          <div className={styles.card}>
            <Briefcase size={32} className={styles.icone} />
            <div>
              <h2>8</h2>
              <p>Aguardando Classificação</p>
            </div>
          </div>

          <div className={styles.card}>
            <Clock size={32} className={styles.icone} />
            <div>
              <h2>5</h2>
              <p>Novos Hoje</p>
            </div>
          </div>

          <div className={styles.card}>
            <AlertTriangle size={32} className={styles.icone} />
            <div>
              <h2>12</h2>
              <p>Em Andamento</p>
            </div>
          </div>

          <div className={styles.card}>
            <CheckCircle size={32} className={styles.icone} />
            <div>
              <h2>20</h2>
              <p>Concluídos</p>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className={styles.graficoContainer}>
          <h2>Distribuição de Chamados</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosGrafico}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#b20000
              " />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de Chamados Recentes */}
        <div className={styles.listaChamados}>
          <h2>Últimos Chamados</h2>
          <ul>
            {chamados.map((chamado) => (
              <li key={chamado.id}>
                <span>{chamado.titulo}</span>
                <span className={`${styles.status} ${styles[chamado.status.toLowerCase()]}`}>
                  {chamado.status}
                </span>
                <span>{chamado.data}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PaginaPadrao>
  );
};

export default Home;
