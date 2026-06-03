import type { Metadata } from "next";
import { Inter, Lora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BackgroundSystem from "@/components/ui/BackgroundSystem";
import FloatingJarvisButton from "@/components/ui/FloatingJarvisButton";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Uttam Tiwari • Jarvis AI OS Portfolio",
  description: "Explore Uttam's capabilities in generative AI engineering, RAG databases, agentic LangGraph systems, and deep machine learning architectures via Jarvis AI OS.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Uttam Tiwari • Jarvis AI OS Portfolio",
    description: "AI Engineer specializing in Generative AI, RAG, and Agentic Workflows.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${lora.variable} ${spaceGrotesk.variable} antialiased text-white font-sans bg-background-deep selection:bg-brand-indigo/30 selection:text-white`}
      >
        <BackgroundSystem />
        <Navbar />
        <main className="relative z-10 w-full min-h-screen">
          {children}
        </main>
        <FloatingJarvisButton />
        <Toaster theme="dark" closeButton position="bottom-right" toastOptions={{
          style: {
            background: "#121316",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
            fontFamily: "var(--font-space-grotesk)"
          }
        }} />
      </body>
    </html>
  );
}
