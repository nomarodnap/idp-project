import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { UserProvider } from "@/components/UserProvider";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, session as sessionTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSystemPhase } from "@/actions/settings";
import AnnouncementPopup from "@/components/AnnouncementPopup";
import { AutoLogout } from "@/components/AutoLogout";

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

  const phase = await getSystemPhase();

  return (
    <UserProvider initialUser={dbUser}>
      <div className="flex h-full min-h-screen bg-muted/20 print:bg-white">
        <div className="print:hidden shrink-0 h-full">
          <Sidebar currentPhase={phase} />
        </div>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible">
          <div className="print:hidden">
            <Header currentPhase={phase} />
          </div>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 print:p-0 print:overflow-visible">
            {children}
          </main>
        </div>
      </div>
      <AnnouncementPopup />
      <AutoLogout />
    </UserProvider>
  );
}
