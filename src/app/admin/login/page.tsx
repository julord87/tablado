"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/admin");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto items-center m-20 shadow-md rounded">
      <h1 className="text-2xl mb-4">Iniciar sesión</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
      />
      <button className="bg-black text-white px-4 py-2 rounded">Ingresar</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
