import React from 'react'

export default function FormInput(props) {
  return (
    <div className='FormInput'>
        <label className='labelInput'>{props.label}</label>
        <input type={props.type} min={props.min} max={props.max} ref={props.refer} className='input' placeholder={props.placeholder}/>
    </div>
  )
}
