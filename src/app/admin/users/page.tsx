import { getUsers } from "@/actions/userActions";
import AdminUsersClient from "@/components/admin/UsersAdminTable";

export default async function AdminUsersPage() {
  const users = await getUsers(); // Esto está bien acá porque este componente es del lado del servidor

  return <AdminUsersClient users={users} />;
}
