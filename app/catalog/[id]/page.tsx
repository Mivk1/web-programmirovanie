import Link from "next/link";
import { notFound } from "next/navigation";
import { habits } from "../../data/habits";

type HabitPageProps = {
    params: Promise<{ id: string }>;
};

export default async function HabitPage({ params }: HabitPageProps) {
    const { id } = await params;
    const habit = habits.find((item) => item.id === id);

    if (!habit) {
        notFound();
    }

    return (
        <main>
            <h1>{habit.title}</h1>
            <p>{habit.description}</p>
            <p>Частота: {habit.frequency}</p>
            <Link className="main-link" href="/catalog">
                Вернуться в каталог
            </Link>
        </main>
    );
}