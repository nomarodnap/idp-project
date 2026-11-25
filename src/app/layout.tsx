import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://idp.fisheries.go.th"),
  title: "ระบบจัดทำแผนพัฒนารายบุคคล (IDP) - กรมประมง",
  description: "ระบบจัดทำแผนพัฒนารายบุคคล (Individual Development Plan) ของกรมประมง",
  verification: {
    google: "VksC1XJpXTE9VBjrIytOqPUL4M78mvNBv_UZT1J2AqI",
  },
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
  openGraph: {
    title: "ระบบจัดทำแผนพัฒนารายบุคคล (IDP) - กรมประมง",
    description: "ระบบจัดทำแผนพัฒนารายบุคคล (Individual Development Plan) ของกรมประมง",
    url: "https://idp.fisheries.go.th",
    siteName: "ระบบจัดทำแผนพัฒนารายบุคคล (IDP) - กรมประมง",
    locale: "th_TH",
    type: "website",
    images: [
      {
        url: "/logo-fisheries.png",
        alt: "โลโก้กรมประมง",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${sarabun.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full min-h-screen bg-muted/20" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
