import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import api from "../services/api";

const useTickets = () => {
  const { id_ticket } = useParams(); // Captura o parâmetro da URL

  // Estados para armazenar dados e controlar o comportamento do componente
  const [chamado, setChamado] = useState({});

  const [respostas, setRespostas] = useState([]);


    const [resposta, setResposta] = useState("");

  // Busca os detalhes do chamado pelo ID
  useEffect(() => {
    const fetchChamado = async () => {
      try {
        const response = await api.get(`/tickets/${id_ticket}`);

        setChamado(response.data.ticket);

        if (response.data.respostas.length > 0) {
          const respostasComAnexos = await Promise.all(
            response.data.respostas.map(async (resposta) => {
              try {
                // Busca os anexos para cada resposta
                const anexoR = await api.get(`/anexo/${resposta.id_resposta}`);
                return {
                  ...resposta,
                  anexos: anexoR.data.length > 0 ? anexoR.data : [],
                };
              } catch (error) {
                console.error(
                  `Erro ao buscar anexos para a resposta ${resposta.id_resposta}:`,
                  error
                );
                return { ...resposta, anexos: [] }; // Garante que a resposta será mostrada sem anexos
              }
            })
          );

          setRespostas(respostasComAnexos);
        } else {
          setRespostas([]); // Garante que o estado não fique indefinido
        }
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
      }
    };
    fetchChamado();
  }, [id_ticket, resposta, editOk]);

  return {};
};

export default useTickets;
