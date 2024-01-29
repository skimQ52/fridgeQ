import React from 'react'

interface LoginInputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    type: string;
    placeholder: string;
    label: string;
}

const LoginInput: React.FC<LoginInputProps> = (props) => {
    const { onChange, value, type, placeholder, label } = props;
    return (
        <div className='FormInput'>
            <label className='labelInput'>{label}</label>
            <input 
                className='input' 
                type={type} 
                placeholder={placeholder} 
                onChange={onChange} 
                value={value}/>
        </div>
    )
}

export default LoginInput;
