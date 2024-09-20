import React from 'react'

import Menu from '../menu'
import Painel from '../painel'
import Header from '../header'

import styles from './style.module.css'

function PaginaPadrao({children}) {
  return (
    <main className="container-main">
        <Menu/>
        <Painel>
            <Header/>
            <div className={styles.containerPagina} >
                {children}
            </div>
        </Painel>
    </main>
  )
}

export default PaginaPadrao
