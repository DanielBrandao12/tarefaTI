import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { confirmAlert } from 'react-confirm-alert'; // Importa a função confirmAlert
import api from '../../services/api';

function Menu() {
    const navigate = useNavigate(); // Hook para navegação programática


    return (
        <div className='nav'>
            <div className='container-nav-title'>
                <h1>Service Desk 2.0</h1>
                {/* <FontAwesomeIcon icon={faBars} fontSize={28} color='#fff' /> */}
            </div>
            <div className='container-nav-options'>
                <div>
                    <Link className='link' to={'/'}>Início</Link>
                    <Link className='link' to={'/chamados'}>Chamados</Link>
                    <Link className='link' to={'/relatorio'}>Relátorios</Link>
                    <Link className='link' to={'/category'}>Categorias</Link>
                    <Link className='link' to={'/'}>Status</Link>
                   {/* <Link className='link' to={'/newticket'}>Teste</Link>*/}
                    {/*<Link className='link' to={'/relatorioInventario'}>Inventario</Link>*/}
              
                </div>
          
            
            </div>
        </div>
    );
}

export default Menu;
