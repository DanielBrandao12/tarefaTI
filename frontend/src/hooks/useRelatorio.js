import { useState } from "react";

import api from "../services/api";

const useRelatorio = () => {

  const [intervalo, setIntervalo] = useState("");
  const [tipoRelatorio, setTipoRelatorio] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [relatorio, setRelatorio] = useState([]);

  const fetchRelatorio = async () => {
    try {
      const response = await api.get("relatorio/", {
        params: {
          intervalo,
          tipoRelatorio,
          dateStart,
          dateEnd,
        },
      });
      setRelatorio(response.data);
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
    }
  };
  return {
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
  };
};

export default useRelatorio;
