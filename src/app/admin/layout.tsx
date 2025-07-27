import { AdminHeader } from "@/components/AdminHeader";
import { ClientSessionProvider } from "@/components";
import { auth } from "../../../auth/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <ClientSessionProvider session={session}>
      <AdminHeader />
      <main>{children}</main>
    </ClientSessionProvider>
  );
}
