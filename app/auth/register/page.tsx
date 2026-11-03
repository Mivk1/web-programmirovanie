"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoAuth } from "../../providers/DemoAuthProvider";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useDemoAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (password.length < 6) {
            setError("Пароль должен быть не короче 6 символов");
            return;
        }

        if (password !== confirm) {
            setError("Пароли не совпадают");
            return;
        }

        setError("");
        register(name, email);
        router.push("/cabinet");
    };

    return (
        <main>
            <h1>Регистрация</h1>
            <p className="form-warning">
                Это учебный прототип. Пользователь не сохраняется в базе данных.
            </p>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="register-name">Имя</label>
                    <input
                        id="register-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="register-password">Пароль</label>
                    <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="register-confirm">Повтор пароля</label>
                    <input
                        id="register-confirm"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="form-error">{error}</p>}

                <button className="button-primary" type="submit">
                    Зарегистрироваться
                </button>
            </form>

            <p>
                Уже есть аккаунт?{" "}
                <Link className="text-link" href="/auth/login">
                    Войти
                </Link>
            </p>
        </main>
    );
}