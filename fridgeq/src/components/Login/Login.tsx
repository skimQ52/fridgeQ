import React, { useState } from "react"
import LoginInput from "./LoginInput.tsx";
import { useLogin } from "../../hooks/useLogin";
import { Link } from 'react-router-dom';
import FridgeWise from '../../imgs/FridgeWise.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await login(email, password);
    };

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setEmail(inputValue);
    };

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setPassword(inputValue);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <img src={FridgeWise} alt="FridgeWise Logo"/>
                <h2>Log in</h2>
                <LoginInput onChange={handleChangeEmail} value={email} type="email" placeholder="johndoe@something.com" label="Email:"/>
                <LoginInput onChange={handleChangePassword} value={password} type="password" placeholder="*********" label="Password:"/>
                { error && <div className="error">{error}</div>}
                <button disabled={isLoading ?? undefined} className='glow-on-hover confirmButton'>Log in</button>
                <Link className="login-link" to="/signup">Register instead</Link>
            </form>
        </div>
        
    );

}

export default Login;