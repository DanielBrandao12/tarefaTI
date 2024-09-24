import React from 'react'
import styles from './style.module.css'
import PaginaPadrao from '../../components/paginaPadrao'
import Card from '../../components/card'
function Chamados() {
  return (
    <PaginaPadrao>
        <Card>   
            <input type='button' value={'Teste'}  className='button-padrao'/>
            <input type='button' value={'Teste'}  className='button-padrao'/>
            <input type='button' value={'Teste'}  className='button-padrao'/>
            <input type='button' value={'Teste'}  className='button-padrao'/>
        </Card>
        <Card>
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
                    <tr>
                        <td>362</td>
                        <td>20/09/2024 - 16:30</td>
                        <td>Daniel</td>
                        <td>Problema com Teams</td>
                        <td>Em atendimento</td>
                        <td>Baixa</td>
                    </tr>
                    <tr>
                        <td>362</td>
                        <td>20/09/2024 - 16:30</td>
                        <td>Daniel</td>
                        <td>Problema com Teams</td>
                        <td>Em atendimento</td>
                        <td>Baixa</td>
                    </tr>
                    <tr>
                        <td>362</td>
                        <td>20/09/2024 - 16:30</td>
                        <td>Daniel</td>
                        <td>Problema com Teams</td>
                        <td>Em atendimento</td>
                        <td>Baixa</td>
                    </tr>
                    
                </tbody>
            </table>
        </Card>
    </PaginaPadrao>
  )
}

export default Chamados
