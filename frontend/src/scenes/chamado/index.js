import React from 'react'
import styles from './style.module.css'


import PaginaPadrao from '../../components/paginaPadrao'
import Card from '../../components/card'
function Chamado() {


  
  return (

    <PaginaPadrao>
   
        <div className={styles.containerDivCards}>
          <div className={styles.containerFirstCard}>
            <Card>
              <h3>Instalação de softwares INTERFATECS</h3>
              <span>teste</span>

            </Card>
         

          </div>
          <div className={styles.containerSecondCard}>
            <Card>
              <h1>Service Desk 2.0ssssssssssss</h1>
              <span>teste</span>
            </Card>
          </div>
        </div>
      

    </PaginaPadrao>

  )
}

export default Chamado
