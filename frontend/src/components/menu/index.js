import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { confirmAlert } from 'react-confirm-alert'; // Importa a função confirmAlert
import api from '../../services/api';

function Menu() {
    const navigate = useNavigate(); // Hook para navegação programática

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
        <nav>
            <div className='container-nav-title'>
                <h1>Tarefas TI</h1>
                {/* <FontAwesomeIcon icon={faBars} fontSize={28} color='#fff' /> */}
            </div>
            <div className='container-nav-options'>
                <div>
                    <Link className='link' to={'/'}>Tarefas</Link>
                    <Link className='link' to={'/tarefas'}>Tarefas Concluídas</Link>
                </div>
                <Link className='link sair' onClick={(e) => { e.preventDefault(); confirmaCloncuir(); }}>
                    Sair
                </Link>
            </div>
        </nav>
    );
}

export default Menu;
