import { useState } from "react"
import FormInput from "./FormInput";
import { useLogin } from "../hooks/useLogin";
import { Link } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email, password);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Log in</h2>
                <FormInput onChange={(e) => setEmail(e.target.value)} value={email.value} type="email" placeholder="johndoe@something.com" label="Email:"/>
                <FormInput onChange={(e) => setPassword(e.target.value)} value={password.value} type="password" placeholder="*********" label="Password:"/>
                { error && <div className="error">{error}</div>}
                <button disabled={isLoading} className='glow-on-hover confirmButton'>Log in</button>
                <Link className="login-link" to="/signup">Register instead</Link>
            </form>
        </div>
        
    )
}

export default Login;