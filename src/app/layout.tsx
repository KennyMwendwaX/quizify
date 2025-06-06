import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";
import NavbarWrapper from "./components/navbar-wrapper";

export const metadata: Metadata = {
  title: "Quizify",
  description:
    "Challenge your mind, create quizzes, and compete in our interactive learning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavbarWrapper>{children}</NavbarWrapper>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
