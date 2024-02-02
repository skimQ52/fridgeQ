import React, {RefObject} from "react";

interface TextInputProps {
    label: string;
    refer: RefObject<HTMLInputElement>;
    placeholder: string;
    maxLength: number;
}

export default function TextInput(props: TextInputProps) {
    return (
        <div className='FormInput'>
            <label className='labelInput'>{props.label}</label>
            <input type={"text"} maxLength={props.maxLength} ref={props.refer} className='input' placeholder={props.placeholder}/>
        </div>
    )
}