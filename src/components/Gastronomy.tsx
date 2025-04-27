export default function Gastronomy() {
  return (
    <section className="py-16 bg-neutral-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Imagen */}
        <div>
          <img
            src="/images/gastronomia2.jpg"
            alt="Gastronomía típica andaluza"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Texto */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-yellow-700">
            Gastronomía Típica Andaluza
          </h2>
          <h3 className="mt-4 text-lg text-neutral-400">
            Descubre los sabores de Andalucía con una selección de tapas y
            bebidas tradicionales que complementan tu experiencia flamenca.
          </h3>
          <div className="p-6">
            <ul className="mt-6 space-y-3">
              <p className="text-neutral-400">
                🍷 Variedad de vinos y pcores locales
              </p>
              <p className="text-neutral-400">
                🥘 Platos tradicionales como gazpacho y pescaíto frito
              </p>
              <p className="text-neutral-400">
                🥖 Pan y aceites de oliva premium
              </p>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
