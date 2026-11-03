// Описывает переиспользуемую карточку одной возможности приложения.
// Типизирует входные свойства компонента.
type FeatureCardProps = Readonly<{
    title: string;
    description: string;
}>;
// основной компонент этого файла.
export default function FeatureCard({
    title,
    description,
}: FeatureCardProps) {
    // возвращает JSX-разметку, которую React выведет на странице.
    return (
        <article className="feature-card">
            <h3>{title}</h3>
            <p>{description}</p>
        </article>
    );
}