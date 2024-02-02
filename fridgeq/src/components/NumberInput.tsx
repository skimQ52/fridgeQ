import React, {RefObject} from "react";

interface NumberInputProps {
    label: string;
    refer: RefObject<HTMLInputElement>;
    placeholder: string
}

export default function NumberInput(props: NumberInputProps) {
    return (
        <div className='FormInput'>
            <label className='labelInput'>{props.label}</label>
            <input type={"number"} min={1} max={99} ref={props.refer} className='input' placeholder={props.placeholder}/>
        </div>
    )
}