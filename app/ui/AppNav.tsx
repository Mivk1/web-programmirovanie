"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoAuth } from "../providers/DemoAuthProvider";

const links = [
    { href: "/start", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
    { href: "/about", label: "О проекте" },
    { href: "/cabinet", label: "Кабинет" },
];

export default function AppNav() {
    const pathname = usePathname();
    const { user, logout } = useDemoAuth();

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    return (
        <nav className="app-nav">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link ${isActive(link.href) ? "active" : ""}`}
                    aria-current={isActive(link.href) ? "page" : undefined}
                >
                    {link.label}
                </Link>
            ))}

            {user ? (
                <>
                    <span className="nav-user">{user.name}</span>
                    <button className="nav-button" onClick={logout}>
                        Выйти
                    </button>
                </>
            ) : (
                <Link href="/auth/login" className="nav-link">
                    Войти
                </Link>
            )}
        </nav>
    );
}