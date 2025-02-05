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
      backdrop="blur"
      className="fixed inset-0 flex items-center justify-center z-[9999]"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <ModalContent className="p-6 bg-white rounded-lg shadow-lg z-50 relative">
          <ModalHeader className="text-xl font-bold">
            Reserva tu Entrada
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-600">
              Selecciona la fecha y horario para tu experiencia flamenca.
            </p>
            <form className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Fecha</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Horario</label>
                <select className="w-full p-2 border rounded-md" required>
                  <option value="">Selecciona un horario</option>
                  <option value="18:00">18:00</option>
                  <option value="19:45">19:45</option>
                  <option value="21:30">21:30</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Número de Entradas
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 border rounded-md"
                  defaultValue="1"
                  required
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Confirmar
            </button>
          </ModalFooter>
        </ModalContent>
      </div>
    </Modal>
  );
};

export default BookingModal;
