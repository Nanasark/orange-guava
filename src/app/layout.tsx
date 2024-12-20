import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Header from "../components/header.";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "guava-pear",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
         
        <ThirdwebProvider>
          <Header/>
          {children}</ThirdwebProvider>
      </body>
    </html>
  );
}
