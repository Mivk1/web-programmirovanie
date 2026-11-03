import Link from "next/link";
import FeatureCard from "../ui/FeatureCard";

export default function StartPage() {
    return (
        <main>
            <header>
                <p className="eyebrow">Трекер привычек</p>
                <h1>HabitTracker</h1>
                <p>
                    HabitTracker помогает систематически отслеживать полезные привычки и видеть прогресс.
                </p>
            </header>

            <section>
                <h2>Основные функции</h2>
                <div className="feature-list">
                    <FeatureCard
                        title="Добавление привычек"
                        description="Создавайте новые привычки с названием, описанием и частотой."
                    />
                    <FeatureCard
                        title="Отметка выполнения"
                        description="Отмечайте выполнение за сегодня и следите за непрерывностью."
                    />
                    <FeatureCard
                        title="Статистика прогресса"
                        description="Смотрите, сколько дней подряд вы выполняете привычку."
                    />
                </div>
            </section>

            <Link className="main-link" href="/catalog">
                Перейти в каталог привычек
            </Link>
        </main>
    );
}