import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "@/app/_components/header/page";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alex Delivery App",
  description: "Delivery App created by AlexFQC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
