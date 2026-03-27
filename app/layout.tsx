import type { Metadata } from "next";
import "./globals.css";
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: "LeadOps",
  description: "Lead intelligence and outreach CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0c0e14] text-[#e8eaf0] antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto pb-16 md:pb-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
