import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    dispatch: React.Dispatch<AuthAction>;
  }

  interface AuthState {
    user: User | null;
}

interface AuthAction {
    type: 'LOGIN' | 'LOGOUT';
    payload?: User;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload || null };
        case 'LOGOUT':
            return { user: null };
        default:
            return state;
    }
};

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const user: User | null = storedUser ? JSON.parse(storedUser) : null;

        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }
    }, []); 

    console.log('AuthContext state: ', state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};