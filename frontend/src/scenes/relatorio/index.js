import React, { useState } from "react";
import PaginaPadrao from "../../components/paginaPadrao";
import Card from "../../components/card";
import stylesGlobal from "../../styles/styleGlobal.module.css";
import style from "./style.module.css";
import useRelatorio from "../../hooks/useRelatorio";

function Relatorio() {
  //Chamar api com rota do relatorio
  //Passabar valores e exibir na tabela
  const {
    intervalo,
    tipoRelatorio,
    dateStart,
    dateEnd,
    relatorio,
    setIntervalo,
    setTipoRelatorio,
    setDateStart,
    setDateEnd,
    fetchRelatorio,
  } = useRelatorio();

  const [modoSelecao, setModoSelecao] = useState("select");
  const [formatTitle, setFormatTitle] = useState("");
  const handleModoSelecao = (modo) => {
    setModoSelecao(modo);

    // Resetando valores ao alternar
    if (modo === "select") {
      setDateStart("");
      setDateEnd("");
    } else {
      setIntervalo("");
    }
  };

  const handleSubmit = () => {
    if (modoSelecao === "select" && !intervalo) {
      alert("Escolha um intervalo de tempo.");
      return;
    }
    if (modoSelecao === "data" && (!dateStart || !dateEnd)) {
      alert("Escolha um intervalo de datas válido.");
      return;
    }

    const dadosEnvio =
      modoSelecao === "select"
        ? { intervalo: intervalo }
        : { dateStart, dateEnd };
    if (tipoRelatorio === "mes") {
      setFormatTitle("Mês");
    } else if (tipoRelatorio === "dia") {
      setFormatTitle("Data");
    } else if (tipoRelatorio === "tecnico") {
      setFormatTitle("Técnico");
    } else if (tipoRelatorio === "categoria") {
      setFormatTitle("Categoria");
    }
    fetchRelatorio();
    console.log("Enviando dados:", dadosEnvio);

  };

  const formatarMes = (data) => {
    const mes = new Date(data + "-01").toLocaleDateString("pt-BR", {
      month: "long",
    });
    return mes.charAt(0).toUpperCase() + mes.slice(1);
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
                  value={intervalo}
                  onChange={(e) => setIntervalo(e.target.value)}
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
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                />
                <label>Até</label>
                <input
                  type="date"
                  className={stylesGlobal.inputTextChamado}
                  disabled={modoSelecao !== "data"}
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={style.containerOptions}>
            <label>Tipo de Relatório</label>
            <div className={style.containerTipo}>
              <select
                name="tipo"
                className={stylesGlobal.selectChamado}
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
              >
                <option value="" disabled>
                  Escolha uma opção
                </option>
                <option value="dia">Por Dia</option>
                <option value="mes">Por mês</option>
                <option value="tecnico">Técnico</option>
                <option value="categoria">Categoria</option>
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
          <table className={stylesGlobal.table}>
            <thead className={stylesGlobal.thead}>
              <tr>
                <th>{formatTitle || "Data"}</th>
                <th>Aguardando Atendimento</th>
                <th>Em atendimento</th>
                <th>Fechados</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody className={stylesGlobal.tbody}>
              {Object.entries(relatorio) &&
              Object.entries(relatorio).length > 0 ? (
                Object.entries(relatorio).map((item, index) => (
                  <tr key={index} style={{ cursor: "auto" }}>
                    <td>
                      {" "}
                      {formatTitle === "Mês"
                        ? formatarMes(item[0])
                        : item[0] || "Sem dados"}
                    </td>

                    <td>
                      {
                        item[1].filter(
                          (value) => value.status === "Aguardando Atendimento"
                        ).length
                      }
                    </td>
                    <td>
                      {
                        item[1].filter(
                          (value) => value.status === "Em atendimento"
                        ).length
                      }
                    </td>
                    <td>
                      {
                        item[1].filter((value) => value.status === "Fechado")
                          .length
                      }
                    </td>
                    <td>{item[1].length}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Nenhum dado disponível
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PaginaPadrao>
  );
}

export default Relatorio;
