import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { dark } from "@clerk/themes";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Navbar from "@/app/components/navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediTrack",
  description: "Medicine reminder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <Navbar />
            {children}
            <Analytics />

            <Toaster
              theme="dark"
              richColors
              icons={{
                success: "🔥",
              }}
              swipeDirections={["right", "left"]}
              position="top-center"
              expand
              duration={2000}
              visibleToasts={1}
              toastOptions={{
                style: {
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                },
              }}
            />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
