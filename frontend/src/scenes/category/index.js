import React, {useState} from 'react'
import PaginaPadrao from '../../components/paginaPadrao'
import Card from '../../components/card'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import stylesGlobal from '../../styles/styleGlobal.module.css'
import style from './style.module.css'


function Category() {
    return (
        <PaginaPadrao>
            <Card>
                <div className={style.containerInputAdd}>
                    <input className={style.inputConfig }></input>
                    <input type='button' value='Adicionar Categoria' className={stylesGlobal.buttonPadrao} />
                </div>
            </Card>
                <Card>
                <div >
                            <table className={stylesGlobal.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Criado por</th>
                                        <th>Status</th>
                                        <th>Data</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className={stylesGlobal.tbody} >
                            
                            <tr style={{cursor:'auto'}} >
                                <td>001</td>
                                <td>Software</td>
                                <td>Daniel</td>
                                <td>Ativo</td>
                                <td>07-10-2024</td>
                                <td className={style.tdIcones}>
                                    <FontAwesomeIcon icon={faEdit} className={style.icon} />
                                    <FontAwesomeIcon icon={faTrashCan} className={style.icon}/>
                                </td>

                            </tr>
                        
                                

                                </tbody>
                            </table>
                        </div>

                </Card>

        </PaginaPadrao>
    )
}

export default Category
