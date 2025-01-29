"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center bg-[url('/images/hero.jpg')] text-yellow-500">
        <h1 className="text-4xl md:text-6xl font-bold text-center drop-shadow-lg">
          Vive el Flamenco en el Corazón de Sevilla
        </h1>
        <h2 className="mt-4 text-xl md:text-2xl text-center">
          Una experiencia diferente y única en el corazón de Sevilla
        </h2>
        <button
          onClick={handleOpenModal}
          className="mt-8 px-6 py-3 bg-red-600 text-white font-medium text-lg rounded-md shadow-lg hover:bg-red-700"
        >
          Reserva tu entrada
        </button>
      </section>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default HeroSection;
