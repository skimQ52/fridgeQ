import { useState } from "react"
import FormInput from "./FormInput";
import { useSignup } from "../hooks/useSignup";

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
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Sign up</h2>
                <FormInput onChange={(e) => setEmail(e.target.value)} value={email.value} type="email" placeholder="johndoe@something.com" label="Email:"/>
                <FormInput onChange={(e) => setPassword(e.target.value)} value={password.value} type="password" label="Password:"/>
                <FormInput onChange={(e) => setName(e.target.value)} value={name.value} type="text" placeholder="John" label="Name:"/>
                <button disabled={isLoading} className='glow-on-hover confirmButton'>Create Account</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
        
    )
}

export default Signup;