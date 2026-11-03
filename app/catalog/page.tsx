import Link from "next/link";
import { habits } from "../data/habits";

export default function CatalogPage() {
    return (
        <main>
            <h1>Каталог привычек</h1>
            <div className="catalog-list">
                {habits.map((habit) => (
                    <Link
                        key={habit.id}
                        href={`/catalog/${habit.id}`}
                        className="catalog-card"
                    >
                        <h3>{habit.title}</h3>
                        <p>{habit.description}</p>
                        <p>Частота: {habit.frequency}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}