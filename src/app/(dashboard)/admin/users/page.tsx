import { getUsers } from "@/actions/user";
import UserTableClient from "./UserTableClient";

export default async function UserManagementPage() {
  const users = await getUsers();
  return <UserTableClient initialUsers={users} />;
}
