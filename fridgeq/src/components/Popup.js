import React from 'react'
import Fade from 'react-reveal/Fade';

function Popup(props) {
  return (props.trigger) ? ( // If trigger is true it will show
    <Fade>
    <div className='Popup'>
        <div className='popup-inner'>
            <button onClick={() => props.setTrigger(false)} className="close-btn">Close</button>
            {props.children}
        </div>
    </div>
    </Fade>
  ) : "";
}

export default Popup