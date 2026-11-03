"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

export type User = {
    name: string;
    email: string;
};

type DemoAuthContextValue = {
    user: User | null;
    login: (email: string) => void;
    register: (name: string, email: string) => void;
    logout: () => void;
};

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

export default function DemoAuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);

    const login = (email: string) => {
        const name = email.split("@")[0] || "Пользователь";
        setUser({ name, email });
    };

    const register = (name: string, email: string) => {
        setUser({ name, email });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <DemoAuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </DemoAuthContext.Provider>
    );
}

export function useDemoAuth() {
    const context = useContext(DemoAuthContext);
    if (!context) {
        throw new Error("useDemoAuth должен использоваться внутри DemoAuthProvider");
    }
    return context;
}