// PageContext.js
import { createContext, useContext, useState } from 'react';

const PageContext = createContext();

export function PageProvider({ children }) {
    const [currentPage, setCurrentPage] = useState('');

    return (
        <PageContext.Provider value={{ currentPage, setCurrentPage }}>
            {children}
        </PageContext.Provider>
    );
}

export function usePage() {
    return useContext(PageContext);
}