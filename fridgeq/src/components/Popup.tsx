import React, {ReactNode, useEffect, useState} from 'react'
// import { Fade } from "react-awesome-reveal/Fade";

interface PopupProps {
    children: ReactNode,
    onClick: () => void
}

const Popup = (props: PopupProps) => {
    const { children, onClick } = props;

    return ( // If trigger is true it will show
    // <Fade>
        <div className='Popup'>
            <div className='popup-inner'>
                {children}
                <button onClick={onClick} className="small-btn close-btn">X</button>
            </div>
        </div>
    // </Fade>
    );
}

export default Popup