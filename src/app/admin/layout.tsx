import { AdminHeader } from "@/components/AdminHeader"; // lo pasamos a componentes
import { auth } from "../../../auth/auth"; // tu función auth

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div>
      <AdminHeader userName={session?.user?.name || "Invitado"} />
      <main>{children}</main>
    </div>
  );
}
