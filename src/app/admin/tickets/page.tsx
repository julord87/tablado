import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/auth";
import { redirect } from "next/navigation";
import TicketTypeList from "@/components/admin/TicketTypeList";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="m-8 space-y-6">
      <h1 className="text-4xl font-bold mb-4">Tipos de tickets</h1>
      
      {/* Tipos de tickets */}
      <TicketTypeList />
    </div>
  );
}
