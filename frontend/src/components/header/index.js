import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faUserPen, faUserPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.css';

function Header() {
    const navigate = useNavigate(); // Hook para navegação programática

    const [displayEdit, setDisplayEdit] = useState(''); //define o display do ContainerEditUser
    const [isEditing, setIsEditing] = useState(false); //Estado do icone arrow

    //Expandir e esconder caixa para opções do usuário (ContainerEditUser)
    const toggleEditUser = () => {
        setIsEditing(!isEditing);
        setDisplayEdit(isEditing ? 'none' : 'flex');
    };

    const handleChamado =() => {
        navigate('/criarChamado')
    }

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
                <div className={styles.titleOptionLogout}>
                    <div>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </div>
                    <p>Logout</p>
                </div>


            </div>
        </div>
    );
}

export default Header;
