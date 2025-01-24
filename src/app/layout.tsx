import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Header from "../components/header.";
import  {ChainProvider} from "../context/ChainProvider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "orange-guava",
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
        <ChainProvider>
        <ThirdwebProvider>
          <Header />
          {children}
        </ThirdwebProvider>
        </ChainProvider>
      </body>
    </html>
  );
}
