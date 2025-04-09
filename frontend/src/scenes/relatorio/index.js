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
  const [activeButton, setActiveButton] = useState(false);
  const handleModoSelecao = (modo) => {
    setModoSelecao(modo);
    setActiveButton(false);
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
    setActiveButton(true);
    console.log("Enviando dados:", dadosEnvio);
  };

  const formatarMes = (data) => {
    const mes = new Date(data + "-01").toLocaleDateString("pt-BR", {
      month: "long",
    });
    return mes.charAt(0).toUpperCase() + mes.slice(1);
  };

  const handlePrint = () => {
    let relatorioHTML = "";

    const getDescricaoDetalhada = () => {
      if (modoSelecao === "select") {
        const hoje = new Date().toLocaleDateString("pt-BR");
        const now = new Date();
        switch (intervalo) {
          case "hoje":
            return hoje;
          case "semana": {
            const primeiroDia = new Date(
              now.setDate(now.getDate() - now.getDay() + 1)
            );
            const ultimoDia = new Date(now.setDate(primeiroDia.getDate() + 6));
            return `${primeiroDia.toLocaleDateString(
              "pt-BR"
            )} até ${ultimoDia.toLocaleDateString("pt-BR")}`;
          }
          case "mes": {
            const mesAno = new Date().toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            });
            return mesAno.charAt(0).toUpperCase() + mesAno.slice(1);
          }
          case "ano":
            return new Date().getFullYear();
          case "todos":
            return "Todo o período";
          default:
            return "Intervalo não especificado";
        }
      } else {
        return `${new Date(dateStart).toLocaleDateString(
          "pt-BR"
        )} até ${new Date(dateEnd).toLocaleDateString("pt-BR")}`;
      }
    };

    const intervaloTexto =
      modoSelecao === "select"
        ? {
            hoje: "Hoje",
            semana: "Esta semana",
            mes: "Este mês",
            ano: "Este ano",
            todos: "Todo o período",
          }[intervalo] || "Intervalo não especificado"
        : "Intervalo personalizado";

    const descricaoDetalhada = getDescricaoDetalhada();

    if (relatorio && Object.keys(relatorio).length > 0) {
      Object.entries(relatorio).forEach(([chave, dados]) => {
        const contagemPorStatus = dados.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});
        const total = dados.length;

        relatorioHTML += `
          <div class="ticket-section">
            <div class="info-topo">
              <p><strong>${formatTitle}:</strong> ${formatDateOrTitle(
          formatTitle,
          chave
        )}</p>
            </div>
            <ul>
              ${Object.entries(contagemPorStatus)
                .map(
                  ([status, quantidade]) => `
                    <li><strong>${status}:</strong> ${quantidade}</li>
                  `
                )
                .join("")}
              <li><strong>Total:</strong> ${total}</li>
            </ul>
           
          </div>
          
        `;
      });
    } else {
      relatorioHTML = "<p>Nenhum dado disponível</p>";
    }

    const printContent = `
      <html>
        <head>
          <title>Relatório Detalhado</title>
                  <div style="text-align: right; margin-bottom: 20px;">
                    <img src="${window.location.origin}/logo.png" alt="Fatec Bragança Paulista" style="width: 20%; height: auto; border-radius: 5px;">
                  </div>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 40px;
              background: #f4f4f4;
              color: #333;
            }
            h1 {
              color: #b20000;
              margin-bottom: 5px;
            }
            .relatorio-header {
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              margin-bottom: 30px;
            }
            .relatorio-header p {
              margin: 4px 0;
            }
            .ticket-section {
              background-color: #fff;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            }
            .info-topo  p{
              margin-top: 0;
            
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              margin-bottom: 8px;
            }
            @media print {
              body {
                background: #fff;
                margin: 0;
                box-shadow: none;
              }
              .ticket-section, .relatorio-header {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="relatorio-header">
            <h1>Relatório Detalhado</h1>
            <p><strong>Tipo de Relatório:</strong> ${formatTitle}</p>
            <p><strong>Intervalo:</strong> ${intervaloTexto}</p>
            <p><strong>Data:</strong> ${descricaoDetalhada}</p>
          </div>
          ${relatorioHTML}
          <div style="text-align: right; margin-bottom: 20px;">
 
           <p style="font-size: 18px; text-align: right;"><strong>Equipe T.I Fatec Bragança Paulista</strong></p>
        
           <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
        
           <img src="${window.location.origin}/logo.png" alt="Fatec Bragança Paulista" style="width: 20%; height: auto; border-radius: 5px;">
         </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const formatarData = (data) => {
    if (!data) return "";

    const partes = data.split("-"); // ['2025', '04', '07']
    const ano = partes[0];
    const mes = partes[1];
    const dia = partes[2];

    return `${dia}/${mes}/${ano}`;
  };

  const formatDateOrTitle = (data, item) => {
    
    if (data === "Mês") {
      return formatarMes(item);
    } else if (data === "Data") {
      return formatarData(item);
    } else {
      return item;
    }
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
                      {formatDateOrTitle(formatTitle, item[0]) || "Sem dados"}
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
        {activeButton && (
          <div className={style.print}>
            <input
              type="button"
              value="Gerar relatório"
              className={stylesGlobal.buttonPadrao}
              onClick={handlePrint}
            />
          </div>
        )}
      </Card>
    </PaginaPadrao>
  );
}

export default Relatorio;
