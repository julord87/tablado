
type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-2xl font-bold mb-4">Reserva tus Entradas</h2>
        <form>
          <label className="block mb-2 text-sm font-medium">
            Fecha
            <input
              type="date"
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </label>
          <label className="block mb-2 text-sm font-medium">
            Horario
            <select
              className="w-full mt-1 p-2 border rounded-md"
              required
            >
              <option value="">Selecciona un horario</option>
              <option value="18:00">18:00</option>
              <option value="19:45">19:45</option>
              <option value="21:30">21:30</option>
            </select>
          </label>
          <label className="block mb-4 text-sm font-medium">
            Número de entradas
            <input
              type="number"
              min="1"
              max="10"
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
          >
            Confirmar
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-600 py-2 rounded-md hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
