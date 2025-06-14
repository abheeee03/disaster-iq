import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DisasterIQ - Disaster Monitoring & Observability Platform",
  description: "A comprehensive disaster monitoring and observability platform built with modern cloud-native technologies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full ${inter.className}`}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 container py-6">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
