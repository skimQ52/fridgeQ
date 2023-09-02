import { useState } from "react"
import FormInput from "./FormInput";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email, password);
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Log in</h2>
                <FormInput onChange={(e) => setEmail(e.target.value)} value={email.value} type="email" placeholder="johndoe@something.com" label="Email:"/>
                <FormInput onChange={(e) => setPassword(e.target.value)} value={password.value} type="password" placeholder="*********" label="Password:"/>
                <button disabled={isLoading} className='glow-on-hover confirmButton'>Log in</button>
                { error && <div className="error">{error}</div>}
            </form>
        </div>
        
    )
}

export default Login;