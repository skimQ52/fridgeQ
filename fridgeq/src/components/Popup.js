import React from 'react'
import Fade from 'react-reveal/Fade';

function Popup(props) {
  return (props.trigger) ? ( // If trigger is true it will show
    <Fade>
    <div className='Popup'>
        <div className='popup-inner'>
            {props.children}
            <button onClick={() => props.setTrigger(prevData => ({...prevData, trigger: false}))} className="close-btn">X</button>
        </div>
    </div>
    </Fade>
  ) : "";
}

export default Popup