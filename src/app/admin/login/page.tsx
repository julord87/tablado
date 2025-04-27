"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Email o contraseña incorrectos");
      setIsLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="p-6 max-w-sm mx-auto mt-20 shadow-lg rounded bg-white flex flex-col gap-4"
    >
      <h1 className="text-3xl font-bold mb-4 text-center">Iniciar sesión</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        className="block w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black transition"
        required
        autoComplete="email"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(""); }}
        className="block w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black transition"
        required
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded transition hover:bg-gray-800 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        )}
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
}
