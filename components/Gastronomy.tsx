import Image from "next/image";

export default function Gastronomy() {
    return (
      <section id="gastronomia" className="py-16 bg-neutral-900 text-white">
        <h2 className="text-3xl font-bold text-yellow-700 text-center">Gastronomía</h2>
        <div className="mt-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Imagen */}
          <Image
            src="/images/gastronomia.jpg"
            alt="Gastronomía Andaluza"
            width={300}
            height={250}
            className="w-full md:w-1/2 rounded-lg shadow-lg"
          />
          {/* Descripción y Menú */}
          <div className="md:w-1/2">
            <p className="text-lg text-neutral-400 mb-4">
              Descubre la rica tradición gastronómica andaluza con nuestras tapas y bebidas. Cada plato ha sido diseñado para ofrecerte el auténtico sabor de nuestra tierra.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Tapas: Jamón ibérico, queso manchego, croquetas caseras.</li>
              <li>Bebidas: Vinos de Jerez, rebujito, cervezas artesanales.</li>
              <li>Postres: Tarta de Santiago, pestiños.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }