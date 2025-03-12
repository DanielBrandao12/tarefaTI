import './style.css';
import { Link } from 'react-router-dom';


function Menu() {
  


    return (
        <div className='nav'>
            <div className='container-nav-title'>
                <h1>Service Desk 2.0</h1>
                {/* <FontAwesomeIcon icon={faBars} fontSize={28} color='#fff' /> */}
            </div>
            <div className='container-nav-options'>
                <div>
                    <Link className='link' to={'/'}>Início</Link>
                    <Link className='link' to={'/tickets'}>Chamados Abertos</Link>
                    <Link className='link' to={'/ticketsClose'}>Chamados Fechados</Link>
                    <Link className='link' to={'/relatorio'}>Relátorios</Link>
                    <Link className='link' to={'/category'}>Categorias</Link>
                    <Link className='link' to={'/status'}>Status</Link>
                   {/* <Link className='link' to={'/newticket'}>Teste</Link>*/}
                    {/*<Link className='link' to={'/relatorioInventario'}>Inventario</Link>*/}
              
                </div>
          
            
            </div>
        </div>
    );
}

export default Menu;
