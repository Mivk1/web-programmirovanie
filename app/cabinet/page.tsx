"use client";

import Link from "next/link";
import { useDemoAuth } from "../providers/DemoAuthProvider";

export default function CabinetPage() {
    const { user, logout } = useDemoAuth();

    if (!user) {
        return (
            <main>
                <h1>Личный кабинет</h1>
                <p>Вы не вошли в учебный аккаунт.</p>
                <Link className="main-link" href="/auth/login">
                    Перейти ко входу
                </Link>
            </main>
        );
    }

    return (
        <main>
            <h1>Личный кабинет</h1>
            <p>Имя: {user.name}</p>
            <p>Email: {user.email}</p>
            <button className="button-secondary" onClick={logout}>
                Выйти
            </button>
        </main>
    );
}