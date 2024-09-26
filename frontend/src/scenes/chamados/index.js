import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import styles from './style.module.css'
import PaginaPadrao from '../../components/paginaPadrao'
import Card from '../../components/card'
function Chamados() {
    const navigate = useNavigate(); // Hook para navegação programática

    const [contadorTodos, setContadorTodos] = useState(0);
    const [contadorAtribuidoAMim, setContadorAtribuidoAMim] = useState(0);
    const [contadorAtribuidoAOutros, setContadorAtribuidoAOutros] = useState(0);
    const [contadorNaoAtribuido, setContadorNaoAtribuido] = useState(0);
    const chamados = [
        {
            id: 362,
            atualizado: "20/09/2024 - 16:30",
            criadoPor: "Daniel",
            assunto: "Problema com Teams",
            status: "Em atendimento",
            prioridade: "Baixa"
        },
        {
            id: 363,
            atualizado: "21/09/2024 - 09:15",
            criadoPor: "Márcio",
            assunto: "Erro no login",
            status: "Pendente",
            prioridade: "Alta"
        },
        {
            id: 364,
            atualizado: "22/09/2024 - 11:00",
            criadoPor: "Wilson",
            assunto: "Dúvida sobre software",
            status: "Fechado",
            prioridade: "Média"
        },
        {
            id: 365,
            atualizado: "22/09/2024 - 15:45",
            criadoPor: "Daniel",
            assunto: "Problema com impressora",
            status: "Em andamento",
            prioridade: "Baixa"
        },
        {
            id: 366,
            atualizado: "23/09/2024 - 13:20",
            criadoPor: "Clayton",
            assunto: "Solicitação de novo equipamento",
            status: "Aguardando aprovação",
            prioridade: "Alta"
        },
        {
            id: 367,
            atualizado: "24/09/2024 - 10:00",
            criadoPor: "Wilson",
            assunto: "Problema de conexão de internet",
            status: "Em atendimento",
            prioridade: "Média"
        },
        {
            id: 368,
            atualizado: "24/09/2024 - 11:30",
            criadoPor: "Wilson",
            assunto: "Atualização de software",
            status: "Fechado",
            prioridade: "Baixa"
        },
        {
            id: 369,
            atualizado: "25/09/2024 - 14:00",
            criadoPor: "Daniel",
            assunto: "Reunião agendada não aparece",
            status: "Pendente",
            prioridade: "Alta"
        },
        {
            id: 370,
            atualizado: "26/09/2024 - 08:15",
            criadoPor: "Daniel",
            assunto: "Problema com e-mail",
            status: "Em atendimento",
            prioridade: "Alta"
        },
        {
            id: 371,
            atualizado: "26/09/2024 - 09:45",
            criadoPor: "Clayton",
            assunto: "Requisição de acesso ao sistema",
            status: "Aguardando informações",
            prioridade: "Média"
        },
        {
            id: 372,
            atualizado: "27/09/2024 - 10:30",
            criadoPor: "Márcio",
            assunto: "Erro ao gerar relatório",
            status: "Em atendimento",
            prioridade: "Baixa"
        },
        {
            id: 373,
            atualizado: "27/09/2024 - 14:00",
            criadoPor: "Wilson",
            assunto: "Atualização de senha",
            status: "Fechado",
            prioridade: "Média"
        },
        {
            id: 374,
            atualizado: "28/09/2024 - 11:00",
            criadoPor: "Daniel",
            assunto: "Problema com calendário",
            status: "Pendente",
            prioridade: "Alta"
        },
        {
            id: 375,
            atualizado: "28/09/2024 - 12:30",
            criadoPor: "Clayton",
            assunto: "Solicitação de treinamento",
            status: "Em andamento",
            prioridade: "Média"
        }
    ];
    
    

    const handleChamado =() => {
        navigate('/chamado')
    }
    return (
        <PaginaPadrao>
            <div className={styles.containerCards}>
                <div className={styles.containerCardsColuna}>
                    <Card>
                        <div className={styles.containerButtonsChamados}>

                            <input
                                type='button'
                                value={`Todos ${contadorTodos}`}
                                className={styles.buttonChamados}
                                
                            />
                            <input
                                type='button'
                                value={`Atribuído a mim ${contadorAtribuidoAMim}`}
                                className={styles.buttonChamados}
                            
                            />
                            <input
                                type='button'
                                value={`Atribuído a outros ${contadorAtribuidoAOutros}`}
                                className={styles.buttonChamados}
                                
                            />
                            <input
                                type='button'
                                value={`Não atribuído ${contadorNaoAtribuido}`}
                                className={styles.buttonChamados}
                            
                            />
                        </div>
                    </Card>
                    <Card>
                        <div >
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Atualizado</th>
                                        <th>Criado por</th>
                                        <th>Assunto</th>
                                        <th>Status</th>
                                        <th>Prioridade</th>
                                    </tr>
                                </thead>
                                <tbody className={styles.tbody}>
                                {chamados.map(chamado => (
                            <tr key={chamado.id} onClick={() => handleChamado(chamado)}>
                                <td>{chamado.id}</td>
                                <td>{chamado.atualizado}</td>
                                <td>{chamado.criadoPor}</td>
                                <td>{chamado.assunto}</td>
                                <td>{chamado.status}</td>
                                <td>{chamado.prioridade}</td>
                            </tr>
                        ))}
                                

                                </tbody>
                            </table>
                        </div>
                    </Card>

                </div>
                <div className={styles.containerCardsLinha}>
                        <Card>
                            <div className={styles.containerFilter}>
                                <label className={styles.labelFilter}>Pesquisar por:</label>
                                <select className={styles.selectFilter}>
                                    <option disabled selected>Pesquise por</option>
                                    <option>ID</option>
                                    <option>Nome criador</option>
                                    <option>Email</option>
                                    <option>Assunto</option>
                                </select>
                                <label className={styles.labelFilter}>Pesquisar:</label>
                                <input type='text' className={styles.inputFilter} />
                                <input  type='button' className={styles.buttonChamados} value={'Buscar'} />
                            </div>

                        </Card>
                        <Card>
                            <div className={styles.containerFilter}>

                                <h3 className={styles.titleFilter}>Filtrar por:</h3>

                                <label className={styles.labelFilter}>Nível de Prioridade:</label>
                                <select className={styles.selectFilter}>
                                <option disabled selected>Prioridade</option>
                                    <option>Baixa</option>
                                    <option>Média</option>
                                    <option>Alta</option>
                                </select>
                                <label className={styles.labelFilter}>Status:</label>
                                <select className={styles.selectFilter}>
                                <option disabled selected>Status</option>
                                    <option>Aguardando classificação</option>
                                    <option>Em atendimento</option>
                                    <option>Suspenso</option>
                                    <option>Fechado</option>
                                </select>
                                <span className={styles.spanLink}>Limpar filtro</span>
                            </div>

                        </Card>
                    </div>
            </div>
        </PaginaPadrao>
    )
}

export default Chamados
