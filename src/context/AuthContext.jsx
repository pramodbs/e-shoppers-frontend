import React, {createContext, useContext, useEffect, useState} from 'react'

const Ctx = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(() => {
        const s = localStorage.getItem('esh_user');
        return s ? JSON.parse(s) : null;
    });
    const login = (data) => {
        setUser(data);
        localStorage.setItem('esh_user', JSON.stringify(data))
    }
    const logout = () => {
        setUser(null);
        localStorage.removeItem('esh_user')
    }
    return <Ctx.Provider value={{user, login, logout}}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
