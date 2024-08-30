
import './style.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function Menu() {

    

    return (
    
            <nav>
                <div className='container-nav-title'>

                    <h1>Tarefas TI</h1>
                    {/*<FontAwesomeIcon icon={faBars} fontSize={28} color='#fff'/>*/}
                </div>
                <div className='container-nav-options'>

                   
                        <Link className='link' to={'/'}>Tarefas</Link>
                        <Link className='link' to={'/tarefas'}>Tarefas Concluídas</Link>
                        <Link className='link' to={'/login'}>Login</Link>
                    
                </div>
            </nav>
   
    );
}

export default Menu;
