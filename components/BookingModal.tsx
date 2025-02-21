import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let root = document.getElementById("modal-root");

    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }

    setModalRoot(root);

    return () => {
      if (root) {
        root.classList.remove("modal-open"); // ❌ Remueve la clase si el modal se cierra
      }
    };
  }, []);

  useEffect(() => {
    if (modalRoot) {
      if (isOpen) {
        modalRoot.classList.add("modal-open"); // ✅ Muestra el modal
      } else {
        modalRoot.classList.remove("modal-open"); // ✅ Lo oculta
      }
    }
  }, [isOpen, modalRoot]);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[99999]">
      <div className="bg-stone-200 text-black p-6 w-full max-w-lg rounded-lg shadow-lg relative border border-gray-300">
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
