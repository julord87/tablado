import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de control</h1>
    </div>
  );
}
