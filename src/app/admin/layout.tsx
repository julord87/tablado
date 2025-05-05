import { AdminHeader } from "@/components/AdminHeader";
import { auth } from "../../../auth/auth";
import { ClientSessionProvider } from "@/components";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div>
      <AdminHeader userName={session?.user?.name || "Invitado"} />
      <ClientSessionProvider>
        <main>{children}</main>
      </ClientSessionProvider>
    </div>
  );
}
