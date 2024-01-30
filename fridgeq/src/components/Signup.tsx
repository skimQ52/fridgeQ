import React, { useState } from "react"
import LoginInput from "./Login/LoginInput";
import { useSignup } from "../hooks/useSignup";
import { Link } from 'react-router-dom';
import FridgeWise from '../imgs/FridgeWise.png';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await signup(email, password, name);
    };

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setEmail(inputValue);
    };

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setPassword(inputValue);
    };

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setName(inputValue);
    };
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <img src={FridgeWise} alt="FridgeWise Logo"/>
                <h2>Sign up</h2>
                <LoginInput onChange={handleChangeEmail} value={email} type="email" placeholder="johndoe@something.com" label="Email:"/>
                <LoginInput onChange={handleChangePassword} value={password} type="password" placeholder="*********" label="Password:"/>
                <LoginInput onChange={handleChangeName} value={name} type="text" placeholder="Daniel" label="Name:"/>
                {error && <div className="error">{error}</div>}
                <button disabled={isLoading ?? undefined} className='glow-on-hover confirmButton'>Create Account</button>
                <Link className="login-link" to="/login">Login instead</Link>
            </form>
        </div>
        
    )
}

export default Signup;