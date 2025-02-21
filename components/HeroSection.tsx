"use client";

import { useState } from "react";
import Modal from "./BookingModal"; // Asegúrate de que el nombre del archivo es correcto

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative flex flex-col items-center justify-center h-screen hero-bg text-yellow-500 overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-bold text-center drop-shadow-lg">
          Vive el Flamenco en el Corazón de Sevilla
        </h1>
        <h2 className="mt-4 text-xl md:text-2xl text-center">
          Una experiencia diferente y única en el corazón de Sevilla
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-8 px-6 py-3 bg-red-600 text-white font-medium text-lg rounded-md shadow-lg hover:bg-red-700"
        >
          Reserva tu entrada
        </button>
      </section>

      {/* Modal de reserva */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-4xl font-bold text-center mb-4">
          Reserva tu Entrada
        </h2>
        <p className="text-center text-gray-700">
          Selecciona la fecha y confirma tu reserva.
        </p>

        {/* Selector de fecha */}
        <div className="mt-4">
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <p className="mt-4 text-center text-gray-700">Selecciona la función.</p>

        {/* Selector de horario */}
        <select className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500">
          <option value="1">18:00 hs</option>
          <option value="2">19:45 hs</option>
          <option value="3">21:30 hs</option>
        </select>

        {/* Botones */}
        <div className="flex items-center justify-center mt-6 p-4">
          <button className="bg-red-600 text-white text-xl rounded-md hover:bg-red-700 p-4">
            Confirmar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default HeroSection;
