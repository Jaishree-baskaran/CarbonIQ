import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CarbonIQ India",
  description: "AI Emission Intelligence",
  icons: {
    icon: "/icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex text-[#291100] bg-[#ECF5E2]`}>
        <AuthContextProvider>
          <div className="relative z-10 flex w-full">
            {children}
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
