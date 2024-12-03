import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import stylesGlobal from '../../styles/styleGlobal.module.css';
import PaginaPadrao from '../../components/paginaPadrao';
import Card from '../../components/card';
import api from '../../services/api';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

function Chamados() {
    const navigate = useNavigate();
    const [contadorTodos, setContadorTodos] = useState(0);
    const [contadorAtMim, setContadorAtMim] = useState(0);
    const [contadorAtAOutros, setContadorAtAOutros] = useState(0);
    const [contadorNaoAt, setContadorNaoAt] = useState(0);
    const [chamados, setChamados] = useState([]);
    const [filteredChamados, setFilteredChamados] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [busca, setBusca] = useState('');
    const [filtro, setFiltro] = useState({
        prioridade: '',
        status: '',
    });

    // Decodificar o token e carregar dados do usuário
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsuario(decoded);
                console.log('Usuário decodificado:', decoded);
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
            }
        }
    }, []);

    // Buscar chamados do backend e atualizar contadores
    useEffect(() => {
        const fetchChamados = async () => {
            try {
                const response = await api.get('/tickets/');
                setChamados(response.data);
                setFilteredChamados(response.data); // Inicializa com todos os chamados
                atualizarContadores(response.data);
            } catch (error) {
                console.error('Erro ao buscar tickets:', error);
            }
        };

        fetchChamados();
    }, []);

    const atualizarContadores = (dados) => {
        setContadorTodos(dados.length);
        setContadorAtMim(dados.filter(chamado => chamado.atribuido_a === usuario.nome_usuario).length);
        setContadorAtAOutros(dados.filter(chamado => chamado.atribuido_a !== usuario.nome_usuario).length);
        setContadorNaoAt(dados.filter(chamado => !chamado.atribuido_a).length);
    };

    // Aplicar filtros e busca combinados
    const aplicarFiltros = () => {
        let filtrados = [...chamados]; // Sempre trabalhar com os dados originais

        // Busca
        if (busca.trim() !== '') {
            filtrados = filtrados.filter(chamado =>
                chamado.codigo_ticket?.toLowerCase().includes(busca.toLowerCase()) ||
                chamado.nome_requisitante?.toLowerCase().includes(busca.toLowerCase()) ||
                chamado.assunto?.toLowerCase().includes(busca.toLowerCase()) ||
                chamado.atribuido_a?.toLowerCase().includes(busca.toLowerCase())
            );
        }

        // Filtro por prioridade
        if (filtro.prioridade) {
            filtrados = filtrados.filter(chamado => chamado.nivel_prioridade === filtro.prioridade);
        }

        // Filtro por status
        if (filtro.status) {
            filtrados = filtrados.filter(chamado => chamado.status === filtro.status);
        }

        setFilteredChamados(filtrados);
    };

    // Atualiza os filtros toda vez que há mudanças nos valores
    useEffect(() => {
        aplicarFiltros();
    }, [busca, filtro, chamados]);

    const handleChamadoClick = (chamado) => {
        navigate(`/chamado/${chamado.id_ticket}`);
    };

    return (
        <PaginaPadrao>
            <div className={styles.containerCards}>
                <div className={styles.containerCardsColuna}>
                    <Card>
                        <div className={styles.containerButtonsChamados}>
                            <input
                                type="button"
                                value={`Todos (${contadorTodos})`}
                                className={styles.buttonChamados}
                                onClick={() => setFilteredChamados(chamados)}
                            />
                            <input
                                type="button"
                                value={`Atribuído a mim (${contadorAtMim})`}
                                className={styles.buttonChamados}
                                onClick={() => setFilteredChamados(chamados.filter(chamado => chamado.atribuido_a === usuario.nome_usuario))}
                            />
                            <input
                                type="button"
                                value={`Atribuído a outros (${contadorAtAOutros})`}
                                className={styles.buttonChamados}
                                onClick={() => setFilteredChamados(chamados.filter(chamado => chamado.atribuido_a && chamado.atribuido_a !== usuario.nome_usuario))}
                            />
                            <input
                                type="button"
                                value={`Não atribuído (${contadorNaoAt})`}
                                className={styles.buttonChamados}
                                onClick={() => setFilteredChamados(chamados.filter(chamado => !chamado.atribuido_a))}
                            />
                        </div>
                    </Card>
                    <Card>
                        <table className={stylesGlobal.table}>
                            <thead>
                                <tr>
                                    <th>Código do Ticket</th>
                                    <th>Técnico</th>
                                    <th>Solicitante</th>
                                    <th>Assunto</th>
                                    <th>Status</th>
                                    <th>Prioridade</th>
                                </tr>
                            </thead>
                            <tbody className={stylesGlobal.tbody}>
                                {filteredChamados.map(chamado => (
                                    <tr key={chamado.id_ticket} onClick={() => handleChamadoClick(chamado)}>
                                        <td>{chamado.codigo_ticket}</td>
                                        <td>{chamado.atribuido_a || 'Não atribuído'}</td>
                                        <td>{chamado.nome_requisitante || 'N/A'}</td>
                                        <td>{chamado.assunto}</td>
                                        <td>{chamado.status}</td>
                                        <td>{chamado.nivel_prioridade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
                <div className={styles.containerCardsLinha}>
                    <Card>
                        <div className={styles.containerFilter}>
                            <label className={styles.labelFilter}>Pesquisar por:</label>
                            <input
                                type="text"
                                className={styles.inputFilter}
                                placeholder="Digite sua pesquisa"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                            />
                        </div>
                    </Card>
                    <Card>
                        <div className={styles.containerFilter}>
                            <h3 className={styles.titleFilter}>Filtrar por:</h3>
                            <label className={styles.labelFilter}>Nível de Prioridade:</label>
                            <select
                                className={styles.selectFilter}
                                value={filtro.prioridade}
                                onChange={(e) => setFiltro({ ...filtro, prioridade: e.target.value })}
                            >
                                <option value="">Escolha a prioridade</option>
                                <option value="Baixo">Baixa</option>
                                <option value="Médio">Média</option>
                                <option value="Alto">Alta</option>
                            </select>
                            <label className={styles.labelFilter}>Status:</label>
                            <select
                                className={styles.selectFilter}
                                value={filtro.status}
                                onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
                            >
                                <option value="">Escolha o status</option>
                                <option value="aguardando">Aguardando classificação</option>
                                <option value="atendimento">Em atendimento</option>
                                <option value="suspenso">Suspenso</option>
                                <option value="fechado">Fechado</option>
                            </select>
                            <span
                                className={styles.spanLink}
                                role="button"
                                tabIndex="0"
                                onClick={() => setFiltro({ prioridade: '', status: '' })}
                            >
                                Limpar filtro
                            </span>
                        </div>
                    </Card>
                </div>
            </div>
        </PaginaPadrao>
    );
}

export default Chamados;
