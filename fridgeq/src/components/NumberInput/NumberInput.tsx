import React, {RefObject} from "react";

export interface NumberInputProps {
    label: string;
    refer: RefObject<HTMLInputElement>;
    placeholder: string
}

export default function NumberInput(props: NumberInputProps) {
    return (
        <div className='FormInput'>
            <label htmlFor="numberInput" className='labelInput'>{props.label}</label>
            <input id="numberInput" type={"number"} min={1} max={99} ref={props.refer} className='input'
                   placeholder={props.placeholder}/>
        </div>
    )
}