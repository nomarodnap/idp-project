import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { UserProvider } from "@/components/UserProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
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
