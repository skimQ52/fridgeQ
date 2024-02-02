import React, {ReactNode, useEffect, useState} from 'react'

interface PopupProps {
    children: ReactNode,
    onClick: () => void
}

const Popup = (props: PopupProps) => {
    const { children, onClick } = props;

    return (
        <div className='Popup'>
            <div className='popup-inner'>
                {children}
                <button onClick={onClick} className="small-btn close-btn">X</button>
            </div>
        </div>
    );
}

export default Popup