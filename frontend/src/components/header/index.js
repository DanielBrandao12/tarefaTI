import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faUserPen, faUserPlus, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.css';
import Cookies from 'js-cookie';
import { confirmAlert } from 'react-confirm-alert'; // Importa a função confirmAlert
import api from '../../services/api';

function Header() {
    const navigate = useNavigate(); // Hook para navegação programática

    const [displayEdit, setDisplayEdit] = useState(''); //define o display do ContainerEditUser
    const [isEditing, setIsEditing] = useState(false); //Estado do icone arrow

    //Expandir e esconder caixa para opções do usuário (ContainerEditUser)
    const toggleEditUser = () => {
        setIsEditing(!isEditing);
        setDisplayEdit(isEditing ? 'none' : 'flex');
    };

    const handleChamado = () => {
        navigate('/criarChamado')
    }


    const handleRemoveToken = async () => {
        try {
            // Solicitar logout ao backend
            await api.get('/login/logout');

            // Remover cookies
            Cookies.remove('connect.sid', { path: '/' });
            Cookies.remove('token', { path: '/' });

            // Redirecionar para a página de login após logout
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Lidar com erros, talvez mostrar uma mensagem ao usuário
        }
    };

    const confirmaCloncuir = () => {
        toggleEditUser()
        confirmAlert({
            title: 'Confirmação',
            message: 'Deseja fazer logout?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: handleRemoveToken
                },
                {
                    label: 'Não'
                }
            ]
        });
    };


    return (
        <div className={styles.containerPainel}>
            <div className={styles.containerButtonchamado}>
                <input type='button' className='button-padrao' value='Novo Chamado' onClick={handleChamado} />
            </div>

            <div className={styles.containerDadosUser}>
                <div className={styles.containerCircle}>D</div>
                <div className={styles.user} onClick={toggleEditUser}>
                    <span>User 2.0</span>
                    <FontAwesomeIcon
                        icon={isEditing ? faChevronUp : faChevronDown}
                        className='icon'
                    />
                </div>
            </div>
            <div
                className={styles.containerEditUser}
                style={{ display: displayEdit }}
            >
                <div className={styles.titleOption}>
                    <div>
                        <FontAwesomeIcon icon={faUserPen} />
                    </div>
                    <p>Editar Perfil</p>
                </div>
                <div className={styles.titleOption}>
                    <div>
                        <FontAwesomeIcon icon={faUserPlus} />
                    </div>
                    <p>Criar Novo usuário</p>
                </div>
                <div className={styles.titleOption}>
                    <div>
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <p>Usuários</p>
                </div>
                <div className={styles.titleOptionLogout} >
                    <div>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </div>
                    <p  >
                        Sair
                    </p>

                </div>


            </div>
        </div>
    );
}

export default Header;
