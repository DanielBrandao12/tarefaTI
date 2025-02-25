import { useCallback, useState } from "react";

import api from "../services/api";

const useHistoricos = () => {
  const [historicoStatus, setHistoricoStatus] = useState([]);
  
  const fetchHistoricoStatus = useCallback(
    async (id_ticket) => {
      try {
        const response = await api.get(`/historicoStatus/${id_ticket}`);
        const historico = response.data;

        const statusPromises = historico.map((item) =>
          api.get(`/status/${item.id_status}`)
        );
        const statusResponses = await Promise.all(statusPromises);
        const statusData = statusResponses.map((res) => res.data);

        const historicoComStatus = historico.map((item, index) => ({
          ...item,
          status: statusData[index],
        }));

        setHistoricoStatus(historicoComStatus);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      }
    },
    [setHistoricoStatus]
  );

  return {
    historicoStatus,
    fetchHistoricoStatus,
  };
};

export default useHistoricos;
