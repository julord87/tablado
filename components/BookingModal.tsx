"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop="blur" // Fondo desenfocado
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50" // Fondo translúcido detrás del modal
    >
      <ModalContent
        className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-auto"
        style={{ backgroundColor: "white" }} // Forzamos el color blanco por estilos en línea
      >
        <ModalHeader
          className="text-xl font-bold text-gray-900 border-b pb-2"
        >
          Reserva tu Entrada
        </ModalHeader>
        <ModalBody className="mt-4 text-gray-600">
          <p>Selecciona la fecha y horario para tu experiencia flamenca.</p>
          <form className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Horario
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="">Selecciona un horario</option>
                <option value="18:00">18:00</option>
                <option value="19:45">19:45</option>
                <option value="21:30">21:30</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número de Entradas
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                defaultValue="1"
                required
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Confirmar
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookingModal;
