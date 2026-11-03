"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    useEffect,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useDemoAuth } from "../../providers/DemoAuthProvider";
import styles from "./styles.module.css";

const links = [
    { href: "/start", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
    { href: "/gallery", label: "Галерея и карта" },
    { href: "/about", label: "О проекте" },
    { href: "/cabinet", label: "Кабинет" },
];

const menuFocusableSelector = [
    "a[href]",
    "button:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

function isActive(pathname: string, href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function BurgerMenu() {
    const pathname = usePathname();
    const { user, logout } = useDemoAuth();
    const [open, setOpen] = useState(false);
    const openButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.documentElement.style.overflow;
        const openButton = openButtonRef.current;
        document.documentElement.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
            document.documentElement.style.overflow = previousOverflow;
            openButton?.focus();
        };
    }, [open]);

    function closeMenu() {
        setOpen(false);
    }

    function keepFocusInside(event: ReactKeyboardEvent<HTMLElement>) {
        if (event.key !== "Tab") return;
        const focusable = Array.from(
            panelRef.current?.querySelectorAll<HTMLElement>(
                menuFocusableSelector,
            ) ?? [],
        );
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    return (
        <>
            <button
                ref={openButtonRef}
                className={styles.openButton}
                type="button"
                aria-label="Открыть меню"
                aria-expanded={open}
                aria-controls="main-menu-panel"
                onClick={() => setOpen(true)}
            >
                <span aria-hidden="true">☰</span>
            </button>

            {open ? (
                <div
                    className={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeMenu();
                    }}
                >
                    <section
                        ref={panelRef}
                        id="main-menu-panel"
                        className={styles.panel}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Основное меню"
                        onKeyDown={keepFocusInside}
                    >
                        <div className={styles.header}>
                            <Link href="/start" onClick={closeMenu}>
                                HabitTracker
                            </Link>
                            <button
                                ref={closeButtonRef}
                                type="button"
                                aria-label="Закрыть меню"
                                onClick={closeMenu}
                            >
                                ×
                            </button>
                        </div>

                        <nav aria-label="Разделы приложения">
                            <ul className={styles.list}>
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            aria-current={
                                                isActive(pathname, link.href) ? "page" : undefined
                                            }
                                            onClick={closeMenu}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className={styles.authRow}>
                            {user ? (
                                <>
                                    <span>Пользователь: {user.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            logout();
                                            closeMenu();
                                        }}
                                    >
                                        Выйти
                                    </button>
                                </>
                            ) : (
                                <Link href="/auth/login" onClick={closeMenu}>
                                    Войти / зарегистрироваться
                                </Link>
                            )}
                        </div>
                    </section>
                </div>
            ) : null}
        </>
    );
}