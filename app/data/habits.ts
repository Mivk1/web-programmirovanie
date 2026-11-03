// Описывает привычку, привязанную к месту её выполнения.
export type Habit = {
    id: string;
    title: string;
    description: string;
    frequency: string;
    place: string;
    image: string;
    imageAlt: string;
    latitude: number;
    longitude: number;
};

export const habits: Habit[] = [
    {
        id: "reading",
        title: "Чтение",
        description: "Читать 20 страниц каждый день",
        frequency: "Ежедневно",
        place: "Российская национальная библиотека, Санкт-Петербург",
        image: "/images/places/library.jpg",
        imageAlt: "Читальный зал библиотеки с высокими стеллажами",
        latitude: 59.9331,
        longitude: 30.3357,
    },
    {
        id: "sport",
        title: "Бег",
        description: "Тренировка 30 минут на свежем воздухе",
        frequency: "3 раза в неделю",
        place: "Парк 300-летия Санкт-Петербурга",
        image: "/images/places/park.jpg",
        imageAlt: "Аллея парка с беговой дорожкой",
        latitude: 59.9821,
        longitude: 30.203,
    },
    {
        id: "meditation",
        title: "Медитация",
        description: "10 минут тишины и осознанности",
        frequency: "Ежедневно",
        place: "Летний сад, Санкт-Петербург",
        image: "/images/places/garden.jpg",
        imageAlt: "Тихая аллея Летнего сада с фонтаном",
        latitude: 59.9445,
        longitude: 30.3347,
    },
];

export function getHabit(id: string): Habit | undefined {
    return habits.find((habit) => habit.id === id);
}