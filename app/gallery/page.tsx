// Подключает интерактивную галерею к серверной странице маршрута.
import PlacesGallery from "./_components/PlacesGallery";

export default function GalleryPage() {
    return (
        <main>
            <h1>Галерея мест для привычек</h1>
            <p>
                Выберите карточку или метку на карте, чтобы открыть подробное окно.
            </p>
            <PlacesGallery />
        </main>
    );
}