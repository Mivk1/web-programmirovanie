"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoAuth } from "../../providers/DemoAuthProvider";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useDemoAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (password.length < 6) {
            setError("Пароль должен быть не короче 6 символов");
            return;
        }

        setError("");
        login(email);
        router.push("/cabinet");
    };

    return (
        <main>
            <h1>Вход</h1>
            <p className="form-warning">
                Это учебный прототип. Данные не отправляются на сервер и не проверяются.
            </p>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="login-password">Пароль</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="form-error">{error}</p>}

                <button className="button-primary" type="submit">
                    Войти
                </button>
            </form>

            <p>
                Нет аккаунта?{" "}
                <Link className="text-link" href="/auth/register">
                    Зарегистрироваться
                </Link>
            </p>
        </main>
    );
}