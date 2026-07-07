import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { UserProvider } from "@/components/UserProvider";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, session as sessionTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  let dbUser = null;

  if (sessionToken) {
    try {
      const [sessionRecord] = await db
        .select()
        .from(sessionTable)
        .where(eq(sessionTable.token, sessionToken));

      if (sessionRecord) {
        const [fetchedUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, sessionRecord.userId));

        if (fetchedUser) {
          dbUser = fetchedUser;
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  return (
    <UserProvider initialUser={dbUser}>
      <div className="flex h-full min-h-screen bg-muted/20">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
