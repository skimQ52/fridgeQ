import { useState } from "react"
import FormInput from "./FormInput";
import { useSignup } from "../hooks/useSignup";
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(email, password, name); // From useSignup hook
    }
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Sign up</h2>
                <FormInput onChange={(e) => setEmail(e.target.value)} value={email.value} type="email" placeholder="johndoe@something.com" label="Email:"/>
                <FormInput onChange={(e) => setPassword(e.target.value)} value={password.value} type="password" placeholder="*********" label="Password:"/>
                <FormInput onChange={(e) => setName(e.target.value)} value={name.value} type="text" placeholder="Daniel" label="Name:"/>
                {error && <div className="error">{error}</div>}
                <button disabled={isLoading} className='glow-on-hover confirmButton'>Create Account</button>
                <Link className="login-link" to="/login">Login instead</Link>
            </form>
        </div>
        
    )
}

export default Signup;