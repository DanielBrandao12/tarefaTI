import React, { useState, useEffect } from 'react';
import PaginaPadrao from '../../components/paginaPadrao';
import Card from '../../components/card';

import api from '../../services/api';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import stylesGlobal from '../../styles/styleGlobal.module.css';
import style from './style.module.css';

function Status() {



    //Alterar o modal para o popup!!
    return (
        <PaginaPadrao>


            <div className={style.containerAddStatus}>
                <div>
                    <h3>Adicionar Status</h3>
                </div>
                <div>
                    <label>Status</label>
                    <div>
                        <input className={stylesGlobal.inputTextChamado} />
                    </div>
                    <label>Status</label>
                    <div>
                        <select className={stylesGlobal.selectChamado} >
                                    <option value=''>Escolha uma opção</option>
                            </select>
                    </div>
                </div>

            </div>


            <Card>
                <div>
                    <table className={stylesGlobal.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Status</th>
                                <th>Situação</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody className={stylesGlobal.tbody}>
                            <tr>
                                <td>item 1</td>
                                <td>item 1</td>
                                <td>item 1</td>
                                <td >
                                    <FontAwesomeIcon icon={faEdit} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

        </PaginaPadrao>
    );
}

export default Status;
