
import React from 'react';
import './style.css';

function Painel({ children }) {
    return (
        <section className='container-painel'>
            {children}
        </section>
    );
}

export default Painel;