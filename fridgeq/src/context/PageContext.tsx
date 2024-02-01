import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageContextProps {
    currentPage: string;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
    const [currentPage, setCurrentPage] = useState('');

    return (
        <PageContext.Provider value={{ currentPage, setCurrentPage }}>
            {children}
        </PageContext.Provider>
    );
}

export function usePage() {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error('usePage must be used within a PageProvider');
    }
    return context;
}