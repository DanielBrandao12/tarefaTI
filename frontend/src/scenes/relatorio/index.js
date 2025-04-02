import React, { useState } from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";
import stylesGlobal from "../../styles/styleGlobal.module.css";
import style from "./style.module.css";
import useRelatorio from "../../hooks/useRelatorio";

function Relatorio() {
  const {
    filtro,
    todayTickets,
    weekTickets,
    monthTickets,
    yearTickets,
    allTickets,
    setFiltro,
    filtrarPorPeriodo,
  } = useRelatorio();

  const [modoSelecao, setModoSelecao] = useState("select");
  const [intervaloSelecionado, setIntervaloSelecionado] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [tickets, setTickets] = useState([])
  const handleModoSelecao = (modo) => {
    setModoSelecao(modo);

    // Resetando valores ao alternar
    if (modo === "select") {
      setDataInicio("");
      setDataFim("");
    } else {
      setIntervaloSelecionado("");
    }
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

    const dadosEnvio =
      modoSelecao === "select"
        ? { intervalo: intervaloSelecionado }
        : { dataInicio, dataFim };
    if(intervaloSelecionado === 'hoje'){
        setTickets(intervaloSelecionado)
        console.log(todayTickets)
    }
    console.log("Enviando dados:", dadosEnvio);
  };

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
                  name="intervalo"
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
              <select name="tipo" className={stylesGlobal.selectChamado}>
                <option value="" disabled>
                  Escolha uma opção
                </option>
                <option>Por Dia</option>
                <option>Por mês</option>
                <option>Técnico</option>
                <option>Categoria</option>
              </select>
              <input
                type="button"
                value="Exibir relatório"
                className={stylesGlobal.buttonPadrao}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div>
      { tickets ==='hoje'?
      (
      <table className={stylesGlobal.table}>
      <thead className={stylesGlobal.thead}>
        <tr>
          <th>Data</th>
          <th>Novos Chamados</th>
          <th>Aguardando Atendimento</th>
          <th>Em atendimento</th>
          <th>Fechado</th>
        </tr>
      </thead>
      <tbody className={stylesGlobal.tbody}>
          {todayTickets.map((item)=>(
        <tr style={{ cursor: "auto" }}>
       

             <td>{item.data_criacao}</td>
             <td>{todayTickets.length}</td>
       
           
        </tr>
          ))}
         
      </tbody>
    </table>
    ):(<div></div>)}
          
          <table className={stylesGlobal.table}>
            <thead className={stylesGlobal.thead}>
              <tr>
                <th>Técnico</th>
                <th>Novos Chamados</th>
                <th>Aguardando Atendimento</th>
                <th>Em atendimento</th>
                <th>Fechado</th>
              </tr>
            </thead>
            <tbody className={stylesGlobal.tbody}>
              <tr style={{ cursor: "auto" }}>
                <td>Daniel</td>
                <td>5</td>
                <td>1</td>
                <td>0</td>
                <td>10</td>
              </tr>
            </tbody>
          </table>
          <table className={stylesGlobal.table}>
            <thead className={stylesGlobal.thead}>
              <tr>
                <th>Categoria</th>
                <th>Novos Chamados</th>
                <th>Aguardando Atendimento</th>
                <th>Em atendimento</th>
                <th>Fechado</th>
              </tr>
            </thead>
            <tbody className={stylesGlobal.tbody}>
              <tr style={{ cursor: "auto" }}>
                <td>Hardware</td>
                <td>5</td>
                <td>1</td>
                <td>0</td>
                <td>10</td>
              </tr>
            </tbody>
          </table>
          <table className={stylesGlobal.table}>
            <thead className={stylesGlobal.thead}>
              <tr>
                <th>Mês</th>
                <th>Novos Chamados</th>
                <th>Aguardando Atendimento</th>
                <th>Em atendimento</th>
                <th>Fechado</th>
              </tr>
            </thead>
            <tbody className={stylesGlobal.tbody}>
              <tr style={{ cursor: "auto" }}>
                <td>Março</td>
                <td>5</td>
                <td>1</td>
                <td>0</td>
                <td>10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </PaginaPadrao>
  );
}

export default Relatorio;
