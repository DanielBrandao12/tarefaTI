import React, {useState} from 'react'
import PaginaPadrao from '../../components/paginaPadrao'
import Card from '../../components/card'



import stylesGlobal from '../../styles/styleGlobal.module.css'
import style from './style.module.css'


function Relatorio() {
    return (
        <PaginaPadrao>
            <Card>
              
            </Card>
                <Card>
                <div >
                            <table className={stylesGlobal.table}>
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Novos Chamados</th>
                                        <th>Aguardando Classificação</th>
                                        <th>Em atendimento</th>
                                        <th>Suspenso</th>
                                        <th>Fechado</th>
                                    </tr>
                                </thead>
                                <tbody className={stylesGlobal.tbody} >
                            
                            <tr style={{cursor:'auto'}} >
                                <td>07-10-2024</td>
                                <td>5</td>
                                <td>1</td>
                                <td>2</td>
                                <td>0</td>
                                <td>10</td>

                            </tr>
                        
                                

                                </tbody>
                            </table>
                        </div>

                </Card>

        </PaginaPadrao>
    )
}

export default Relatorio
