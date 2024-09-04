
import React from 'react';
import './style.css';

function Painel({ children }) {
    return (
        <div className='container-painel'>
            {children}
        </div>
    );
}

export default Painel;