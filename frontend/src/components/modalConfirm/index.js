import React from 'react';
import './style.css'


function ModalConfirm({ container, value}) {



    return (

        <div className='container-confirm-principal' style={{display:container}}>
            <div className='container-confirm'>
                
                <h1>{value}</h1>

            </div>
        </div>

    );
}

export default ModalConfirm;