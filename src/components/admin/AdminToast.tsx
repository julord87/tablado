"use client";

import { useSearchParams } from "next/navigation";

export default function AdminToast() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  if (!message) return null;

  return (
    <div className="bg-green-500 text-white p-4 rounded mb-4 font-sans">
      {message}
    </div>
  );
}
