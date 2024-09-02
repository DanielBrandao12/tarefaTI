
import './style.css'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
function Menu() {


    const handleRemoveToken = async ()=>{
        await api.get('/login/logout')
       // Deletar o cookie `connect.sid`
         Cookies.remove('connect.sid', { path: '/' })
        Cookies.remove('token')
    }

    return (
    
            <nav>
                <div className='container-nav-title'>

                    <h1>Tarefas TI</h1>
                    {/*<FontAwesomeIcon icon={faBars} fontSize={28} color='#fff'/>*/}
                </div>
                <div className='container-nav-options'>
                        <div>
                            <Link className='link' to={'/'}>Tarefas</Link>
                            <Link className='link' to={'/tarefas'}>Tarefas Concluídas</Link>

                        </div>
                   
                        <Link className='link sair' onClick={handleRemoveToken} to={'/Login'}>Sair</Link>
                    
                </div>
            </nav>
   
    );
}

export default Menu;
