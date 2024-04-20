import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState<null | boolean>(null);
    const [isLoading, setIsLoading] = useState<null | boolean>(null); // signup takes a sec (hash/salt)
    const { dispatch } = useAuthContext();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        let browser = 'browser'

        const response = await fetch('http://localhost:8000/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, "device_name": browser})
        });
        console.log(JSON.stringify({email, password, "device_name": browser}));
        try {
            const json = await response.json();
            if (!json.token) {
                console.log("HERE");
                setIsLoading(false);
                setError(json.error);
            }
            else {
                console.log(json);
                localStorage.setItem('user', JSON.stringify(json));
                dispatch({type: 'LOGIN', payload: json});

                setIsLoading(false);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    return { login, isLoading, error };
} 