import type { Metadata } from "next";
import { Poppins, Saira_Condensed } from "next/font/google";
import Footer from "./components/Footer";
import CookieConsentWrapper from "@/components/cookieconsent";
import "./globals.css";

const sairaCondensed = Saira_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-saira",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${sairaCondensed.variable} antialiased`}
      >
        {children}
        <Footer />
        <CookieConsentWrapper />
      </body>
    </html>
  );
}
