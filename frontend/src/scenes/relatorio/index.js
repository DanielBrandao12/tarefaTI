import React, { useState } from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";
import stylesGlobal from "../../styles/styleGlobal.module.css";
import style from "./style.module.css";
import useRelatorio from "../../hooks/useRelatorio";

function Relatorio() {
  const { todayTickets, weekTickets, monthTickets, yearTickets, allTickets } =
    useRelatorio();

  const [modoSelecao, setModoSelecao] = useState("select");
  const [intervaloSelecionado, setIntervaloSelecionado] = useState("");
  const [tipoRelatorio, setTipoRelatorio] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [ticketsFiltrados, setTicketsFiltrados] = useState([]);
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false);

  const handleModoSelecao = (modo) => {
    setModoSelecao(modo);
    setTicketsFiltrados([]);
  };

  const handleSubmit = () => {
    if (modoSelecao === "select" && !intervaloSelecionado) {
      alert("Escolha um intervalo de tempo.");
      return;
    }
    if (modoSelecao === "data" && (!dataInicio || !dataFim)) {
      alert("Escolha um intervalo de datas válido.");
      return;
    }
    if (!tipoRelatorio) {
      alert("Escolha um tipo de relatório.");
      return;
    }

    let tickets = [];
    switch (intervaloSelecionado) {
      case "hoje":
        tickets = todayTickets;
        break;
      case "semana":
        tickets = weekTickets;
        break;
      case "mes":
        tickets = monthTickets;
        break;
      case "ano":
        tickets = yearTickets;
        break;
      case "todos":
        tickets = allTickets;
        break;
      default:
        tickets = [];
    }

    setTicketsFiltrados(tickets);
    setMostrarRelatorio(true);
  };

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <PaginaPadrao>
      <Card>
        <div className={style.container}>
          <div className={style.containerOptions}>
            <label>Intervalo de datas</label>
            <div className={style.interlavoData}>
              <div>
                <input
                  type="radio"
                  name="selecao"
                  checked={modoSelecao === "select"}
                  onChange={() => handleModoSelecao("select")}
                />
                <select
                  className={stylesGlobal.selectChamado}
                  disabled={modoSelecao !== "select"}
                  value={intervaloSelecionado}
                  onChange={(e) => setIntervaloSelecionado(e.target.value)}
                >
                  <option value="" disabled>
                    Escolha uma opção
                  </option>
                  <option value="hoje">Hoje</option>
                  <option value="semana">Esta semana</option>
                  <option value="mes">Este mês</option>
                  <option value="ano">Este ano</option>
                  <option value="todos">Todo período</option>
                </select>
              </div>
              <div>
                <input
                  type="radio"
                  name="selecao"
                  checked={modoSelecao === "data"}
                  onChange={() => handleModoSelecao("data")}
                />
                <label>De</label>
                <input
                  type="date"
                  className={stylesGlobal.inputTextChamado}
                  disabled={modoSelecao !== "data"}
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
                <label>Até</label>
                <input
                  type="date"
                  className={stylesGlobal.inputTextChamado}
                  disabled={modoSelecao !== "data"}
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={style.containerOptions}>
            <label>Tipo de Relatório</label>
            <div className={style.containerTipo}>
              <select
                className={stylesGlobal.selectChamado}
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
              >
                <option value="" disabled>
                  Escolha uma opção
                </option>{" "}
                <option value="dia">Por Dia</option>{" "}
                <option value="mes">Por Mês</option>{" "}
                <option value="tecnico">Por Técnico</option>{" "}
                <option value="categoria">Por Categoria</option>{" "}
              </select>{" "}
              <input
                type="button"
                value="Exibir relatório"
                className={stylesGlobal.buttonPadrao}
                onClick={handleSubmit}
              />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </Card>
      {mostrarRelatorio && (
        <Card>
          <div>
            {ticketsFiltrados.length > 0 ? (
              <table className={stylesGlobal.table}>
                <thead className={stylesGlobal.thead}>
                  <tr>
                    {tipoRelatorio === "dia" && <th>Data</th>}
                    {tipoRelatorio === "mes" && <th>Mês</th>}
                    {tipoRelatorio === "tecnico" && <th>Técnico</th>}
                    {tipoRelatorio === "categoria" && <th>Categoria</th>}
                    <th>Total</th>
                    <th>Aguardando Atendimento</th>
                    <th>Em Atendimento</th>
                    <th>Fechado</th>
                  </tr>
                </thead>
                <tbody className={stylesGlobal.tbody}>
                  {tipoRelatorio === "dia" &&
                    ticketsFiltrados.map((ticket, index) => (
                      <tr key={index}>
                        <td>{ticket.data_criacao}</td>
                        <td>{ticketsFiltrados.length}</td>
                        <td>
                          {
                            ticketsFiltrados.filter(
                              (t) => t.status === "Aguardando atendimento"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            ticketsFiltrados.filter(
                              (t) => t.status === "Em atendimento"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            ticketsFiltrados.filter(
                              (t) => t.status === "Fechado"
                            ).length
                          }
                        </td>
                      </tr>
                    ))}

                  {tipoRelatorio === "mes" &&
                    Object.entries(
                      ticketsFiltrados.reduce((acc, ticket) => {
                        const mes = new Date(ticket.data_criacao).getMonth();
                        acc[mes] = acc[mes] || [];
                        acc[mes].push(ticket);
                        return acc;
                      }, {})
                    ).map(([mes, tickets]) => (
                      <tr key={mes}>
                        <td>{meses[mes]}</td>
                        <td>{tickets.length}</td>
                        <td>
                          {
                            tickets.filter(
                              (t) => t.status === "Aguardando atendimento"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            tickets.filter((t) => t.status === "Em atendimento")
                              .length
                          }
                        </td>
                        <td>
                          {tickets.filter((t) => t.status === "Fechado").length}
                        </td>
                      </tr>
                    ))}

                  {tipoRelatorio === "tecnico" &&
                    Object.entries(
                      ticketsFiltrados.reduce((acc, ticket) => {
                        const tecnico = ticket.tecnico || "Não atribuído";
                        acc[tecnico] = acc[tecnico] || [];
                        acc[tecnico].push(ticket);
                        return acc;
                      }, {})
                    ).map(([tecnico, tickets]) => (
                      <tr key={tecnico}>
                        <td>{tecnico}</td>
                        <td>{tickets.length}</td>
                        <td>
                          {
                            tickets.filter(
                              (t) => t.status === "Aguardando atendimento"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            tickets.filter((t) => t.status === "Em atendimento")
                              .length
                          }
                        </td>
                        <td>
                          {tickets.filter((t) => t.status === "Fechado").length}
                        </td>
                      </tr>
                    ))}

{tipoRelatorio === "categoria" &&
                    Object.entries(
                      ticketsFiltrados.reduce((acc, ticket) => {
                        const categoria = ticket.categoria || "Não atribuído";
                        acc[categoria] = acc[categoria] || [];
                        acc[categoria].push(ticket);
                        return acc;
                      }, {})
                    ).map(([categoria, tickets]) => (
                      <tr key={categoria}>
                        <td>{categoria}</td>
                        <td>{tickets.length}</td>
                        <td>
                          {
                            tickets.filter(
                              (t) => t.status === "Aguardando atendimento"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            tickets.filter((t) => t.status === "Em atendimento")
                              .length
                          }
                        </td>
                        <td>
                          {tickets.filter((t) => t.status === "Fechado").length}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: "center" }}>
                Nenhum chamado encontrado para o período selecionado.
              </p>
            )}
          </div>
        </Card>
      )}
    </PaginaPadrao>
  );
}

export default Relatorio;
