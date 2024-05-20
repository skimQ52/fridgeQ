import {useState} from 'react';
import {useAuthContext} from './useAuthContext';

export const useSignup = () => {
    const [error, setError] = useState<null | boolean>(null);
    const [isLoading, setIsLoading] = useState<null | boolean>(null); // signup takes a sec (hash/salt)
    const { dispatch } = useAuthContext();

    const signup = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        setError(null);

        const device_name = 'browser';
        let body = JSON.stringify({email, password, name, device_name});
        const response = await fetch('http://localhost:8000/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            // save user to local storage
            localStorage.setItem('user', JSON.stringify(json));
            
            // update auth context
            dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
        }
    }

    return { signup, isLoading, error };
} 