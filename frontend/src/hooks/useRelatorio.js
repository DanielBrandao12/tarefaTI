import { useCallback, useState, useEffect } from "react";
import useTickets from "./useTickets";
import formatarData from "./formatDate";


const useRelatorio = () => {
    const { allTickets, fetchChamados } = useTickets();
    
    
    const [filtro, setFiltro] = useState([]);
    const [todayTickets, setTodayTickets] = useState([]);
    const [weekTickets, setWeekTickets] = useState([]);
    const [monthTickets, setMonthTickets] = useState([]);
    const [yearTickets, setYearTickets] = useState([]);
  
    useEffect(() => {
        fetchChamados();
    }, []);

    useEffect(() => {
        if (allTickets.length === 0) return;

        const hoje = new Date();
     

        const primeiroDiaSemana = new Date(hoje);
        primeiroDiaSemana.setDate(hoje.getDate() - hoje.getDay()); // Domingo
        const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const primeiroDiaAno = new Date(hoje.getFullYear(), 0, 1);

        const chamadosHoje = [];
        const chamadosSemana = [];
        const chamadosMes = [];
        const chamadosAno = [];

        allTickets.forEach((chamado) => {
            const chamadoData = chamado.data_criacao;
         console.log(chamadoData , formatarData(hoje))

            if (chamadoData === formatarData(hoje)) chamadosHoje.push(chamado);
            if (chamadoData >= primeiroDiaSemana) chamadosSemana.push(chamado);
            if (chamadoData >= primeiroDiaMes) chamadosMes.push(chamado);
            if (chamadoData >= primeiroDiaAno) chamadosAno.push(chamado);
        });

        setTodayTickets(chamadosHoje);
        console.log(chamadosHoje)
        setWeekTickets(chamadosSemana);
        setMonthTickets(chamadosMes);
        setYearTickets(chamadosAno);
    }, [allTickets]);

    const filtrarPorPeriodo = useCallback((inicio, fim) => {
        if (!inicio || !fim) return;

        const inicioDate = new Date(inicio);
        const fimDate = new Date(fim);

        const chamadosFiltrados = allTickets.filter((chamado) => {
            const chamadoData = new Date(chamado.data_criacao);
            return chamadoData >= inicioDate && chamadoData <= fimDate;
        });

        setFiltro(chamadosFiltrados);
    }, [allTickets]);

    return {
        filtro,
        todayTickets,
        weekTickets,
        monthTickets,
        yearTickets,
        allTickets,
        setFiltro,
        filtrarPorPeriodo
    };
};

export default useRelatorio;
