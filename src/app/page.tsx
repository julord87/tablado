import { Metadata } from "next";
import { ReviewsCarousel } from "../../components/Reviews";
import Gastronomy from "../../components/Gastronomy";

// Metadata global para SEO y accesibilidad
export const metadata: Metadata = {
  title: "Tablao Flamenco Las Setas",
  description:
    "Vive el flamenco más auténtico en Sevilla. Reserva tu entrada y disfruta de un espectáculo inolvidable.",
  keywords: "flamenco Sevilla, espectáculo flamenco, tablao Las Setas",
};

export default function Home() {
  return (
    <main className="font-soria text-gray-800">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center bg-[url('/images/hero.jpg')] text-yellow-500">
        <h1 className="text-4xl md:text-6xl font-bold text-center drop-shadow-lg text-">
          Vive el Flamenco en el Corazón de Sevilla
        </h1>
        <h2 className="mt-4 text-xl md:text-2xl text-center">
          Una experiencia diferente y única en el corazón de Sevilla
        </h2>
        <button className="mt-8 px-6 py-3 bg-red-600 text-white font-medium text-lg rounded-md shadow-lg hover:bg-red-700">
          Reserva tu entrada
        </button>
      </section>

      {/* Show Details Section */}
      <section id="espectaculo" className="py-16 bg-neutral-900 text-center">
        <h2 className="text-3xl font-bold text-yellow-700">
          Sobre el Espectáculo
        </h2>
        <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
          Descubre la magia del flamenco con 8 artistas en escena, tres pases
          diarios y una ubicación privilegiada en Las Setas de Sevilla.
        </p>
        <ul className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <li className="p-6 bg-neutral-900 rounded-md shadow-md">
            <h3 className="text-xl text-yellow-700 font-semibold">Horarios</h3>
            <p className="text-neutral-400 ">
              Todos los días: 18:00, 19:45, y 21:30
            </p>
          </li>
          <li className="p-6 bg-neutral-900 rounded-md shadow-md">
            <h3 className="text-xl text-yellow-700 font-semibold">Artistas</h3>
            <p className="text-neutral-400 ">
              Baile, cante y guitarra con artistas de renombre.
            </p>
          </li>
          <li className="p-6 bg-neutral-900 rounded-md shadow-md">
            <h3 className="text-xl text-yellow-700 font-semibold">Duración</h3>
            <p className="text-neutral-400 ">
              1 hora y media con un descanso de 10 minutos.
            </p>
          </li>
        </ul>
      </section>

      {/* Booking Section */}
      <section id="entradas" className="py-16 text-center bg-stone-200">
        <h2 className="text-3xl font-bold">Reserva tus Entradas</h2>
        <p className="mt-4 text-lg">
          Selecciona la fecha y horario para tu experiencia flamenca.
        </p>
        <div className="mt-8 flex justify-center">
          <button className="px-8 py-3 bg-red-600 text-white font-medium text-lg rounded-md shadow-lg hover:bg-red-700">
            Calendario
          </button>
        </div>
      </section>

      {/* Gastronomy Section */}
      <Gastronomy />

      {/* Reviews Section */}
      <ReviewsCarousel />

      {/* Contact and Location Section */}
      <section
        id="contacto-ubicacion"
        className="py-16 bg-neutral-900 text-white"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl text-center font-bold text-yellow-700 ">Contáctanos</h2>
            <p className="mt-4 text-lg text-neutral-400">
              ¿Tienes dudas? Escríbenos y te responderemos rápidamente.
            </p>
            <form className="mt-8">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full p-4 mb-4 border border-gray-700 bg-neutral-800 rounded-md text-white"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 mb-4 border border-gray-700 bg-neutral-800 rounded-md text-white"
              />
              <textarea
                placeholder="Mensaje"
                rows={4}
                className="w-full p-4 mb-4 border border-gray-700 bg-neutral-800 rounded-md text-white"
              ></textarea>
              <button className="w-full px-6 py-3 bg-red-600 text-white font-medium text-lg rounded-md shadow-lg hover:bg-red-700">
                Enviar
              </button>
            </form>
          </div>

          {/* Location */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-yellow-700">Ubicación</h2>
            <p className="mt-4 text-lg text-neutral-400">
              Encuéntranos en el corazón de Sevilla.
            </p>
            <div className="mt-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3171.498594024361!2d-5.993784825243408!3d37.39710467982616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd126d42e2b5fd49%3A0x8f6dfde6b40eabc6!2sC.%20Feria%2C%2031%2C%20bajo%2C%20Casco%20Antiguo%2C%2041003%20Sevilla%2C%20Espa%C3%B1a!5e0!3m2!1ses!2sus!4v1618323217657!5m2!1ses!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-neutral-900 text-white text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Tablao Flamenco La Jacinta. Todos
          los derechos reservados.
        </p>
      </footer>
    </main>
  );
}
