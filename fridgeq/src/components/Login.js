import { useState } from "react"
import FormInput from "./FormInput";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(email, password);
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Log in</h2>
                <FormInput onChange={(e) => setEmail(e.target.value)} value={email.value} type="email" placeholder="johndoe@something.com" label="Email:"/>
                <FormInput onChange={(e) => setPassword(e.target.value)} value={password.value} type="password" placeholder="*********" label="Password:"/>
                <button className='glow-on-hover confirmButton'>Log in</button>
            </form>
        </div>
        
    )
}

export default Login;